import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.page.html',
  styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage{

  href;
  id;
 
  constructor(private activatedRoute: ActivatedRoute,
              private photoLibrary: PhotoLibrary,
              private toastController: ToastController) { 
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get("id")
      this.href = "http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" + this.id;
    });
  } 

  async downloadPhoto(){
    try{
      await this.photoLibrary.saveImage(this.href, "Barbacopoly");
      let toast = await this.toastController.create({
        message: "Foto descargada",
        duration: 2000
      });
      toast.present();
    }catch(e){
      let toast = await this.toastController.create({
        message: "Error descagando imagen: "+e.message,
        duration: 2000
      });
    }
  }

}
