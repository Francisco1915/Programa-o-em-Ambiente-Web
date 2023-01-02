import { Component, Input, OnInit } from '@angular/core';

// Forms
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

// Router
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user';

// Services
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    message: string = '';
    formUser: FormGroup = new FormGroup({});
  
    constructor(
      public userService: UserService,
      private route: ActivatedRoute,
      private router: Router
    ) {}
  
    ngOnInit(): void {

      let phoneRegex = /(9[1236]\d) ?(\d{3}) ?(\d{3})/ 
  
      this.formUser = new FormGroup({
        'name': new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
        'email': new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        'phone': new FormControl('', [
          Validators.required,
          Validators.pattern(phoneRegex)
        ]),
        'password': new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]),
        'date': new FormControl('', [
          Validators.required
        ]),
        'gender': new FormControl('', [
          Validators.required,
          Validators.pattern("None|Male|Female")
        ])
      });
    }

    
  get name() { return this.formUser.get('name'); }

  get phone() { return this.formUser.get('phone') }

  get email() { return this.formUser.get('email'); }

  get password() { return this.formUser.get('password'); }

  get gender() { return this.formUser.get('gender'); }

  get date() { return this.formUser.get('date'); }
  
  register(): void {
    this.message = "";
    this.userService.register(this.formUser.value).subscribe(
      (user) => {
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user register in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/books']);
        } else {
          this.message = user.message;
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
