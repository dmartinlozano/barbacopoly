import { Component } from '@angular/core';
import { FcmService } from './fcm.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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
      title: 'Actividades',
      url: '/activities',
      icon: 'md-american-football'
    },
    {
      title: 'Punto de encuentro',
      url: '/meeting-point',
      icon: 'ios-home'
    },
    {
      title: 'Contacto',
      url: '/contact',
      icon: 'md-contacts'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private localNotifications:LocalNotifications
  ) {
    this.initializeApp();
  }

  initializeApp() {
    var _self = this;
    this.platform.ready().then(() => {
      this.fcm.getToken();
      this.fcm.listenToNotifications().subscribe(data => {
          _self.localNotifications.schedule({text: data.default});
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
