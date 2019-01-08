import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FixModalService {

   constructor() {}

  async fix(){
    //fix back actionsheets:
    let ionActionSheets = document.querySelectorAll('ion-action-sheet');
    for (let i = 0; i< ionActionSheets.length; i++){
      ionActionSheets[i].remove();
    }
    let ionActionSheetControllers = document.querySelectorAll('ion-action-sheet-controller');
    for (let i = 0; i< ionActionSheetControllers.length; i++){
      ionActionSheetControllers[i].remove();
    }
    let ionAlert = document.querySelectorAll('ion-alert');
    for (let i = 0; i< ionAlert.length; i++){
      ionAlert[i].remove();
    }
  }
}
