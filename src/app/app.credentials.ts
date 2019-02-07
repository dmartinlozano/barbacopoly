import { Injectable } from '@angular/core';
import * as credentials from "../../.credentials.json";

@Injectable()
export class CredentialsService {

    credentials
    constructor() { }

    load() {
        this.credentials = credentials;
    }
}