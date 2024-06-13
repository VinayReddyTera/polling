import { Component, OnInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

declare const $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  socket = io(environment.domain);
  name : any;
  errorMessage : any;
  dataPresent:boolean = false;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  barChartLabels: string[] = ['dd','ff','ff','fff','ff'];
  barChartLegend: boolean = true;
  barChartData:any;
  
  doughnutChartLabels: string[] = [];
  doughnutChartDatasets: any = [
      { data: [ 0,0,0,0,0 ] }
    ];

  doughnutChartOptions: any = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
  };
  role:any;
  nominees:any = [];
  totalCount: any;
  showTable:boolean = true;

  constructor(private apiService : ApiService,private decrypt:EncryptionService) {}

  ngOnInit() {
    // Listen for socket messages, used for live vote counts
    this.socket.on('message', (message) =>{
      console.log(message)
      if(this.nominees.length>0){
        this.totalCount += 1;
        // Update nominee votes if present in the current list
        for(let nominee of this.nominees){
          if(nominee._id == message._id){
            nominee.votes += 1;
            this.setupGraphs(this.nominees)
            break
          }
        }
      }
    });

    // Fetch user data from local storage
    if(localStorage.getItem('data')){
      // decrypts and parses the object data present in local storage
      let userData : any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      this.name = userData.name;
      this.role = userData.role;
    }
    
    // Api service which is used to fetch dashboard data
    this.apiService.initiateLoading(true)
    this.apiService.fetchDashboardData().subscribe(
      (res:any)=>{
        if(res.status == 200){
          this.nominees = res.data;
          this.totalCount = res.totalCount;
          // used to initiate graphs
          this.setupGraphs(res.data);
        }
        else{
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
      console.log(err)
    }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
  }

  // sets up nominee data, if there is no data in db
  // setupData() {
  //   this.apiService.initiateLoading(true)
  //   this.apiService.setupdata().subscribe(
  //     (res:any)=>{
  //       if(res.status == 200){
  //         let msgData = {
  //           severity : "success",
  //           summary : 'Success',
  //           detail : res.data,
  //           life : 5000
  //         }
  //         this.apiService.sendMessage(msgData);
  //       }
  //       else{
  //         let msgData = {
  //           severity : "error",
  //           summary : 'Error',
  //           detail : res.data,
  //           life : 5000
  //         }
  //         this.apiService.sendMessage(msgData);
  //       }
  //     },
  //   (err:any)=>{
  //     console.log(err)
  //   }
  //   ).add(()=>{
  //     this.apiService.initiateLoading(false)
  //   })
  // }

  // clears or resets nominee data including votes count to zero.
  clearData(){
    this.apiService.initiateLoading(true)
    this.apiService.cleardata().subscribe(
      (res:any)=>{
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
          $(`#resetNominees`).modal('hide');
          this.ngOnInit();
        }
        else{
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
      console.log(err)
    }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
  }

  // At any point of time, with the array of nominee data with names and votes we can initiate graphs
  setupGraphs(data:any){
    let isDataPresent = false;
    let nomineesArray:any = [];
    this.doughnutChartLabels=[];
    for(let nominee of data){
      if(nominee.votes > 0){
        isDataPresent = true;
      }
      nomineesArray.push(nominee.votes);
      this.doughnutChartLabels.push(nominee.name)
    }
    if(isDataPresent){
      this.dataPresent = true
    }
    this.doughnutChartDatasets = [
      { 
        data: nomineesArray,
            backgroundColor: [
            '#FFA533',
            '#34c38f',
            '#1F4C99',
            '#8E44AD',
            '#FFD700'
          ],
          borderColor: [
            '#FFA533',
            '#34c38f',
            '#1F4C99',
            '#8E44AD',
            '#FFD700'
          ]
          }
    ];
    this.barChartData = [{
        label: 'Votes Count',
        data: nomineesArray,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
    }];
    this.barChartLabels = this.doughnutChartLabels
  }

  // Toggle between chart and table view
  change(){
    let data = (<HTMLInputElement>document.getElementById('check'));
    if(data.checked){
      this.showTable = true;
    }
    else{
      this.showTable = false;
    }
  }

}