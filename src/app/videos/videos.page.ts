import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Tabs } from '@ionic/angular';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements AfterViewInit{
  @ViewChild("tabs") tabs: Tabs;

  constructor() { }
  ngAfterViewInit(){
    setTimeout(()=>{
      this.tabs.select("videos-view");
    },500)
  }
}
