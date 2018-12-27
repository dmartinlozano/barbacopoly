import { Component, OnInit, EventEmitter } from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VideosService } from '../videos.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheetController } from '@ionic/angular';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { VideosPage } from '../videos.page';

@Component({
  selector: 'videos-view',
  templateUrl: './videos-view.page.html',
  styleUrls: ['./videos-view.page.scss'],
})
export class VideosViewPage implements OnInit {

  isAsc=true;
  videos=[];

  constructor(private toastController: ToastController,
              private videosService: VideosService,
              private mediaCapture: MediaCapture,
              private photoLibrary: PhotoLibrary,
              private videoPlayer: VideoPlayer,
              private actionSheetController: ActionSheetController,
              private screenOrientation: ScreenOrientation,
              private alertController: AlertController,
              private videosPage: VideosPage) { }

  async ngOnInit() {
    this.list();
  }

  async list(){
    try{
      const items = await this.videosService.list();
      this.videos = items.reverse();
    }catch(e){
      console.error(e);
      let toast = await this.toastController.create({
        message: "Error: "+e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  async changeAscDesc(){
    this.isAsc = !this.isAsc;
    this.videos.reverse();
  }

  async refresh(){
    this.list();
    this.isAsc=true;
  }

  async showAlert(){
    var _self = this;
    const alert = await this.alertController.create({
      header: 'Oye!',
      message: '¿Me aseguras que vas a grabar el video en horizontal?',
      buttons: [{
          text: 'No me apetece',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Todo sea por los novios',
          handler: () => {
            _self.takeVideo();
          }
        }
      ]
    });
    await alert.present();
  }

  async takeVideo(){
    let options: CaptureVideoOptions = { limit: 1, quality:100, };
    let result = await this.mediaCapture.captureVideo(options);
    
    this.photoLibrary.requestAuthorization({read:true,write:true});
    await this.photoLibrary.saveVideo(result[0].fullPath, "Barbacopoly");
    this.videosService.addVideoToUpload(result[0]);
    this.videosPage.selectTab("videos-upload");
    let toast = await this.toastController.create({
      message: "Video añadido a la pestaña 'Subiendo'",
      duration: 2000
    });
    toast.present();
  }

  async selectVideo(formats){
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
      header: 'Selecciona una resolución:',
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
