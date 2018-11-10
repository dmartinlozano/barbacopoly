import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {PhotoViewService} from './photo-view.service';

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.page.html',
  styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage implements OnInit {

  id;
  url;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private photoViewService:PhotoViewService) { 
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
  });
  }

  async ngOnInit() {
    this.url = await this.photoViewService.get(this.id);
  }

}
