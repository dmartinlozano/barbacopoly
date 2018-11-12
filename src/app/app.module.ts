import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CredentialsService} from './app.credentials.service';
import { NotificationsService} from './app.notifications.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

//export function getCredentials(credentials: CredentialsService) {
  //return () => credentials.load();
//}

export function initializerApp(credentials: CredentialsService, notifications: NotificationsService) {
  credentials.load();
  return () => notifications.load();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    LocalNotifications,
    CallNumber,
    HttpClient,
    PhotoLibrary,
    CredentialsService,
    NotificationsService,
    { provide: APP_INITIALIZER, useFactory: initializerApp, deps: [CredentialsService, NotificationsService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
