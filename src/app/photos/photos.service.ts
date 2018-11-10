import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import { CredentialsService} from '../app.credentials.service';
import uuid  from 'uuid/v1';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  maxResults :number= 30;
  googleFolder :string="1Jb8sFc-vk-7uS5ZAQK8ueQQ_0xzSeuzS";
  googleApiKey :string="";
  defaultUrlApi :string="";

  constructor(private http:HttpClient, 
              private credentialsService:CredentialsService,
              private toastController: ToastController) {
    this.googleApiKey = credentialsService.credentials["google_api_key"];
    this.defaultUrlApi = "https://www.googleapis.com/drive/v2/files?key="+this.googleApiKey+"&spaces=drive&q=%27"+this.googleFolder+"%27+in+parents";
  }

  async list(isAsc: boolean, nextPageToken: string){
    let url = this.defaultUrlApi;
    url +="&maxResults="+this.maxResults;
    if (isAsc === true){
      url +="&orderBy=modifiedDate asc";
    }else{
      url +="&orderBy=modifiedDate desc"
    }
    if (nextPageToken != null){
      url +="&pageToken="+nextPageToken;
    }
    const result = await this.http.get(url).toPromise();
    return {"nextPageToken":result["nextPageToken"],"items":result["items"]}
  }

  async post(imageData){ 
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('origin',window.location.origin);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('image', 'data:image/jpg;base64,'+imageData);
    formData.append('filename', uuid());
    
    try{
      const result = await this.http.post("http://barbacopoly-361818836.eu-west-1.elb.amazonaws.com:8080/upload-photo", formData, { params, headers}).toPromise();
    }catch(e) {
      throw e;
    }

  }

}
