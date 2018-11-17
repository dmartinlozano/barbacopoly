import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';
import * as S3 from 'aws-sdk/clients/s3';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

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

  async list(isAsc: boolean){
    const params={
      Bucket: "barbacopolyresized"
    };
    return await this.bucket.listObjectsV2(params).promise();
  }

  async postImage(imageData){
    const params={
      Body: Buffer.from(imageData, 'base64'),
      Bucket: "barbacopoly",
      Key: new Date().getTime()+".jpg",
      ContentType: 'image/jpeg'
    };
    return await this.bucket.putObject(params).promise();
  }

}
