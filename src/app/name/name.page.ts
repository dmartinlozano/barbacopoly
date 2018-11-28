import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {NameService} from './name.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-name',
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage implements OnInit {

  name:string="";
  constructor(private modalCtrl:ModalController,
              private nameService:NameService,
              private toastController:ToastController) { }

  ngOnInit() {
  }

  async setName(){
    if (this.name.trim() === ""){
      let toast = await this.toastController.create({message: "Que nombre mas corto\npara un ser humano 💃", duration: 2000});
      toast.present();
    }else{
      this.nameService.set(name);
      this.modalCtrl.dismiss();
    }
  }

}
