import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PhotosService } from './photos.service';

export class Image {
  key: string;
  src: string;
  count: Number;
}

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

  images: Image[] = [];

  constructor(private photosService: PhotosService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.list();
  }

  async list() {
    try {
      var _self = this;
      this.images = [];
      let email = localStorage.getItem("userData.email");
      let data: any = await _self.photosService.list(email)
      data.forEach(key => {
        if (key !== "") {
          _self.images.push({ key: key, src: "https://dsr0e097nvn0c.cloudfront.net/" + key, count: 0 })
        }
      });
    } catch (e) {
      let toast = await this.toastController.create({
        message: "Error: " + e.message,
        duration: 2000
      });
      toast.present();
    }
  }

  open(url) {
    window.open(url, '_system', 'location=yes');
  }

}
