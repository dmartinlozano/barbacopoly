import { Component, OnInit, NgZone } from '@angular/core';
//import { File, FileEntry } from '@ionic-native/file/ngx';
import { AlertController} from '@ionic/angular';
import { VideosService } from '../videos.service';
import { NativeStorageService}  from '../../app.native.storage.service';

export enum ProgressUpload{
  Wait = 0,
  Uploading, //1
  Aborted, //2
  Error, //3
  Uploaded //4
}

export class FileUpload{
  state: ProgressUpload;
  progress: Number;
  error: Error;
  awsUploading: {
    uploadId: string;
    key: string;
  };
}

@Component({
  selector: 'videos-upload',
  templateUrl: './videos-upload.page.html',
  styleUrls: ['./videos-upload.page.scss'],
})
export class VideosUploadPage implements OnInit {
  videos :FileUpload[]=[];
  subscriptionVideoToUpload: any;
  subscriptionVideoUpload: any;

  constructor(private videosService: VideosService,
              private nativeStorageService: NativeStorageService,
              //private file: File,
              private alertController: AlertController,
              private ngZone: NgZone) { }

  async findAndReplace(video: FileUpload, videos: FileUpload[]){
    let foundIndex = videos.findIndex(v => v.file.fullPath === video.file.fullPath);
    videos[foundIndex] = video;
    await this.nativeStorageService.setItem("videos", videos);
  }

  async ngOnInit() {
  }

  async deleteAll(){
    this.videos = [];
    await this.nativeStorageService.setItem("videos", this.videos);
  }
  
  initUpload(video: FileUpload){
    this.videosService.postVideo(video);
  }

  async showAlert(video: FileUpload){
    var _self = this;
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      message: '¿Seguro que deseas interrumpir la subida del video?',
      buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Si, aborta la subida',
          handler: () => {
            _self.abortUpload(video);
          }
        }
      ]
    });
    await alert.present();
  }

  abortUpload(video: FileUpload){
    this.videosService.abortUploadVideo(video);
  }

}
