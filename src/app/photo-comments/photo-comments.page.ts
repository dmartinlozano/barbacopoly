import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PhotoCommentsService} from './photo-comments.service';
import { NativeStorageService}  from '../app.native.storage.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-photo-comments',
  templateUrl: './photo-comments.page.html',
  styleUrls: ['./photo-comments.page.scss'],
})
export class PhotoCommentsPage implements OnInit {

  imageSrc: string="";
  imageId: string="";
  name: string;
  commentary: string;
  editNameEnabled: boolean = true;
  
  constructor(private activatedRoute: ActivatedRoute,
              private photoCommentsService: PhotoCommentsService,
              private nativeStorageService: NativeStorageService,
              private toastController: ToastController) {
    this.activatedRoute.paramMap.subscribe(params => {
      let re = /resized\-/gi;
      let id = params.get("id");
      id = id.replace(re, "");
      this.imageSrc = "http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id;
      id = id.split('.').slice(0, -1).join('.');
      this.imageId = id;
    });
  }

  async ngOnInit() {
    try{
      let name = await this.nativeStorageService.getItem("name");
      this.name = name;
      this.editNameEnabled = true;
    }catch(e){
      this.editNameEnabled = false;
    }
  }

  async send(){
    try{
      await this.photoCommentsService.post(this.imageId, this.name, this.commentary);
      let toast = await this.toastController.create({message: "Comentario enviado", duration: 2000});
      toast.present();
      await this.photoCommentsService.list(this.imageId, true);
    }catch(e){
      console.error(e)
      let toast = await this.toastController.create({message: "Error: "+e.message, duration: 2000});
      toast.present();
    }
  }

  async setName(){
    if (this.name !== ""){
      await this.nativeStorageService.setItem("name",this.name);
      this.editNameEnabled = true;
    }
  }

}
