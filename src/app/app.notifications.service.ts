import { Injectable } from '@angular/core';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';
var activitiesJson = require("./activities.json");

@Injectable()
export class NotificationsService {

    activities :ILocalNotification[]=[];
    constructor(private localNotifications: LocalNotifications) { }

    async load(){
      for (let i = 0; i< activitiesJson.length; i++){
        let hour = activitiesJson[i].time.split(':')[0];
        let minute = activitiesJson[i].time.split(':')[1];
        this.activities.push({id: i+1, 
                              title: activitiesJson[i].name,
                              text: hour+":"+minute, 
                              group: "activities",
                              vibrate: true,
                              trigger: { at: new Date(2019, 0, activitiesJson[i].day, hour, minute) }})
      };
      this.localNotifications.schedule(this.activities);
    }
}
