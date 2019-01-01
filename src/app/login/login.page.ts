import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NativeStorageService}  from '../app.native.storage.service';
import {ToastController} from '@ionic/angular';
import {CredentialsService} from '../app.credentials.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

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
              private appVersion: AppVersion
              ) { 
    this.correctPassword = this.credentialsService.credentials["password"];
              }

  async ngOnInit() {
    try{
      this.name = await this.nativeStorageService.getItem("name");
      this.password = await this.nativeStorageService.getItem("password");
      this.versionCode = await this.appVersion.getVersionCode();
    }catch(e){
      console.log("Contraseña o nombre no almacenados");
    }
  }

  async login(){
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
