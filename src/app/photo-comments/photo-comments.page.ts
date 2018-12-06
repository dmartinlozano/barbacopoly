import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Content } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PhotoCommentsService } from './photo-comments.service';
import { ModalController } from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import {NameService} from '../name/name.service';
import { NamePage } from '../name/name.page';

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
              private nameService: NameService,
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
    let name = await this.nameService.get();
    if (name === null){
      let modal = await this.modalCtrl.create({component: NamePage});
      modal.present();
    }else{
      this.list();
    }
  }

  onFocus() {
    this.toggled = false;
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.toggled = !this.toggled;
    if (!this.toggled) {
      this.focus();
    }
    this.scrollToBottom();
  }

  private focus() {
    /*if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }*/
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
      let name = await this.nameService.get();
      await this.photoCommentsService.post(this.imageId, name, this.commentary);
      this.msgList = await this.photoCommentsService.list(this.imageId, true);
      this.commentary = "";
      let toast = await this.toastController.create({message: "Comentario enviado", duration: 2000});
      toast.present();
      if (!this.toggled) {
        this.focus();
      }
    }catch(e){
      console.error(e)
      let toast = await this.toastController.create({message: "Error: "+e.message, duration: 2000});
      toast.present();
    }
  }

}
