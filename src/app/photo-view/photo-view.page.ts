import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var cordova: any;

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.page.html',
  styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage{

  href;
  id;
  storageDirectory: string = '';

  constructor(private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get("id")
      this.href = "http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" + this.id;
    });
  }
  async downloadPhoto(){
  }

  async ngOnInit() {
  }

}
