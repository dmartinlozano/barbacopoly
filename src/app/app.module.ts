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
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFireModule } from '@angular/fire';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NativeStorageService} from './app.native.storage.service';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

//export function getCredentials(credentials: CredentialsService) {
  //return () => credentials.load();
//}

export function initializerApp(credentials: CredentialsService, notifications: NotificationsService) {
  credentials.load();
  return () => notifications.load();
}
export function initializeFirebase(){
  let credentialsService:CredentialsService = new CredentialsService();
  credentialsService.load();
  return credentialsService.credentials["firebase"];
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(initializeFirebase())
  ],
  providers: [
    File,
    StatusBar,
    SplashScreen,
    Camera,
    MediaCapture,
    LocalNotifications,
    CallNumber,
    HttpClient,
    PhotoLibrary,
    PhotoViewer,
    Firebase,
    AngularFirestore,
    NativeStorage,
    NativeStorageService,
    CredentialsService,
    NotificationsService,
    UniqueDeviceID,
    { provide: APP_INITIALIZER, useFactory: initializerApp, deps: [CredentialsService, NotificationsService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
