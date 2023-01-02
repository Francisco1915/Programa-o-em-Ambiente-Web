import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() email1: string = "";
  @Input() password1: string = "";
  message: string = '';
  formUser: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    this.formUser = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8)
      ]),
    });

  }

  get email() { return this.formUser.get('email'); }

  get password() { return this.formUser.get('password'); }
  
  login(): void {
    this.message = "";
    let link: string = "";
    this.userService.login(this.email1, this.password1).subscribe((user) => {
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        history.go(-1);
      } else {
        this.message = user.message;
      }
    },
    (err) => {
      console.log(err);
    })
  }

}
