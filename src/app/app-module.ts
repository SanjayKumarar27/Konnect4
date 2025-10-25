import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {  PostCreateComponent } from './components/post-create/post-create';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostFeed } from './components/post-feed/post-feed';
import { PostUpdate } from './components/post-update/post-update';
import {  provideHttpClient } from '@angular/common/http';
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
    EmojiPicker


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PickerModule
  

  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
