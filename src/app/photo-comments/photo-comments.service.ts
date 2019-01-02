import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { CredentialsService} from '../app.credentials.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoCommentsService {

  urlPost = "https://api.mlab.com/api/1/databases/barbacopoly/collections/";
  apiKey:string;
  
  constructor(private http:HttpClient, 
              private credentialsService:CredentialsService) {
                  this.apiKey = credentialsService.credentials["mongo_api_key"];
  }

  async list(imageId, isAsc){
    let s;
    if (isAsc){
      s = '{"date": 1}';
    }else{
      s = '{"date": -1}';
    }
    let url = this.urlPost + imageId + "?apiKey=" + this.apiKey + "&" +s;
    return await this.http.get(url).toPromise();
  }

  async count(imageId){
    let url = this.urlPost + imageId + "?apiKey=" + this.apiKey + "&c=true";
    return await this.http.get(url).toPromise();
  }

  async post(imageId, name, text){
    let url = this.urlPost + imageId + "?apiKey=" + this.apiKey;
    return await this.http.post(url, {name: name, text: text, date: Date.now()},{headers:{'Content-Type': 'application/json' }}).toPromise();
  }
}
