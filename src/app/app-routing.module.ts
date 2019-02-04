import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'photos', loadChildren: './photos/photos.module#PhotosPageModule' },
  { path: 'videos', loadChildren: './videos/videos-view/videos-view.module#VideosViewModule' },
  { path: 'videos-upload', loadChildren: './videos/videos-upload/videos-upload.module#VideosUploadModule' },
  { path: 'activities', loadChildren: './activities/activities.module#ActivitiesPageModule' },
  { path: 'photo/:id', loadChildren: './photo-comments/photo-comments.module#PhotoCommentsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
