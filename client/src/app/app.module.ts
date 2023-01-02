import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookCreateComponent } from './components/book/book-create/book-create.component';
import { BookDetailsComponent } from './components/book/book-details/book-details.component';
import { BookMainComponent } from './components/book/book-main/book-main.component';
import { HeaderComponent } from './components/common/header/header.component';
import { LoginComponent } from './components/Authentication/login/login.component';
import { RegisterComponent } from './components/Authentication/register/register.component';
import { CartSidenavComponent } from './components/shopping/cart-sidenav/cart-sidenav.component';
import { JwtIntercpetorService } from './core/Interceptors/jwt-intercpetor.service';
import { AuthGuardService } from './core/services/auth-guard.service';
import { ProfileComponent } from './components/Authentication/profile/profile/profile.component';
import { ProfileEditComponent } from './components/Authentication/profile/profile-edit/profile-edit.component';
import { ProfileDetailsComponent } from './components/Authentication/profile/profile-details/profile-details.component';
import { ProfileHistoryComponent } from './components/Authentication/profile/profile-history/profile-history.component';
import { ProfileRequestComponent } from './components/Authentication/profile/profile-request/profile-request.component';
import { ProfileHeaderComponent } from './components/Authentication/profile/profile-header/profile-header.component';
import { MainComponent } from './components/common/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'books',
    component: BookMainComponent,
  },
  {
    path: 'books/details/:id',
    component: BookDetailsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'books/add-book', 
    component: BookCreateComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent, canActivate: [AuthGuardService]
  },
  {
    path: '**',
    component: BookMainComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BookCreateComponent,
    BookDetailsComponent,
    BookMainComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    CartSidenavComponent,
    ProfileComponent,
    ProfileEditComponent,
    ProfileDetailsComponent,
    ProfileHistoryComponent,
    ProfileRequestComponent,
    ProfileHeaderComponent,
    MainComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtIntercpetorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
