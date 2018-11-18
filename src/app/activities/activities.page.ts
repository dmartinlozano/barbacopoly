import { Component } from '@angular/core';
var activitiesJson = require("../activities.json");

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage{

  activities;
  constructor() {
    this.activities=activitiesJson;
  }

}
