import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, GoogleLoginProvider } from "angular-6-social-login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = "https://u9mjna8q8g.execute-api.eu-west-1.amazonaws.com/prod/";
  constructor(private http: HttpClient, private socialAuthService: AuthService) { }

  async signinWithGoogle() {
    var _self = this;
    return new Promise(function (resolve, reject) {
      _self.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
        function (userData) {
          localStorage.setItem("userData.email", userData.email);
          localStorage.setItem("userData.image", userData.image);
          localStorage.setItem("userData.name", userData.name);
          localStorage.setItem("userData.provider", userData.provider);
          localStorage.setItem("userData.token", userData.token);
          resolve(userData.email);
        }
      );
    });
  }

  async check(email) {
    let result = await this.http.post(this.url + "checkemail", { "email": email }, { headers: { 'Content-Type': 'application/json' } }).toPromise();
    return result;
  }
}
