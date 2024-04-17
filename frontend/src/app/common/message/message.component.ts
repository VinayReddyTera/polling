import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/pages/services/api.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers : [MessageService] // Provide MessageService at the component level
})
export class MessageComponent implements OnInit {

  constructor(private messageService: MessageService, private apiservice: ApiService) { } // Inject MessageService and ApiService

  ngOnInit(): void {
    // Subscribe to the message service to listen for incoming messages
    this.apiservice.message.subscribe((message: any) => {
      if (message) { // If a message is received
        this.showmsg(message); // Call the showmsg method to display the message
      }
    });
  }

  // Method to display the message using PrimeNG MessageService
  showmsg(data: any) {
    // Add the message to the message service with the specified severity, summary, detail, and life span
    this.messageService.add({ 
      severity: data.severity, // Severity of the message (e.g., error, warning, success)
      summary: data.summary, // Summary text of the message
      detail: data.detail, // Detailed message content
      life: data.life // Duration in milliseconds for the message to be displayed
    });
  }

}