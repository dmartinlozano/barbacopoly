import { Component, OnInit } from '@angular/core';
var activitiesJson = require("../activities.json");

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  activities;
  constructor() {
    this.activities=activitiesJson;
  }

  ngOnInit() {
  }

}
