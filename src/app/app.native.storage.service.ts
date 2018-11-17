import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable()
export class NativeStorageService {
    
    constructor(private nativeStorage: NativeStorage) {}

    async setItem(name, value){
        await this.nativeStorage.setItem(name, value);
    }

    async getItem(name){
        return await this.nativeStorage.getItem(name);
    }
    async clear(){
        return await this.nativeStorage.clear();
    }
}