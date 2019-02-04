import { Injectable, EventEmitter } from '@angular/core';
import { CredentialsService} from '../app.credentials.service';
//import { File } from '@ionic-native/file/ngx';
import { FileUpload} from './videos-upload/videos-upload.page';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  public fileInitUpload: EventEmitter<String> = new EventEmitter();
  public fileUpload: EventEmitter<FileUpload> = new EventEmitter(); 
  
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

  async abortUploadVideo(video: FileUpload){
    if (video.awsUploading.uploadId !== ""){
      var params = {
        Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
        Key: video.awsUploading.key,
        UploadId: video.awsUploading.uploadId
      };
      await this.bucket.abortMultipartUpload(params).promise();
      video.state = 2;
      video.error = null;
      video.progress = 0;
      video.awsUploading = {uploadId:"", key:""};
      this.fileUpload.emit(video);
    }
  }

  //TO POST A VIDEO:

  async postVideo(video: FileUpload){

    var _self = this;
    video.state = 1;
    video.error = null;
    video.progress = 0;
    video.awsUploading = {uploadId:"", key:""};
    _self.fileUpload.emit(video);

    //reload fileEntry:
    //let folder = video.file.nativeURL.substring(0,video.file.nativeURL.lastIndexOf("/")+1);
    //let folderEntry = await this.file.resolveDirectoryUrl(folder);
    //let fileEntry = await this.file.getFile(folderEntry, video.file.name, { create: false });

   /* fileEntry.file(async function(file){
      let extension = file.name.substr(file.name.lastIndexOf('.') + 1);
      let key = String(new Date().getTime())+"."+extension;
      let uploadId = await _self.createMultipartUpload(key, file.type);
      video.awsUploading = {uploadId: uploadId, key: key};
      _self.fileUpload.emit(video);

      let partNumber = 1;
      let partSize = 1024 * 1024 * 5;
      let numParts = file.size/partSize;
      let multipartMap = {Parts: []};
      let hasBeenAborted = false;
      for (let rangeStart = 0; rangeStart < file.size; rangeStart += partSize) {
        try{
          if (hasBeenAborted === false){
            let rangeEnd = Math.min(rangeStart + partSize, file.size);
            let blob = await _self.chunkReaderBlock(rangeStart, rangeEnd, file);
            let eTag = await _self.uploadPart(partNumber, blob, key, uploadId);
            video.progress = Math.trunc((100 * partNumber)/numParts);
            _self.fileUpload.emit(video);
            multipartMap.Parts[partNumber - 1] = {
              ETag: eTag,
              PartNumber: partNumber
            };
            partNumber++;
          }
        }catch(e){
          if (e.code === "NoSuchUpload"){
            hasBeenAborted = true;
          }else{
            console.error(e);
            video.state = 3;
            video.error = e;
            video.awsUploading = {uploadId:"", key:""};
            _self.fileUpload.emit(video);
          }
        }
      }
      if (hasBeenAborted === false){
        await _self.completeMultipartUpload(key, multipartMap, uploadId);
        video.state = 4;
        video.error = null;
        video.progress = 100;
        video.awsUploading = {uploadId:"", key:""};
        _self.fileUpload.emit(video);
      }
    });*/
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
      throw e;
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

  getFileInitUpload(){
    return this.fileInitUpload;
  }

  getFileUpload(){
    return this.fileUpload;
  }

}
