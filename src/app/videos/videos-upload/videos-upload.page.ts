import { Component, OnInit, NgZone } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { AlertController} from '@ionic/angular';
import { VideosService } from '../videos.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeStorageService}  from '../../app.native.storage.service';
import { FixModalService } from '../../fix-modal.service';

export enum ProgressUpload{
  Wait = 0,
  Uploading, //1
  Aborted, //2
  Error, //3
  Uploaded //4
}

export class FileUpload{
  file: FileEntry;
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
              private localNotifications: LocalNotifications,
              private nativeStorageService: NativeStorageService,
              private file: File,
              private alertController: AlertController,
              private ngZone: NgZone,
              private fixModalService: FixModalService) { }

  async findAndReplace(video: FileUpload, videos: FileUpload[]){
    let foundIndex = videos.findIndex(v => v.file.fullPath === video.file.fullPath);
    videos[foundIndex] = video;
    await this.nativeStorageService.setItem("videos", videos);
  }

  async ngOnInit() {
    var _self = this;
    try{
      this.videos = await this.nativeStorageService.getItem("videos");
      this.videos.forEach(v => {
          if (v.state !== 4){
            v.error = null;
            v.state = 0;
            v.progress = 0;
            v.awsUploading = {key:"", uploadId:""}
          }
      });
    }catch(e){
      this.videos =[];
    }

    this.subscriptionVideoToUpload = this.videosService.getFileInitUpload().subscribe( async function(fullPath: string){
      let folder = fullPath.substring(0, fullPath.lastIndexOf("/")+1);
      let folderEntry = await _self.file.resolveDirectoryUrl(folder);
      let fileName = await _self.file.resolveLocalFilesystemUrl(fullPath);
      let fileEntry = await _self.file.getFile(folderEntry, fileName.name, {create:false})
      _self.videos.unshift({file: fileEntry, state: ProgressUpload.Wait, error: null, progress: 0, awsUploading: {uploadId:"",key:""}});
      await _self.nativeStorageService.setItem("videos", _self.videos);
    });
    this.subscriptionVideoUpload = this.videosService.getFileUpload().subscribe( async function(video: FileUpload){
      //uploaded
      if (video.state === 4){
        _self.localNotifications.schedule({
          text: 'Video subido. En breve lo publicaremos.',
          group: 'notifications', 
          vibrate: true,
          id: 20
        });
      }
      //error
      if (video.state === 3){
        _self.localNotifications.schedule({
          text: video.error.message,
          group: 'notifications', 
          vibrate: true,
          id: 20
        });
      }
      _self.ngZone.run(() => {
        _self.findAndReplace(video, _self.videos);
      });
    });
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

  async ionViewWillLeave() {
    this.fixModalService.fix();
 }

}
