import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { VideosService } from './videos.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

  constructor(private toastController: ToastController,
              private camera: Camera,
              private videosService: VideosService) { }

  async ngOnInit() {
    let toast = await this.toastController.create({
      message: "Recuerda grabar siempre en horizontal!",
      duration: 5000
    });
    toast.present();
  }

  takeVideo(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
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
    });
  }

}
