import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Fotos',
      url: '/photos',
      icon: 'md-images'
    },
    {
      title: 'Videos',
      url: '/videos',
      icon: 'md-videocam'
    },
    {
      title: 'Gracias!!!',
      url: '/activities',
      icon: 'megaphone'
    }
  ];

  constructor() {
  }
}
