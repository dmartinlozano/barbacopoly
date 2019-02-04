import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  urlGet = "https://jaepk2mxx5.execute-api.eu-west-1.amazonaws.com/spotify";
  apiKey:string;
  
  constructor(private http:HttpClient) { }

  async get(){
    return await this.http.get(this.urlGet).toPromise();
  }
}
