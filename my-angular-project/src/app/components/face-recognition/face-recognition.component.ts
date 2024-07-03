import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit {
  videoFeedUrl: string;
  recognitionStarted: boolean = false;
  buttonText: string = 'Start Recognition';
  username: string = ''; // Initialize username here

  constructor(private http: HttpClient, private router: Router) {
    this.videoFeedUrl = 'http://localhost:5000/video_feed'; // Replace with your Flask video feed URL
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || ''; // Use || '' to handle null case
  }

  toggleRecognition() {
    if (!this.recognitionStarted) {
      this.http.get('http://localhost:5000/start_recognition').subscribe(
        response => {
          console.log('Recognition started');
          this.recognitionStarted = true;
          this.buttonText = 'Stop Recognition';  // Change button text
        },
        error => {
          console.error('Error starting recognition:', error);
        }
      );
    } else {
      this.http.get('http://localhost:5000/stop_recognition').subscribe(
        (response: any) => {
          console.log('Recognition stopped:', response.data);
          this.recognitionStarted = false;
          this.buttonText = 'Start Recognition';  // Change button text
          if (response.data && response.data.match) {
            this.navigateToTransaction();  // Navigate to transaction page
          }
        },
        error => {
          console.error('Error stopping recognition:', error);
        }
      );
    }
  }

  navigateToTransaction() {
    // Ensure username is available
    if (this.username) {
      // Prepare state object with username
      const stateData = { username: this.username };

      // Navigate to transaction page with state data
      this.router.navigate(['/transaction'], { state: stateData });
    } else {
      console.error('Username not found in sessionStorage');
      // Handle the case where username is not found in sessionStorage
    }
  }
}
