import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
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

  pollForm : any;
  errorMessage : any;
  year: number = new Date().getFullYear();
  submitted : boolean = false;
  nominees : any;
  appName:any = environment.appName;
  socket = io(environment.domain);

  constructor(public router: Router,private encrypt:EncryptionService,
    private apiService : ApiService,private fb: FormBuilder) { }

  ngOnInit() {
    this.fetchNominees();
    this.pollForm = this.fb.group({
      data:['',[Validators.required]]
    });
  }

  poll() {
    let pollToken = localStorage.getItem('pollToken');
    if(pollToken !== null){
      let msgData:any = {
        severity : "error",
        summary : 'Error',
        detail : "Already Voted,try again in 6 Hours",
        life : 5000
      }
      let data:any = ''
      try{
        data = this.encrypt.deCrypt(pollToken);
        if(data>=new Date()){
          msgData.detail = this.getTimeDifference(data)
          this.apiService.sendMessage(msgData);
          return
        }
        else if(data<new Date()){
          localStorage.removeItem('pollToken');
          this.voteNow();
        }
        else{
          msgData.detail = this.apiService.sendMessage(msgData);
          this.setPollToken();
          return
        }
      }
      catch(err){
        msgData.detail = this.apiService.sendMessage(msgData);
        this.setPollToken();
        return
      }
    }
    else{
      this.voteNow()
    }
  }

  fetchNominees(){
    this.apiService.initiateLoading(true);
    this.apiService.fetchNominees().subscribe(
    (res : any)=>{
      console.log(res)
      if (res.status == 200) {
        this.nominees = res.data
      }
      else if (res.status == 204) {
        let msgData = {
          severity : "error",
          summary : 'Error',
          detail : res.data,
          life : 5000
        }
        this.apiService.sendMessage(msgData);
      }
    },
    (err:any)=>{
      this.errorMessage = err.error
      console.log(err);
    }
  ).add(()=>{
    this.apiService.initiateLoading(false)
  })
  }

  setPollToken(){
    let now = new Date();
    let time = now.getTime();
    let expireTime = time + 600 * 36000;
    let pollData = expireTime
    localStorage.setItem('pollToken',this.encrypt.enCrypt(pollData));
  }

  getTimeDifference(timestamp:any){
    const givenDate = timestamp;
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = givenDate - currentDate.getTime();

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return `Already Voted, vote again in ${hours} hours, ${minutes} minutes, ${seconds} seconds`
  }

  voteNow(){
    if(this.pollForm.valid){
      this.apiService.initiateLoading(true);
      this.apiService.pollNow(this.pollForm.value.data).subscribe(
      (res : any)=>{
        this.socket.emit('message', this.pollForm.value.data);
        if (res.status == 200) {
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
          this.pollForm.reset();
          this.setPollToken()
        }
        else if (res.status == 204) {
          let msgData = {
            severity : "error",
            summary : 'Error',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
        }
      },
      (err:any)=>{
        this.errorMessage = err.error
        console.log(err);
      }
    ).add(()=>{
      this.apiService.initiateLoading(false)
      setTimeout(()=>{
        this.errorMessage = null;
      },5000)
    })
  }
  else{
    const controls = this.pollForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            controls[name].markAsDirty()
        }
    }
  }
  }

}