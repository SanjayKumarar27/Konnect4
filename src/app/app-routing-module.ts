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
import { AdminLoginComponent } from './components/admin-login/admin-login';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { LandingComponent } from './components/landing/landing';
import { AdminAuthGuard } from './admin_auth-guard';


const routes: Routes = [

  // ✅ Landing Page (default entry point)
  { path: '', component: LandingComponent },

  // ✅ User Authentication & Home
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id/followers', component: UserFollwer },
  { path: 'create-post', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'update-post/:postId', component: PostUpdate, canActivate: [AuthGuard] },

  // ✅ Admin Authentication & Dashboard
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },

  // ✅ Catch-all redirect
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
