import { Component, OnInit, EventEmitter } from '@angular/core';
import { MediaFile } from '@ionic-native/media-capture/ngx';
import { VideosService } from '../videos.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeStorageService}  from '../../app.native.storage.service';

export enum ProgressUpload{
  Wait = 0,
  Uploading,
  Uploaded
}

export class FileUpload{
  file: MediaFile;
  state: ProgressUpload;
  error: Error;
}

@Component({
  selector: 'videos-upload',
  templateUrl: './videos-upload.page.html',
  styleUrls: ['./videos-upload.page.scss'],
})
export class VideosUploadPage implements OnInit {
  videos :FileUpload[]=[];
  subscriptionVideoToUpload: any;
  subscriptionVideoUploaded: any;

  constructor(private videosService: VideosService,
              private localNotifications: LocalNotifications,
              private nativeStorageService: NativeStorageService) { }

  async ngOnInit() {
    var _self = this;
    try{
      this.videos = await this.nativeStorageService.getItem("videos");
      this.videos.forEach(v => {
          if (v.state !== 3 && v.error !== null){
            v.error = null;
            v.state = 0;
          }
      });
    }catch(e){
      this.videos =[];
    }

    this.subscriptionVideoToUpload = this.videosService.getFileUploading().subscribe( async function(newVideo: MediaFile){
      _self.videos.unshift({file: newVideo, state: ProgressUpload.Wait, error: null});
      await _self.nativeStorageService.setItem("videos", _self.videos);
    });
    this.subscriptionVideoUploaded = this.videosService.getFileUploaded().subscribe( async function(video: FileUpload){

      if (video.state === 3){
        _self.localNotifications.schedule({
          title: 'Barbacopoly',
          text: 'Video subido. En breve lo publicaremos.',
        });
      }

      if (video.error !== null){
        _self.localNotifications.schedule({
          title: 'Barbacopoly',
          text: video.error.message,
        });
      }

      _self.videos.forEach(v => {
        if (v.file.fullPath === video.file.fullPath){
          v.error = video.error;
          v.state = video.state;
        };
      });
      await _self.nativeStorageService.setItem("videos", _self.videos);
    });
  }

  async deleteAll(){
    this.videos = [];
    await this.nativeStorageService.setItem("videos", this.videos);
  }
  initUpload(video: FileUpload){
    this.videosService.postVideo(video);
  }

}
