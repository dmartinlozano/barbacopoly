import { Injectable, EventEmitter } from '@angular/core';
import { CredentialsService} from '../app.credentials.service';
import { File } from '@ionic-native/file/ngx';
import { FileUpload} from './videos-upload/videos-upload.page';
import * as S3 from 'aws-sdk/clients/s3';
import { fileURLToPath } from 'url';


@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  fileUploading: EventEmitter<String> = new EventEmitter();
  fileUploaded: EventEmitter<FileUpload> = new EventEmitter();
  fileUploadProgress: EventEmitter<FileUpload> = new EventEmitter();
  
  
  constructor(private credentialsService:CredentialsService,
              private file: File) {
    this.bucket = new S3({
      accessKeyId: this.credentialsService.credentials["aws_access_key_id"],
      secretAccessKey: this.credentialsService.credentials["aws_secret_access_key"],
      region: this.credentialsService.credentials["region"],
      httpOptions: {timeout: 99999999}
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

  //TO POST A VIDEO:

  async postVideo(video: FileUpload){

    var _self = this;
    try{
      video.state = 1;
      video.error = null;
      video.progress = 0;
      _self.fileUploaded.emit(video);

      //reload fileEntry:
      let folder = video.file.nativeURL.substring(0,video.file.nativeURL.lastIndexOf("/")+1);
      let folderEntry = await this.file.resolveDirectoryUrl(folder);
      let fileEntry = await this.file.getFile(folderEntry, video.file.name, { create: false });
      fileEntry.file(async function(file){
        let extension = file.name.substr(file.name.lastIndexOf('.') + 1);
        let key = String(new Date().getTime())+"."+extension;
        let uploadId = await _self.createMultipartUpload(key, file.type);
        let partNumber = 1;
        let partSize = 1024 * 1024 * 5;
        let numParts = file.size/partSize;
        let multipartMap = {Parts: []};
        for (let rangeStart = 0; rangeStart < file.size; rangeStart += partSize) {
          let rangeEnd = Math.min(rangeStart + partSize, file.size);
          let blob = await _self.chunkReaderBlock(rangeStart, rangeEnd, file);
          let eTag = await _self.uploadPart(partNumber, blob, key, uploadId);
          video.progress = Math.trunc((100 * partNumber)/numParts);
          _self.fileUploaded.emit(video);
          multipartMap.Parts[partNumber - 1] = {
            ETag: eTag,
            PartNumber: partNumber
          };
          partNumber++;
        }
        await _self.completeMultipartUpload(key, multipartMap, uploadId);
        video.state = 3;
        video.error = null;
        video.progress = 100;
        _self.fileUploaded.emit(video);
      });
    }catch(err){
      console.error(err);
      video.state = 2;
      video.error = err;
      _self.fileUploaded.emit(video);
    }
  }

  async createMultipartUpload(key, contentType){
    var params = {
      Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
      Key: key,
      ContentType: contentType
    };
    let multipart = await this.bucket.createMultipartUpload(params).promise();
    return multipart.UploadId;
  }

  async uploadPart(partNumber, blob, key, uploadId){
    let params = {
      Body: blob,
      Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
      Key: key,
      PartNumber: String(partNumber),
      UploadId: uploadId
    }
    try{
      let mData = await this.bucket.uploadPart(params).promise();
      return mData.ETag;
    }catch(e){
      console.error(e);
    }
  }

  async completeMultipartUpload(key, multipartMap, uploadId){
    let doneParams = {
      Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
      Key: key,
      MultipartUpload: multipartMap,
      UploadId: uploadId
    };
    this.bucket.completeMultipartUpload(doneParams).promise();
  }

  chunkReaderBlock(rangeStart, rangeEnd, file) {
    return new Promise((resolve, reject) => {
      let r = new FileReader();
      let blob = file.slice(rangeStart, rangeEnd);
      r.onloadend = function(evt){
        resolve(r.result);
      }
      r.readAsArrayBuffer(blob);
    });
  }

  //END POST A VIDEO

  addVideoToUpload(fullPath: String){
    this.fileUploading.emit(fullPath);
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
