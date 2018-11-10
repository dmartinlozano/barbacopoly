import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';
import uuid  from 'uuid/v1';

@Injectable({
  providedIn: 'root'
})
export class PhotoViewService {

  googleApiKey :string="";

  constructor(private http:HttpClient, 
              private credentialsService:CredentialsService,
              private toastController: ToastController) {
    this.googleApiKey = credentialsService.credentials["google_api_key"];
  }

  async get(id:string){
    const result = await this.http.get("http://barbacopoly-361818836.eu-west-1.elb.amazonaws.com:8080/download-photo/"+id).toPromise();
    console.log(result);
    return "";
  }
}
