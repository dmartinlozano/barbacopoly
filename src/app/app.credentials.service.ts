import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as credentials from './credentials.json';

@Injectable()
export class CredentialsService {
    
    credentials;
    constructor(private http:HttpClient) {}

    load(){
        this.credentials = credentials;
    }
}