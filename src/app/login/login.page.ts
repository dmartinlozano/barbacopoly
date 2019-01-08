import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { NativeStorageService}  from '../app.native.storage.service';
import {ToastController} from '@ionic/angular';
import {CredentialsService} from '../app.credentials.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  name: string;
  password: string;
  correctPassword : string;
  showPass :boolean = false;
  typeInput : string = "password";
  versionCode = null;

  constructor(private router: Router,
              private menu: MenuController,
              private nativeStorageService: NativeStorageService,
              private toastController: ToastController,
              private credentialsService: CredentialsService,
              private appVersion: AppVersion,
              private platform: Platform,
              private backgroundMode: BackgroundMode,
              private actionSheetController: ActionSheetController
              ) { 
    var _self = this;
    this.correctPassword = this.credentialsService.credentials["password"];
    this.platform.backButton.subscribe(async function(){
      if (_self.router.url === '' || _self.router.url === '/') {
        _self.backgroundMode.moveToBackground();
      }
      _self.removeActionSheets();
    });
              }

  async removeActionSheets(){
    //fix back actionsheets:
    let ionActionSheets = document.querySelectorAll('ion-action-sheet');
    for (let i = 0; i< ionActionSheets.length; i++){
      await ionActionSheets[i].dismiss();
    }
    let ionActionSheetControllers = document.querySelectorAll('ion-action-sheet-controller');
    for (let i = 0; i< ionActionSheetControllers.length; i++){
      await ionActionSheetControllers[i].dismiss();
    }
    let ionAlert = document.querySelectorAll('ion-alert');
    for (let i = 0; i< ionAlert.length; i++){
      await ionAlert[i].dismiss();
    }
  }

  async ngOnInit() {
    try{
      this.removeActionSheets();
      this.name = await this.nativeStorageService.getItem("name");
      this.password = await this.nativeStorageService.getItem("password");
      this.versionCode = await this.appVersion.getVersionCode();
    }catch(e){
      console.log("Contraseña o nombre no almacenados");
    }
  }

  async login(){
    this.removeActionSheets();
    if (this.name != "" && this.password === this.correctPassword){
      await this.nativeStorageService.setItem("password", this.password);
      await this.nativeStorageService.setItem("name", this.name);
      this.router.navigateByUrl('/photos');
    }else{
      let toast = await this.toastController.create({
        message: "Contraseña incorrecta.\nRevisa tu invitación\no el mensaje de WhatsApp",
        duration: 4000
      });
      toast.present();
    }
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.removeActionSheets();
    this.menu.enable(true);
   }

  showPassword(){
    this.showPass = ! this.showPass;
    if (this.showPass){
      this.typeInput = "text";
    }else{
      this.typeInput = "password";
    }
  }

}
