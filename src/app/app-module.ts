import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { PostCreateComponent } from './components/post-create/post-create';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostFeed } from './components/post-feed/post-feed';
import { PostUpdate } from './components/post-update/post-update';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TopbarComponent } from './components/topbar/topbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { HomeComponent } from './components/home/home';
import { SearchComponent } from './components/search/search';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile';
import { CommentList } from './components/comment-list/comment-list';
import { UserFollwer } from './user-follwer/user-follwer';
import { UserFollowing } from './user-following/user-following';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiPicker } from './components/emoji-picker/emoji-picker';
import { ChatRoom } from './chat-room/chat-room';
import { ChatList } from './chat-list/chat-list';
import { Explore } from './components/explore/explore';
import { AdminDashboardComponent } from './components/admin-dashboard-component/admin-dashboard-component';
import { AdminUserComponent } from './components/admin-user-component/admin-user-component';
import { AdminPostsComponent } from './components/admin-posts-component/admin-posts-component';
import { JwtInterceptor } from './jwt-interceptor-interceptor';



@NgModule({
  declarations: [
    App,
    Login,
    Register,
    PostCreateComponent,
    PostFeed,
    PostUpdate,
    TopbarComponent,
    SidebarComponent,
    HomeComponent,
    SearchComponent,
    ProfileComponent,
    CommentList,
    UserFollwer,
    UserFollowing,
    EmojiPicker,
    ChatList,
    ChatRoom,
    Explore,
    AdminDashboardComponent,
    AdminUserComponent,
    AdminPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PickerModule,
    
  ],
  providers: [
    provideHttpClient(),
  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }