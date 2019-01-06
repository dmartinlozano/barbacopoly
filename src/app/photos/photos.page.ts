import { Component, OnInit, NgZone } from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {PhotosService} from './photos.service';
import {ToastController, AlertController} from '@ionic/angular';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { PhotoCommentsService } from '../photo-comments/photo-comments.service';

export class Image{
  key: string;
  src: string;
  count: Number;
}

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  images :Image[]=[];
  isAsc=true;
  isPinterest=false;

  constructor(private photosService: PhotosService,
              private camera: Camera,
              private photoLibrary: PhotoLibrary,
              private toastController: ToastController,
              private photoViewer: PhotoViewer,
              private file: File,
              private actionSheetController: ActionSheetController,
              private photoCommentsService: PhotoCommentsService,
              public navController: NavController,
              private alertController: AlertController,
              private ngZone: NgZone) { }

  async ngOnInit() {
    this.list();
  }

  async list(){
    try{
      var _self = this;
      this.images=[];
      this.ngZone.run(async function(){
        const data = await _self.photosService.list(_self.isAsc);
        data.Contents.reverse().forEach(image => {
          _self.images.push({key:image.Key, src:"http://barbacopolyresized.s3-website.eu-west-1.amazonaws.com/"+image.Key, count: 0})
        });
        for (let i = 0; i< _self.images.length; i++){
          let key = _self.images[i].key.split('.').slice(0, -1).join('.');
          let re = /resized\-/gi;
          key = key.replace(re, "");
          let count = await _self.photoCommentsService.count(key);
          _self.images[i].count = Number(count);
        }
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
  
  refresh(event) {
    setTimeout(async() =>  {
      this.list();
      this.isAsc=true;
      if (event){
        event.target.complete();
      }
    }, 2000);
  }

  async selectImage(id){
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción:',
      buttons: [
        {text: "Abrir", icon:"image", handler:()=>{this.open(id)}},
        {text: "Descargar", icon:"cloud-download", handler:()=>{this.download(id)}},
        {text: "Comentarios", icon:"contacts", handler:()=>{this.comments(id)}}
      ]
    });
    await actionSheet.present();
  }

  async open(id){
    let re = /resized\-/gi;
    id = id.replace(re, "");
    this.photoViewer.show("http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id, 'Barbacopoly', {share: true});
  }

  async download(id){
    try{
      let re = /resized\-/gi;
      id = id.replace(re, "");
      this.photoLibrary.requestAuthorization({read:true,write:true});
      await this.photoLibrary.saveImage("http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id, "Barbacopoly");
      let toast = await this.toastController.create({
        message: "Foto descargada",
        duration: 2000
      });
      toast.present();
    }catch(e){
      console.error(e);
      let toast = await this.toastController.create({
        message: "Error: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  takePicture() {
    var _self =  this;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    _self.camera.getPicture(options).then(async(imageData) => {
      try{
        const alert = await _self.alertController.create({
          header: 'Oye!',
          message: '¿Quieres subir esta foto para que la vean otros invitados?',
          buttons: [{
              text: 'Paso',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Si, claro',
              cssClass: 'primary',
              handler: async() => {
                await _self.photosService.postImage(imageData);
                let toast = await _self.toastController.create({
                  message: "Foto subida",
                  duration: 2000
                });
                toast.present();
              }
            }
          ]
        });
        await alert.present();
      }catch(e){
        console.error(e);
        let toast = await this.toastController.create({
          message: "La foto no se ha podido subir",
          duration: 2000
        });
        toast.present();
      }finally{
        this.list();
      }
    });
  }

  upload(){
    var _sef=this;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(async(imageUrl) => {
      try{
        let name = imageUrl.split(/(\\|\/)/g).pop().split("?")[0];
        let folder = imageUrl.substring(0,imageUrl.lastIndexOf("/")+1);
        let toast = await _sef.toastController.create({
          message: "Subiendo foto, por favor espere.",
          duration: 2000
        });
        toast.present();
        _sef.file.readAsArrayBuffer(folder, name).then(async function(bytes){
          await _sef.photosService.postImage(bytes);
          let toast = await _sef.toastController.create({
            message: "Foto subida",
            duration: 2000
          });
          toast.present();
        }).catch(async function(e){
          console.error(e);
          let toast = await _sef.toastController.create({
            message: "Error subiendo foto: "+e.message,
            duration: 2000
          });
          toast.present();
        });
      }catch(e){
        console.error(e);
        let toast = await _sef.toastController.create({
          message: "La foto no se ha podido subir",
          duration: 2000
        });
        toast.present();
      }finally{
        _sef.list();
      }
    });
  }

  async comments(id){
    this.navController.navigateForward("/photo/"+id);
  }

  changeStyle(){
    this.isPinterest = !this.isPinterest;
  }
}
