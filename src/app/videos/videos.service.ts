import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';
import * as S3 from 'aws-sdk/clients/s3';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  maxResults :number= 30;
  bucket;
  
  constructor(private http:HttpClient, 
              private credentialsService:CredentialsService,
              private toastController: ToastController) {
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

  async postVideo(file){
    const params={
      Body: file,
      Bucket: "barbacopolyvideos-source-fswkbjnf34ur",
      Key: new Date().getTime()+".mp4",
      ContentType: 'video/mp4'
    };
    return await this.bucket.putObject(params).promise();
  }

}
