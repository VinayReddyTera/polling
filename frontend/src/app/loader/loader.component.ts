import { Component, OnInit } from '@angular/core';
import { ApiService } from '../pages/services/api.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(private apiService: ApiService) {} // Inject ApiService for handling loader status changes

  loading: boolean = false; // Flag to track the loading status

  ngOnInit(): void {
    // Subscribe to the loader status changes from ApiService
    this.apiService.loader.subscribe((data: any) => {
      if (data) { // If loader status is true (loading)
        this.loading = true; // Set loading flag to true
      } else { // If loader status is false (finished loading)
        this.loading = false; // Set loading flag to false
      }
    });
  }

}