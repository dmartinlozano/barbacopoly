import { Injectable } from '@angular/core';
var credentials = require("./credentials.json");

@Injectable()
export class CredentialsService {
    
    credentials
    constructor() {}

    load(){
        this.credentials = credentials;
    }
}