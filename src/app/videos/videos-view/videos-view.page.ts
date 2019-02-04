import { Component, OnInit } from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular';
import { VideosService } from '../videos.service';
import { ActionSheetController } from '@ionic/angular';
//import { File } from '@ionic-native/file/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'videos-view',
  templateUrl: './videos-view.page.html',
  styleUrls: ['./videos-view.page.scss'],
})
export class VideosViewPage implements OnInit {

  isAsc=true;
  videos=[];

  constructor(private router: Router,
              private toastController: ToastController,
              private videosService: VideosService,
             // private file: File,
              private actionSheetController: ActionSheetController,
              private screenOrientation: ScreenOrientation,
              private alertController: AlertController,
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
   /* this.photoLibrary.requestAuthorization({read:true,write:true});
    let options: CaptureVideoOptions = { limit: 1, quality:100 };
    let result = await this.mediaCapture.captureVideo(options);
    const loading = await this.loadingController.create({
      message: 'Guardando el video'
    });
    await loading.present();
    await this.photoLibrary.saveVideo(result[0].fullPath, "Barbacopoly");
    this.videosService.fileInitUpload.emit(result[0].fullPath);
    this.router.navigateByUrl('/photos');
    await loading.dismiss();*/
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
  }

}
