import { Injectable } from '@angular/core';
import { NativeStorageService}  from '../app.native.storage.service';

@Injectable({
  providedIn: 'root'
})
export class NameService {

  
  constructor(private nativeStorageService: NativeStorageService) {}

  async get(){
    try{
      return await this.nativeStorageService.getItem("name");
    }catch(e){
      return null;
    }
  }
  async set(name){
    await this.nativeStorageService.setItem("name", name);
  }
}
