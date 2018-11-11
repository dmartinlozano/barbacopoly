import { Component, OnInit } from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {PhotosService} from './photos.service'
import { Router } from '@angular/router';
import {ToastController, NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  images=[];
  nextContinuationToken=null;
  isAsc=false;
  slice: number=30;

  constructor(private photosService: PhotosService,
              private camera: Camera,
              private toastController: ToastController,
              private router: Router,
              public navController: NavController) { }

  async ngOnInit() {
    this.list();
  }

  async list(){
    try{
      const data = await this.photosService.list(this.isAsc, this.nextContinuationToken);
      if( data.IsTruncated ) { 
        this.nextContinuationToken = data.NextContinuationToken;
      }
      this.images=[];
      data.Contents.forEach(image => {
        this.images.push({key:image.Key, src:"http://barbacopolyresized.s3-website.eu-west-1.amazonaws.com/"+image.Key})
      });
    }catch(e){
      let toast = await this.toastController.create({
        message: "Foto subida a Internet",
        duration: 2000
      });
      toast.present();
    }
  }

  async changeOrder(){
    this.isAsc = !this.isAsc;
    this.nextContinuationToken = null;
    this.list();
  }
  
  async doInfinite(infiniteScroll) {
    await this.list();
    infiniteScroll.target.complete();
    if (this.nextContinuationToken === null) {
      infiniteScroll.target.disabled = true;
    }
  }

  selectImage(id){
    this.navController.navigateForward("/photo/"+id)
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
        let toast = await this.toastController.create({
          message: "La foto no se ha podido subir a Internet",
          duration: 2000
        });
        toast.present();
      }finally{
        this.isAsc = !this.isAsc;
        this.changeOrder();
      }
    });
  }
}