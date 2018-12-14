import { Component, OnInit } from '@angular/core';
import {MusicService} from './music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {

  music = null;
  constructor(private musicService: MusicService) { }

  async ngOnInit() {
    try{
      this.music = await this.musicService.get();
    }catch(e){
      this.music = null;
    }
  }

}
