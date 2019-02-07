import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
  ids = [
    "fbuHC9Nrw0U",
    "_HOBtgndCjI",
    "LE3VO1AhLTo",
    "nkErQmLSv9M",
    "633brltWGyQ",
    "Y7HT0curJvo",
    "_HTq7WuTFPA"
  ];
  images = [];

  constructor() { }

  ngOnInit() {
    this.list();
  }

  list() {
    var _self = this;
    this.ids.forEach(function (id) {
      _self.images.push({ "id": id, "src": "https://img.youtube.com/vi/" + id + "/0.jpg" })
    })
  }
  open(id) {
    window.open("https://www.youtube.com/embed/" + id + "?rel=0&amp;autoplay=1;fs=0;autohide=0;hd=0;", '_system', 'location=yes');
  }

}
