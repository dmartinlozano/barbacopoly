import { Component, OnInit } from '@angular/core';
import {MusicService} from './music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {

  music = null;
  pageIsUp : boolean = true;
  constructor(private musicService: MusicService) { }

  ngOnInit () {

    this.pageIsUp = true;

    //first time:
    this.getMusic();

    //check every 10 seconds:
    var _self = this;
    var refreshId =setInterval(async function(){
      if (_self.pageIsUp === false) {
        clearInterval(refreshId);
      }
      _self.getMusic();
    }, 10000)
  }

  async getMusic(){
    try{
      this.music = await this.musicService.get();
    }catch(e){
      this.music = null;
    }
  }

  async ionViewWillLeave() {
    this.pageIsUp = false;
  }


}
