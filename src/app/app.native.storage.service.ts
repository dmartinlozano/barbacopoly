import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable()
export class NativeStorageService {
    
    credentials
    constructor(private nativeStorage: NativeStorage) {}

    async setItem(name, value){
        await this.nativeStorage.setItem(name, {property: value});
    }

    async getItem(name){
        return await this.nativeStorage.getItem(name);
    }
}