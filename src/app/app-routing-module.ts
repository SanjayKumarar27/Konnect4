import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostFeed } from './components/post-feed/post-feed';
import { PostCreateComponent } from './components/post-create/post-create';
import { PostUpdate } from './components/post-update/post-update';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthGuard } from './auth-guard';
import { HomeComponent } from './components/home/home';
import { ProfileComponent } from './components/profile/profile';
import { CommentList } from './components/comment-list/comment-list';
import { UserFollwer } from './user-follwer/user-follwer';
import { UserFollowing } from './user-following/user-following';
import { ChatList } from './chat-list/chat-list';
import { ChatRoom } from './chat-room/chat-room';
import { Explore } from './components/explore/explore';
import { AdminDashboardComponent } from './components/admin-dashboard-component/admin-dashboard-component';
import { AdminUserComponent } from './components/admin-user-component/admin-user-component';
import { AdminPostsComponent } from './components/admin-posts-component/admin-posts-component';
import { AdminGuard } from './admin-guard-guard';


const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id/followers', component: UserFollwer },
  { path: 'profile/:id/following', component: UserFollowing },
  { path: 'create-post', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'update-post/:postId', component: PostUpdate, canActivate: [AuthGuard] },
  {path:'Explore',component:Explore},
 
  
  // Chat routes
  { path: 'chats', component: ChatList, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatRoom, canActivate: [AuthGuard] },

    // ✅ ADMIN ROUTES
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/users', component: AdminUserComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/posts', component: AdminPostsComponent, canActivate: [AuthGuard, AdminGuard] },


  // Default redirect
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Catch-all redirect
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }