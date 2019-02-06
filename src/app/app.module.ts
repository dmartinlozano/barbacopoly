import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, MenuController} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CredentialsService} from './app.credentials.service';
import { NativeStorageService} from './app.native.storage.service';
import { VideosUploadPage} from './videos/videos-upload/videos-upload.page';
import { VideosViewPage } from './videos/videos-view/videos-view.page';
import { File } from '@ionic-native/file';

export function initializerApp(credentials: CredentialsService) {
  return () => credentials.load();
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
    File,
    HttpClient,
    NativeStorageService,
    CredentialsService,
    MenuController,
    { provide: APP_INITIALIZER, useFactory: initializerApp, deps: [CredentialsService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
