import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, GoogleLoginProvider } from "angular-6-social-login";

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  url = "https://u9mjna8q8g.execute-api.eu-west-1.amazonaws.com/prod/";
  constructor(private http: HttpClient, private socialAuthService: AuthService) { }

  async list(email) {
    let result = await this.http.post(this.url + "listphotos", { "email": email }, { headers: { 'Content-Type': 'application/json' } }).toPromise();
    return result;
  }
}
