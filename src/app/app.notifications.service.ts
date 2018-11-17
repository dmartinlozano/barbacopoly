import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
var activitiesJson = require("./activities.json");

@Injectable()
export class NotificationsService {

    constructor(private localNotifications: LocalNotifications) { }

    load(){
      activitiesJson.forEach(activity => {
        let hour = activity.time.split(':')[0];
        let minute = activity.time.split(':')[1];
        this.localNotifications.schedule({
          text: activity.name,
          trigger: { at: new Date(2019, 0, 12, hour, minute) },
          //trigger: { at: new Date(2018, 10, 17, 23, 40) },
          led: 'FF0000',
          vibrate: true,
          icon: 'warning',
          sound: 'file://./../asset/notification.mp3'
         });
      });
    }
}
