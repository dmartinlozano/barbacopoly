import { Component } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-meeting-point',
  templateUrl: './meeting-point.page.html',
  styleUrls: ['./meeting-point.page.scss'],
})
export class MeetingPointPage {
  constructor(private launchNavigator: LaunchNavigator) { }
  async navigate(){
    await this.launchNavigator.navigate('La dehesilla de Melque, Toledo');
  }
}
