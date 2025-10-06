import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostFeed } from './components/post-feed/post-feed';
import { PostCreateComponent } from './components/post-create/post-create';
import { PostUpdate } from './components/post-update/post-update';
import { CommentsList } from './components/comment-list/comment-list';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthGuard } from './auth-guard';
import { HomeComponent } from './components/home/home';
import { ProfileComponent } from './components/profile/profile';

const routes: Routes = [

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'feed', component: PostFeed,canActivate:[AuthGuard] },
  { path: 'home', component: HomeComponent ,canActivate:[AuthGuard]},
  { path: 'profile/:id', component: ProfileComponent ,canActivate:[AuthGuard]},
  { path: 'create-post', component: PostCreateComponent ,canActivate:[AuthGuard]},
  { path: 'update-post/:postId', component: PostUpdate,canActivate:[AuthGuard] },
  { path: 'comments/:postId', component: CommentsList,canActivate:[AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
