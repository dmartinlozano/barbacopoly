import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable()
export class NotificationsService {

    constructor(private localNotifications: LocalNotifications) { }

    load(){
      // Schedule delayed notification
      this.localNotifications.schedule({
       text: 'Mimi Time!',
       trigger: {at: new Date(new Date().getTime() + 10)},
       led: 'FF0000',
<<<<<<< HEAD
       vibrate: true,
       sound: 'file://sound.mp3'
=======
       vibrate: true
>>>>>>> master
      });
    }
}
