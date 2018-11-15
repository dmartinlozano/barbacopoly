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
      icon: 'photos'
    },
    {
      title: 'Actividades',
      url: '/activities',
      icon: 'american-football'
    },
    {
      title: 'Punto de encuentro',
      url: '/meeting-point',
      icon: 'home'
    },
    {
      title: 'Contacto',
      url: '/contact',
      icon: 'contacts'
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
