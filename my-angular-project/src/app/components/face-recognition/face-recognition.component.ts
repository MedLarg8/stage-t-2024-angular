import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit {
  videoFeedUrl: string;
  recognitionStarted: boolean = false;

  constructor(private http: HttpClient) {
    this.videoFeedUrl = 'http://localhost:5000/video_feed'; // Replace with your Flask video feed URL
  }

  ngOnInit(): void { }

  toggleRecognition() {
    if (!this.recognitionStarted) {
      this.http.get('http://localhost:5000/start_recognition').subscribe(
        response => {
          console.log('Recognition started');
          this.recognitionStarted = true;
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
          if (response.data.match) {
            window.location.href = '/transaction';  // Redirect to transaction page
          }
        },
        error => {
          console.error('Error stopping recognition:', error);
        }
      );
    }
  }
}
