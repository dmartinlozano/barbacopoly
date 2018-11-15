import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VideosService } from './videos.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

  constructor(private toastController: ToastController,
              private videosService: VideosService,
              private mediaCapture: MediaCapture,
              private photoLibrary: PhotoLibrary) { }

  async ngOnInit() {
    let toast = await this.toastController.create({
      message: "Recuerda grabar siempre en horizontal!",
      duration: 5000
    });
    toast.present();
  }

  async takeVideo(){
    /*const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.VIDEO,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(async(file) => {
      try{
        await this.videosService.postVideo(file);
        let toast = await this.toastController.create({
          message: "Video subido a Internet. Te avisaremos cuando esté disponible para todos los invitados.",
          duration: 5000
        });
        toast.present();
      }catch(e){
        console.error(e);
        let toast = await this.toastController.create({
          message: "El video no no se ha podido subir a Internet",
          duration: 2000
        });
        toast.present();
      }finally{
        //TODO
        //this.list();
      }
    });*/

    let options: CaptureVideoOptions = { limit: 1, quality:100, };
    try{
      let result = await this.mediaCapture.captureVideo(options);
      await this.videosService.postVideo(result[0]);
      await this.photoLibrary.saveVideo(result[0].fullPath, "Barbacopoly");
      //TODO delete video from original path ?
      let toast = await this.toastController.create({
        message: "Video subido a Internet. En breve te notificaremos de que está disponible para verlo otros invitados.",
        duration: 5000
      });
      toast.present();
    }catch(e){
      console.error(e);
        let toast = await this.toastController.create({
          message: "El video no se ha podido subir a Internet: "+e.message,
          duration: 2000
        });
        toast.present();
    }
  }

}
