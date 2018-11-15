import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';;
import {Buffer} from 'buffer';
import { File } from '@ionic-native/file/ngx';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  
  constructor(private http:HttpClient, 
              private credentialsService:CredentialsService,
              private toastController: ToastController,
              private file: File) {
    this.bucket = new S3({
      accessKeyId: this.credentialsService.credentials["aws_access_key_id"],
      secretAccessKey: this.credentialsService.credentials["aws_secret_access_key"],
      region: this.credentialsService.credentials["region"]
    });
  }

  async list(isAsc: boolean, nextContinuationToken: string){
    const params={
      Bucket: "barbacopolyresized",
      MaxKeys: this.maxResults
    };
    if (nextContinuationToken){
      params["NextContinuationToken"] = nextContinuationToken;
    }
    return await this.bucket.listObjectsV2(params).promise();
  }

  async postVideo(fileStruct){

    let folder = fileStruct.fullPath.substring(0,fileStruct.fullPath.lastIndexOf("/")+1);
    let bytes = await this.file.readAsArrayBuffer(folder, fileStruct.name)

    const params={
      Body:  bytes,
      Bucket: "barbacopolyvideos-source-fswkbjnf34ur",
      Key: fileStruct.name,
      ContentType: fileStruct.type
    };
    return await this.bucket.upload(params).promise();
  }

}
