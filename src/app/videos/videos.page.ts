import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VideosService } from './videos.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheetController } from '@ionic/angular';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

  isAsc=false;
  videos=[];
  constructor(private toastController: ToastController,
              private videosService: VideosService,
              private mediaCapture: MediaCapture,
              private photoLibrary: PhotoLibrary,
              private videoPlayer: VideoPlayer,
              public actionSheetController: ActionSheetController,
              public screenOrientation: ScreenOrientation) { }

  async ngOnInit() {
    let toast = await this.toastController.create({
      message: "Recuerda grabar siempre en horizontal!",
      duration: 5000
    });
    toast.present();
    this.list();
  }

  async list(){
    try{
      const items = await this.videosService.list(this.isAsc);
      this.videos = items;
    }catch(e){
      console.error(e);
      let toast = await this.toastController.create({
        message: "Error: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  async takeVideo(){
    let options: CaptureVideoOptions = { limit: 1, quality:100, };
    try{
      let result = await this.mediaCapture.captureVideo(options);
      let toast = await this.toastController.create({
        message: "Procesando video.",
        duration: 5000
      });
      toast.present();
      await this.photoLibrary.saveVideo(result[0].fullPath, "Barbacopoly");
      await this.videosService.postVideo(result[0]);
      
      //TODO delete video from original path ?
      toast = await this.toastController.create({
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

  async selectVideo(formats){
    console.log(formats);

    /*(6) ["http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…67-b892-bf661c86bffa/hls/VID_20181116_111617.m3u8", "http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…2-bf661c86bffa/hls/VID_20181116_111617_1080p.m3u8", "http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…92-bf661c86bffa/hls/VID_20181116_111617_270p.m3u8", "http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…92-bf661c86bffa/hls/VID_20181116_111617_360p.m3u8", "http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…92-bf661c86bffa/hls/VID_20181116_111617_540p.m3u8", "http://d2e0o392dsqvqs.cloudfront.net/5f17e7f5-e22a…92-bf661c86bffa/hls/VID_20181116_111617_720p.m3u8"*/

    let buttons=[];
    formats.forEach(format => {
      if (format.indexOf("_270p") != -1){
        buttons.push({text: "270p", icon:"videocam", handler:()=>{this.play(format)}});
      }
      if (format.indexOf("_360p") != -1){
        buttons.push({text: "360p", icon:"videocam", handler:()=>{this.play(format)}});
      }
      if (format.indexOf("_540p") != -1){
        buttons.push({text: "540p", icon:"videocam", handler:()=>{this.play(format)}});
      }
      if (format.indexOf("_720p") != -1){
        buttons.push({text: "720p", icon:"videocam", handler:()=>{this.play(format)}});
      }
      if (format.indexOf("_1080p") != -1){
        buttons.push({text: "1080p", icon:"videocam", handler:()=>{this.play(format)}});
      }
      if (format.indexOf("_1080p") == -1 && format.indexOf("_270p") == -1 && format.indexOf("_360p") == -1 && format.indexOf("_540p") == -1 && format.indexOf("_720p") == -1){
        buttons.push({text: "Original", icon:"videocam", handler:()=>{this.play(format)}});
      }
    });
    buttons.push({text: "Cancelar", icon: "close", role: "cancel"});
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción:',
      buttons: buttons
    });
    await actionSheet.present();
  }

  async play(url){
    try{
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      await this.videoPlayer.play(url); 
    }catch(e){
        if (e !== "OK"){
        console.error(e);
        let toast = await this.toastController.create({
          message: "error: "+e.message,
          duration: 5000
        });
        toast.present();
      }
    }finally{
      this.screenOrientation.unlock();
    }
  }

}
