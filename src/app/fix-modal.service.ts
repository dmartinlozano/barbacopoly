import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FixModalService {

  constructor(private actionSheetController: ActionSheetController, private alertController: AlertController) { }

  async fix() {

    //try dismiss without problems:
    let actionSheetController = await this.actionSheetController.getTop();
    if (actionSheetController) { try { actionSheetController.dismiss(); } catch (e) { } }

    let alertController = await this.alertController.getTop();
    if (alertController) { try { alertController.dismiss(); } catch (e) { } }

    //fix back actionsheets:
    let ionActionSheets = document.querySelectorAll('ion-action-sheet');
    for (let i = 0; i < ionActionSheets.length; i++) {
      ionActionSheets[i].remove();
    }
    let ionActionSheetControllers = document.querySelectorAll('ion-action-sheet-controller');
    for (let i = 0; i < ionActionSheetControllers.length; i++) {
      ionActionSheetControllers[i].remove();
    }
    let ionAlert = document.querySelectorAll('ion-alert');
    for (let i = 0; i < ionAlert.length; i++) {
      ionAlert[i].remove();
    }
  }
}
