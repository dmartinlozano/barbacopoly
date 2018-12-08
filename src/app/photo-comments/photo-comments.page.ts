import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Content } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PhotoCommentsService } from './photo-comments.service';
import { ModalController } from '@ionic/angular';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-photo-comments',
  templateUrl: './photo-comments.page.html',
  styleUrls: ['./photo-comments.page.scss'],
})
export class PhotoCommentsPage implements OnInit {

  @ViewChild(Content) content: Content;
  imageSrc: string="";
  imageId: string="";
  msgList;
  commentary: string = "";
  toggled: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute,
              private photoCommentsService: PhotoCommentsService,
              private toastController: ToastController,
              private modalCtrl:ModalController) {
    this.activatedRoute.paramMap.subscribe(params => {
      let re = /resized\-/gi;
      let id = params.get("id");
      id = id.replace(re, "");
      this.imageSrc = "http://barbacopoly.s3-website.eu-west-1.amazonaws.com/" +id;
      id = id.split('.').slice(0, -1).join('.');
      this.imageId = id;
    });
  }

  async ngOnInit() {
    this.list();
  }

  onFocus() {
    this.toggled = false;
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  async list(){
    this.msgList = await this.photoCommentsService.list(this.imageId, false);
  }

  handleSelection(event) {
    this.commentary += event.char;
  }

  async send(){
    try{
      await this.photoCommentsService.post(this.imageId, name, this.commentary);
      this.msgList = await this.photoCommentsService.list(this.imageId, true);
      this.commentary = "";
      let toast = await this.toastController.create({message: "Comentario enviado", duration: 2000});
      toast.present();
      this.scrollToBottom();
    }catch(e){
      console.error(e)
      let toast = await this.toastController.create({message: "Error: "+e.message, duration: 2000});
      toast.present();
    }
  }

}
