import { Component, OnInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';

declare const $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  userStatistics = {
    inProgress : 0,
    completed : 0,
    rejected : 0
  }

  name : any;
  userData:any;
  errorMessage : any;
  tooltipOptions = {
    fitContent : true
  }
  date: Date = new Date();
  profileStatus:any;
  modifiedRows:any=[];
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
  completed:any = 0;
  upcoming:any = 0;
  nominees:any;
  totalCount: any;
  showTable:boolean = true;

  constructor(private apiService : ApiService,private decrypt:EncryptionService) {}

  ngOnInit() {
    if(localStorage.getItem('data')){
      let userData : any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      this.name = userData.name;
      this.role = userData.role;
    }
    
    this.apiService.initiateLoading(true)
    this.apiService.fetchDashboardData().subscribe(
      (res:any)=>{
        if(res.status == 200){
          console.log(res)
          this.nominees = res.data;
          this.totalCount = res.totalCount;
          this.setupGraphs(res);
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

  setupData() {
    this.apiService.initiateLoading(true)
    this.apiService.setupdata().subscribe(
      (res:any)=>{
        if(res.status == 200){
          let msgData = {
            severity : "success",
            summary : 'Success',
            detail : res.data,
            life : 5000
          }
          this.apiService.sendMessage(msgData);
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

  setupGraphs(res:any){
    let isDataPresent = false;
    let nomineesArray:any = [];
    this.doughnutChartLabels=[];
    for(let nominee of res.data){
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