import { Component, Input, OnInit } from '@angular/core';

// Forms
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// Router
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user';

// Services
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  @Input() user: User | undefined;
  message: string = '';
  formUser: FormGroup = new FormGroup({});

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let phoneRegex = /(9[1236]\d) ?(\d{3}) ?(\d{3})/

    this.formUser = new FormGroup({
      'name': new FormControl(this.user?.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      'email': new FormControl(this.user?.email, [
        Validators.required,
        Validators.email
      ]),
      'phone': new FormControl(this.user?.phone, [
        Validators.required,
        Validators.pattern(phoneRegex)
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ]),
      'date': new FormControl(this.user?.date, [
        Validators.required
      ]),
      'gender': new FormControl(this.user?.gender, [
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

  edit(): void {
    this.message = "";
    this.userService.edit(this.formUser.value).subscribe(
      (user) => {
          this.router.navigate(['/profile']);
          this.message = user.message;
    });
  }
}
