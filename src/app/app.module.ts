import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialLoginModule, AuthServiceConfig } from "angular-6-social-login";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CredentialsService } from './app.credentials';
import { getAuthServiceConfigs } from './app.social.login.config';

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
    SocialLoginModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    MenuController,
    { provide: AuthServiceConfig, useFactory: getAuthServiceConfigs },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
