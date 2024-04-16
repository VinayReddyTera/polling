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
    console.log(this.pollForm.value)
    let pollToken = localStorage.getItem('pollToken');
    console.log(pollToken)
    if(pollToken !== null){
      let msgData = {
        severity : "error",
        summary : 'Error',
        detail : "Already Voted",
        life : 5000
      }
      this.apiService.sendMessage(msgData);
      let data = JSON.parse(this.encrypt.deCrypt(pollToken))
      if((data.key == environment.secretKey) && (data.time>new Date())){
        return
      }
      else{
        this.setPollToken();
        return
      }
    }
    else{
      if(this.pollForm.valid){
        this.apiService.initiateLoading(true);
        this.apiService.pollNow(this.pollForm.value.data).subscribe(
        (res : any)=>{
          console.log(res);
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
    let pollData = {
      key : environment.secretKey,
      time : expireTime
    }
    localStorage.setItem('pollToken',this.encrypt.enCrypt(JSON.stringify(pollData)));
  }

}
