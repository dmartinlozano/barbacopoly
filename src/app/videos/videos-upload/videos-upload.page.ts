import { Component, OnInit, EventEmitter } from '@angular/core';
import { MediaFile } from '@ionic-native/media-capture/ngx';
import { VideosService } from '../videos.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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
              private localNotifications: LocalNotifications) { }

  ngOnInit() {
    var _self = this;
    this.subscriptionVideoToUpload = this.videosService.getFileUploading().subscribe( async function(newVideo: MediaFile){
      _self.videos.push({file: newVideo, state: ProgressUpload.Wait, error: null});
    });
    this.subscriptionVideoUploaded = this.videosService.getFileUploaded().subscribe( async function(video: FileUpload){
      _self.videos.forEach(v => {
        if (v.file.fullPath === video.file.fullPath){
          v.error = video.error;
          v.state = video.state;
          if (video.error !== null){
            _self.localNotifications.schedule({
              title: 'Barbacopoly',
              text: video.error.message,
            });
          }else{
            _self.localNotifications.schedule({
              title: 'Barbacopoly',
              text: 'Video subido.\nEn breve lo publicaremos.',
            });
          };
        };
      });
    });
  }
  initUpload(video: FileUpload){
    this.videosService.postVideo(video);
  }

}
