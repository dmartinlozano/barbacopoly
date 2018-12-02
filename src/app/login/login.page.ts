import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NativeStorageService}  from '../app.native.storage.service';
import {ToastController} from '@ionic/angular';
import {CredentialsService} from '../app.credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  password: string;
  correctPassword : string = "quepasarael12deEnero?";
  showPass :boolean = false;
  typeInput : string = "password";

  constructor(private router: Router,
              private menu: MenuController,
              private nativeStorageService: NativeStorageService,
              private toastController: ToastController,
              private credentialsService: CredentialsService) { }

  async ngOnInit() {
    try{
      let storedPassword = await this.nativeStorageService.getItem("password");
      if (storedPassword === this.correctPassword){
        this.router.navigateByUrl('/photos');
        let toast = await this.toastController.create({
          message: "Contraseña almacenada correcta",
          duration: 2000
        });
        toast.present();
      }
    }catch(e){
      console.log("Contraseña no almacenada");
    }
  }

  async login(){
    if (this.password === this.credentialsService.credentials["password"]){
      await this.nativeStorageService.setItem("password", this.password);
      this.router.navigateByUrl('/photos');
    }else{
      let toast = await this.toastController.create({
        message: "Contraseña incorrecta.\nRevisa tu invitación\no el mensaje de Whatasapp",
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
