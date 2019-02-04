import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmojiPickerModule } from 'ionic-emoji-picker';
import { IonicModule } from '@ionic/angular';
import { PhotoCommentsPage } from './photo-comments.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoCommentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmojiPickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PhotoCommentsPage]
})
export class PhotoCommentsPageModule {}
