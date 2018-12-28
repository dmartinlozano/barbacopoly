import { Component, OnInit } from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { VideosService } from '../videos.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheetController } from '@ionic/angular';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { File } from '@ionic-native/file/ngx';
import { VideosPage } from '../videos.page';
import { LoadingController } from '@ionic/angular';
import { LoginPageModule } from '../../login/login.module';

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
              private camera: Camera,
              private file: File,
              private photoLibrary: PhotoLibrary,
              private videoPlayer: VideoPlayer,
              private actionSheetController: ActionSheetController,
              private screenOrientation: ScreenOrientation,
              private alertController: AlertController,
              private videosPage: VideosPage,
              private loadingController:LoadingController) { }

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

  refresh(event) {
    setTimeout(async() =>  {
      this.list();
      this.isAsc=true;
      if (event){
        event.target.complete();
      }
    }, 2000);
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
    this.photoLibrary.requestAuthorization({read:true,write:true});
    let options: CaptureVideoOptions = { limit: 1, quality:100 };
    let result = await this.mediaCapture.captureVideo(options);
    const loading = await this.loadingController.create({
      message: 'Guardando el video'
    });
    await loading.present();
    await this.photoLibrary.saveVideo(result[0].fullPath, "Barbacopoly");
    this.videosService.addVideoToUpload(result[0].fullPath);
    this.videosPage.selectTab("videos-upload");
    await loading.dismiss();
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

  upload(){
    var _sef=this;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(async(videoUrl) => {

      let videoEntry = await _sef.file.resolveLocalFilesystemUrl("file:///"+videoUrl)
      _sef.photoLibrary.requestAuthorization({read:true,write:true});
      await _sef.photoLibrary.saveVideo(videoEntry.nativeURL, "Barbacopoly");
      _sef.videosService.addVideoToUpload(videoEntry.nativeURL);
      _sef.videosPage.selectTab("videos-upload");
      let toast = await _sef.toastController.create({
        message: "Video añadido a la pestaña 'Subiendo'",
        duration: 2000
      });
      toast.present();
    });
  }

}
