import { Injectable, EventEmitter } from '@angular/core';
import { CredentialsService} from '../app.credentials.service';
import { File } from '@ionic-native/file/ngx';
import { FileUpload, ProgressUpload} from './videos-upload/videos-upload.page';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  fileUploading: EventEmitter<FileUpload> = new EventEmitter();
  fileUploaded: EventEmitter<FileUpload> = new EventEmitter();
  fileUploadProgress: EventEmitter<FileUpload> = new EventEmitter();
  
  constructor(private credentialsService:CredentialsService,
              private file: File) {
    this.bucket = new S3({
      accessKeyId: this.credentialsService.credentials["aws_access_key_id"],
      secretAccessKey: this.credentialsService.credentials["aws_secret_access_key"],
      region: this.credentialsService.credentials["region"]
    });
  }

  async list(){
    var _self = this;
    let result = [];
    //get folders of s3 bucket
    const params1={
      Bucket: "barbacopolyvideos-abrdestination-1dlpjl7qmpw1a",
      Delimiter: "/"
    };
    let folders = await _self.bucket.listObjectsV2(params1).promise();
    folders = folders.CommonPrefixes.map(item=>{return item.Prefix});
    folders.forEach(async function(folder){
        const params2={
          Bucket: "barbacopolyvideos-abrdestination-1dlpjl7qmpw1a",
          Prefix: folder 
        };
        let files = await _self.bucket.listObjectsV2(params2).promise();
        let tumb = files.Contents.filter(item=>item.Key.indexOf(".jpg") !== -1).map(item=>"http://d2e0o392dsqvqs.cloudfront.net/"+item.Key)[0];
        let formats = files.Contents.filter(item=>item.Key.indexOf(".m3u8") !== -1).map(item=>"http://d2e0o392dsqvqs.cloudfront.net/"+item.Key);
        result.push({"tumb":tumb, "formats": formats});
    });
    return result;    
  }

  async postVideo(video: FileUpload){
    var _self = this;
    video.state = 1;
    video.progress = 0;
    _self.fileUploaded.emit(video);
    let folder = video.file.fullPath.substring(0,video.file.fullPath.lastIndexOf("/")+1);
    this.file.readAsArrayBuffer(folder, video.file.name).then(function(bytes){
        let opts = {queueSize: 1, partSize: 1024 * 1024 * 5};
        let params = {
          Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
          Key: video.file.name,
          ContentType: video.file.type,
          Body: bytes
        };
        _self.bucket.upload(params, opts, function (err, data) {
          if (err){
            console.error(err);
            video.state = 2;
            video.error = err;
            _self.fileUploaded.emit(video);
          }else{
            video.state = 3;
            video.error = null;
            video.progress = 100;
            _self.fileUploaded.emit(video);
          }
        }).on('httpUploadProgress', function(evt) {
            video.progress = Math.trunc(evt.loaded / evt.total * 100)
            _self.fileUploadProgress.emit(video);
        });
    });
  }

  addVideoToUpload(file: FileUpload){
    this.fileUploading.emit(file);
  }

  getFileUploading(){
    return this.fileUploading;
  }
  getFileUploaded(){
    return this.fileUploaded;
  }

  getFileUploadProgress(){
    return this.fileUploadProgress;
  }

}
