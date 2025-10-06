import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {  PostCreateComponent } from './components/post-create/post-create';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostFeed } from './components/post-feed/post-feed';
import {  CommentsList } from './components/comment-list/comment-list';
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


@NgModule({
  declarations: [
    App,
    Login,
    Register,
    PostCreateComponent,
    PostFeed,
    CommentsList,
    PostUpdate,
    TopbarComponent,
    SidebarComponent,
    HomeComponent,
    SearchComponent,
    ProfileComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule


  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
