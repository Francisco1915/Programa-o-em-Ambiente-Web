import { Component, OnInit } from '@angular/core';

// Models
import { User } from 'src/app/core/models/user';
import { HelperService } from 'src/app/core/services/helper.service';

// Services
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | undefined;
  message: string = "";
  selectProfile: boolean = true;
  selectProfileEdit: boolean = false;
  selectProfileHistory: boolean = false;
  selectProfileRequest: boolean = false;

  constructor(
    public UserService: UserService, public helperService: HelperService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.UserService.getProfile().subscribe(res => {
      this.user = res.data;
      this.message = res.message;
    })
  }

  changeSelect(elemt: string) {
    if (elemt != 'profileHistory' && elemt != 'profileRequest') {
      this.getUser();
    }
    this.selectProfile = false;
    this.selectProfileEdit = false;
    this.selectProfileHistory = false;
    this.selectProfileRequest = false;
    switch(elemt) {
      case 'profile': 
        this.selectProfile = true
        break;
      case 'profileEdit':
        this.selectProfileEdit = true
        break;
      case 'profileHistory':
        this.selectProfileHistory = true
        break;
      case 'profileRequest':
        this.selectProfileRequest = true
        break;      
    }
  }

  isAdmin() {
    return this.helperService.isAdmin();
  }
}
