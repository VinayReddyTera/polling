import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../services/api.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { dateRenderer } from '../dateRenderer';
import { FormBuilder, Validators} from '@angular/forms';

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
  statusForm:any;
  @ViewChild('content') content:any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  userData:any;
  errorMessage : any;
  deliveryOrders:any = [];
  paymentPendingOrders:any = [];
  tooltipOptions = {
    fitContent : true
  }
  date: Date = new Date();
  profileStatus:any;
  modifiedRows:any=[];

  statData = [{
    "icon": "bx bx-calendar-check",
    "title": "Today's Deliveries",
    "value": 0,
    "link": "/jd-details"
  }, {
    "icon": "bx bx-calendar",
    "title": "Tomorrow Deliveries",
    "value": 0,
    "link": "/pastResumes"
  }, {
    "icon": "bx bx-list-check",
    "title": "Next Week",
    "value": 0,
    "link": "/interviewers"
  }];

  lineChartData: any;
  lineChartOptions: any = {
    responsive: true
  };
  lineChartLegend = true;
  
  doughnutChartLabels: string[] = [ 'Today Deliveries', 'Tomorrow Deliveries', 'Next Week Deliveries' ];
  doughnutChartDatasets: any = [
      { data: [ 0,0,0 ] }
    ];

  doughnutChartOptions: any = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
  };

  opr_role:any;

  gridApi: any;
  gridApi1: any;
  gridApi2: any;

  dashboardColumnDefs = [
    {
      field: "customer_name",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Name",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "relationship_with_user",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Relationship",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value,
      width:130
    },
    {
      field: "number_of_items",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "No of Items",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value,
      width:130
    },
    {
      field: "design_type",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Design Type",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "comments",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Comments",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "order_status",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Order Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if((params.value).toLowerCase() == 'processing'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Processing</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'inprogress'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Inprogress</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'completed'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Completed</span>`;
            return link
          }
          else{
            return params.value
          }
        }
      }
    },
    {
      field: "order_date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Order Date",
      cellRenderer: dateRenderer
    },
    {
      field: "expected_delivery_date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Delivery Date",
      cellRenderer: dateRenderer
    },
    {
      field: "actual_delivery_date",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Delivered Date",
      cellRenderer: (params:any)=> params.value == null ? "N/A" : params.value
    },
    {
      field: "delivery_status",
      filter: "agTextColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Delivery Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if((params.value).toLowerCase() == 'order placed'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Order Placed</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'out for delivery'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Out For Delivery</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'delivered'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Delivered</span>`;
            return link
          }
          else{
            return params.value  
          }
        }
      }
    },
    {
      field: "payment_status",
      filter: "agDateColumnFilter",
      filterParams: { maxNumConditions: 1 },
      headerName: "Payment Status",
      cellRenderer: (params:any)=> {
        if(params.value == null){
          return 'N/A'
        }
        else{
          if((params.value).toLowerCase() == 'awaiting payment'){
            let link = `<span class="badge badge-soft-warning" style="font-size:13px">Awaiting Payment</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'partiallypaid'){
            let link = `<span class="badge badge-soft-info" style="font-size:13px">Partially Paid</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'paid'){
            let link = `<span class="badge badge-soft-success" style="font-size:13px">Paid</span>`;
            return link
          }
          else if((params.value).toLowerCase() == 'unpaid'){
            let link = `<span class="badge badge-soft-danger" style="font-size:13px">Un Paid</span>`;
            return link
          }
          else{
            return params.value  
          }
        }
      }
    }
  ];
  defaultColDef : ColDef = {
    sortable:true,filter:true,resizable:true
  }
  pagination:any = true;
  completed:any = 0;
  upcoming:any = 0;
  boutique_id:number|undefined;

  constructor(private apiService : ApiService,private fb: FormBuilder,
    private router:Router,private decrypt:EncryptionService) {}

  ngOnInit() {
    if(localStorage.getItem('data')){
      let userData : any = JSON.parse(this.decrypt.deCrypt(localStorage.getItem('data')));
      this.boutique_id = userData.boutique_id;
      this.name = userData.first_name;
      this.opr_role = userData.opr_role;
    }
    this.statusForm = this.fb.group({
      boutique_id: [this.boutique_id,[Validators.required]],
      order_id: ['',[Validators.required]],
      order_status: ['',[Validators.required]],
      delivery_status: ['',[Validators.required]],
      payment_status: ['',[Validators.required]]
    })
    let payload = {
      "data" : {
        "boutique_id": this.boutique_id
      }
    }
    this.apiService.initiateLoading(true)
    this.apiService.fetchDashboardData(payload).subscribe(
      (res:any)=>{
        console.log(res)
        this.deliveryOrders = res.deliveryOrders;
        this.paymentPendingOrders = res.paymentPendingOrders;
        this.statData[0].value = res.todayDeliveriesCount;
        this.statData[1].value = res.tommorowDeliveriesCount;
        this.statData[2].value = res.nextweekDeliveriesCount;
        let labels = Object.keys(res.graphData).reverse();
        this.lineChartData = {
          labels: labels,
          datasets: [
            {
              data: Object.values(res.graphData).reverse(),
              label: 'No. of orders placed',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(255,255,0,0.28)'
            }
          ]
        };
        if(res.todayDeliveriesCount == 0 && res.tommorowDeliveriesCount == 0 && res.nextweekDeliveriesCount == 0){
          this.doughnutChartDatasets = null
        }
        else{
          this.doughnutChartDatasets = [
            { 
              data: [ res.todayDeliveriesCount,res.tommorowDeliveriesCount,
                res.nextweekDeliveriesCount ],
                  backgroundColor: [
                  '#FFA533',
                  '#34c38f',
                  '#1F4C99'
                ],
                borderColor: [
                  '#FFA533',
                  '#34c38f',
                  '#1F4C99'
                ]
                }
          ]; 
        }
      },
    (err:any)=>{
      console.log(err)
    }
    ).add(()=>{
      this.apiService.initiateLoading(false)
    })
  }

  getDisplayText(): string {
    return this.profileStatus == 'Incomplete' ? 'Complete Profile' : 'View Profile';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridReady1(params: GridReadyEvent) {
    this.gridApi1 = params.api;
  }

  onGridReady2(params: GridReadyEvent) {
    this.gridApi2 = params.api;
  }

  filter(index :any){
    if(index == '0'){
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
    else if(index == '1'){
      this.gridApi1.setQuickFilter(
        (document.getElementById('filter-text-box1') as HTMLInputElement).value
      );
    }
    else if(index == '2'){
      this.gridApi2.setQuickFilter(
        (document.getElementById('filter-text-box2') as HTMLInputElement).value
      );
    }
  }

}