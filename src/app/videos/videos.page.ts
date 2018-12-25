import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { VideosService } from './videos.service';
import { Tabs } from '@ionic/angular';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements AfterViewInit{
  @ViewChild("tabs") tabs: Tabs;
  subscriptionVideoToUpload: any;
  numberUploadingVideos = 0;

  constructor(private videosService: VideosService) { }
  ngAfterViewInit(){
    var _self = this;
    setTimeout(()=>{
      this.tabs.select("videos-view");
    },500);
  }

  selectTab(index: string){
    setTimeout(()=>{
      this.tabs.select(index);
    },500)
  }



}
