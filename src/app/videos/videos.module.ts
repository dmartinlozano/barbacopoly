import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VideosPage } from './videos.page';
import { VideosViewPage } from './videos-view/videos-view.page';
const routes: Routes = [
  {
    path: '',
    component: VideosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [VideosViewPage],
  declarations: [VideosPage, VideosViewPage],
  exports: [VideosViewPage]
})
export class VideosModule {}
