import { Injectable } from '@angular/core';

@Injectable()
export class NativeStorageService {
    
    constructor() {}

    setItem(name, value){
       localStorage.setItem(name, value);
    }

    getItem(name){
        return localStorage.getItem(name);
    }
    clear(){
        return localStorage.clear();
    }
}
