import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  isValidEmail
  constructor(public loginService: LoginService,
    private router: Router,
    private menu: MenuController,
    private toastController: ToastController) { }

  ionViewDidEnter() {
    this.menu.enable(false);
  }
  async login() {
    let email = await this.loginService.signinWithGoogle();
    this.isValidEmail = await this.loginService.check(email);
    if (this.isValidEmail === true) {
      this.menu.enable(true);
      this.router.navigateByUrl('/photos');
    }
    if (this.isValidEmail === false) {
      let toast = await this.toastController.create({
        message: "El email introducido no está registrado. Manda un email a david.martin.lozano@gmail.com indicando quien eres para que te añada.",
        duration: 10000
      });
      toast.present();
    }
  }

}
