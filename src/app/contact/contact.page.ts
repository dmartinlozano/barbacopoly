import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

constructor(private callNumber: CallNumber,
            private toastController: ToastController,
            private credentialsService:CredentialsService) { }

  ngOnInit() {
  }

  async makeACall(who){
    let number = this.credentialsService.credentials[who];
    try{
      await this.callNumber.callNumber(number, true);
    }catch(e){
      console.error(e);
      let toast = await this.toastController.create({
        message: "Error relaizando la llamada: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

}
