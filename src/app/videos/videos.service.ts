import { Injectable, EventEmitter } from '@angular/core';
import { CredentialsService} from '../app.credentials.service';
import { File } from '@ionic-native/file/ngx';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  fileUploaded: EventEmitter<Error> = new EventEmitter();
  
  constructor(private credentialsService:CredentialsService,
              private file: File) {
    this.bucket = new S3({
      accessKeyId: this.credentialsService.credentials["aws_access_key_id"],
      secretAccessKey: this.credentialsService.credentials["aws_secret_access_key"],
      region: this.credentialsService.credentials["region"]
    });
  }

  async list(isAsc: boolean){
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

  postVideo(fileStruct){
    var _self = this;
    let folder = fileStruct.fullPath.substring(0,fileStruct.fullPath.lastIndexOf("/")+1);
    this.file.readAsArrayBuffer(folder, fileStruct.name).then(function(bytes){
        const params={
          Body:  bytes,
          Bucket: "barbacopolyvideos-source-x9o9zwmvf1e5",
          Key: fileStruct.name,
          ContentType: fileStruct.type
        };
        _self.bucket.putObject(params,function(err, data){
            if (err){
              console.error(err);
              _self.fileUploaded.emit(err);
            }else{
              //file uploaded ok
              _self.fileUploaded.emit(null);
            }
        });
    }).catch(function(e){
      console.error(e);
      _self.fileUploaded.emit(e);
    });
  }

  getResultProcessingVideo(){
    return this.fileUploaded;
  }
}
