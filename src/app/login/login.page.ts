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


  constructor(private router: Router,
              private menu: MenuController,
              private toastController: ToastController
              ) { 
    var _self = this;
  }

  async ngOnInit() {
  }

  async login(){
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
   }

}
