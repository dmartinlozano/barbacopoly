import { Component, OnInit } from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {PhotosService} from './photos.service'
import {ToastController} from '@ionic/angular';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  images=[];
  isAsc=true;

  constructor(private photosService: PhotosService,
              private camera: Camera,
              private photoLibrary: PhotoLibrary,
              private toastController: ToastController,
              private photoViewer: PhotoViewer) { }

  async ngOnInit() {
    this.list();
  }

  async list(){
    try{
      const data = await this.photosService.list(this.isAsc);
      this.images=[];
      data.Contents.reverse().forEach(image => {
        this.images.push({key:image.Key, src:"http://barbacopolyresized.s3-website.eu-west-1.amazonaws.com/"+image.Key})
      });
    }catch(e){
      let toast = await this.toastController.create({
        message: "Error: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  async changeAscDesc(){
    this.isAsc = !this.isAsc;
    this.images.reverse();
  }

  async refresh(){
    this.list();
    this.isAsc=true;
  }

  async selectImage(id){
    let re = /resized\-/gi;
    id = id.replace(re, "");
    this.photoViewer.show("http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id, 'Barbacopoly', {share: true});
    try{
      await this.photoLibrary.saveImage("http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id, "Barbacopoly");
      let toast = await this.toastController.create({
        message: "Foto descargada",
        duration: 2000
      });
      toast.present();
    }catch(e){
      console.error(e);
      let toast = await this.toastController.create({
        message: "Error descagando imagen: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(async(imageData) => {
      try{
        await this.photosService.postImage(imageData);
        let toast = await this.toastController.create({
          message: "Foto subida a Internet",
          duration: 2000
        });
        toast.present();
      }catch(e){
        console.error(e);
        let toast = await this.toastController.create({
          message: "La foto no se ha podido subir a Internet",
          duration: 2000
        });
        toast.present();
      }finally{
        this.list();
      }
    });
  }
}