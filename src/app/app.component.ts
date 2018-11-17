import { Component } from '@angular/core';
import { FcmService } from './fcm.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeStorageService}  from './app.native.storage.service';

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
    private fcm: FcmService,
    private localNotifications:LocalNotifications,
    private nativeStorageService: NativeStorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    var _self = this;
    this.platform.ready().then(async function(){
      _self.fcm.getToken();
      _self.fcm.listenToNotifications().subscribe(data => {
          _self.localNotifications.schedule({text: data.default});
      });
      try{
        await _self.nativeStorageService.getItem("images");  
      }catch(e){
        await _self.nativeStorageService.setItem("images", []);
      }
      _self.splashScreen.hide();
    });
  }
}
