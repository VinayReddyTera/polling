import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/pages/services/api.service';
import { io } from "socket.io-client";
import { EncryptionService } from '../pages/services/encryption.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {

  pollForm: any;
  errorMessage: any;
  year: number = new Date().getFullYear();
  submitted: boolean = false;
  nominees: any;
  appName: any = environment.appName;
  socket = io(environment.domain);

  constructor(public router: Router, private encrypt: EncryptionService,
    private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.fetchNominees();
    // Initialize poll form with form builder
    this.pollForm = this.fb.group({
      data: ['', [Validators.required]] // 'data' field is required, responsible for selecting a nominee before submitting
    });
  }

  // Method to handle poll voting
  poll() {
    // Check if user has already voted
    let pollToken = localStorage.getItem('pollToken');
    if (pollToken !== null) {
      // If user has already voted, show error message
      let msgData: any = {
        severity: "error",
        summary: 'Error',
        detail: "Already Voted, try again in 6 Hours",
        life: 5000
      }
      let data: any = ''
      try {
        data = this.encrypt.deCrypt(pollToken);
        if (data >= new Date()) {
          // If user has already voted, calculate remaining time and show error message
          msgData.detail = this.getTimeDifference(data)
          this.apiService.sendMessage(msgData);
          return
        }
        else if (data < new Date()) {
          // If previous vote has expired, remove previous vote and allow voting again
          localStorage.removeItem('pollToken');
          this.voteNow();
        }
        else {
          // If there is an issue with the stored vote token or it is altered then we should reset the token to 6 Hours again
          msgData.detail = this.apiService.sendMessage(msgData);
          this.setPollToken();
          return
        }
      }
      catch (err) {
        // If there is an error decrypting the token or it is altered then we should reset the token to 6 Hours again
        msgData.detail = this.apiService.sendMessage(msgData);
        this.setPollToken();
        return
      }
    }
    else {
      // If user hasn't voted yet, proceed with voting
      this.voteNow()
    }
  }

  // Method to fetch nominees
  fetchNominees() {
    this.apiService.initiateLoading(true);
    this.apiService.fetchNominees().subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.nominees = res.data; // Assign fetched nominees data
        }
        else if (res.status == 204) {
          // If no nominees found, show error message
          let msgData = {
            severity: "error",
            summary: 'Error',
            detail: res.data,
            life: 5000
          }
          this.apiService.sendMessage(msgData);
        }
      },
      (err: any) => {
        // Handle error
        this.errorMessage = err.error;
        console.log(err);
      }
    ).add(() => {
      this.apiService.initiateLoading(false); // Turn off loading indicator
    });
  }

  // Method to set poll token for preventing multiple votes
  setPollToken() {
    let now = new Date();
    let time = now.getTime();
    let expireTime = time + 600 * 36000; // Set expiration time (6 hours)
    let pollData = expireTime;
    localStorage.setItem('pollToken', this.encrypt.enCrypt(pollData)); // Encrypt and store poll token
  }

  // Method to calculate remaining time for next vote
  getTimeDifference(timestamp: any) {
    const givenDate = timestamp;
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = givenDate - currentDate.getTime();

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    let result = 'Already Voted, vote again in ';

    if (hours > 0) {
      result += `${hours}h `;
    }

    if (minutes > 0) {
      result += `${minutes}m `;
    }

    if (seconds > 0) {
      result += `${seconds}s`;
    }

    return result; // Return remaining time message
  }

  // Method to handle voting
  voteNow() {
    if (this.pollForm.valid) {
      // If poll form is valid, proceed with voting
      this.apiService.initiateLoading(true);
      this.apiService.pollNow(this.pollForm.value.data).subscribe(
        (res: any) => {
          // Emit vote message to socket, for real time bidirectional data
          this.socket.emit('message', this.pollForm.value.data);
          if (res.status == 200) {
            // If voting successful, show success message and reset form
            let msgData = {
              severity: "success",
              summary: 'Success',
              detail: res.data,
              life: 5000
            }
            this.apiService.sendMessage(msgData);
            this.pollForm.reset();
            this.setPollToken(); // Set new poll token to prevent voting again
          }
          else if (res.status == 204) {
            // If voting failed, show error message
            let msgData = {
              severity: "error",
              summary: 'Error',
              detail: res.data,
              life: 5000
            }
            this.apiService.sendMessage(msgData);
          }
        },
        (err: any) => {
          // Handle error
          this.errorMessage = err.error;
          console.log(err);
        }
      ).add(() => {
        this.apiService.initiateLoading(false); // Turn off loading indicator
        setTimeout(() => {
          this.errorMessage = null; // Clear error message after 5 seconds
        }, 5000);
      });
    }
    else {
      // If poll form is invalid, mark all controls as dirty
      const controls = this.pollForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsDirty()
        }
      }
    }
  }

}