import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, MenuController} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CredentialsService} from './app.credentials.service';
import { NotificationsService} from './app.notifications.service';
import { NativeStorageService} from './app.native.storage.service';
import { FixModalService} from './fix-modal.service';
import { VideosUploadPage} from './videos/videos-upload/videos-upload.page';
import { VideosViewPage } from './videos/videos-view/videos-view.page';

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
    HttpClient,
    PhotoLibrary,
    PhotoViewer,
    NativeStorage,
    NativeStorageService,
    CredentialsService,
    NotificationsService,
    UniqueDeviceID,
    VideoPlayer,
    ScreenOrientation,
    MenuController,
    FixModalService,
    { provide: APP_INITIALIZER, useFactory: initializerApp, deps: [CredentialsService, NotificationsService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
