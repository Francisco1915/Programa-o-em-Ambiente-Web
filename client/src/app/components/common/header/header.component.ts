import { Component, OnInit } from '@angular/core';

// Models
import { User } from 'src/app/core/models/user';

//Services
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User | undefined;
  message: string = "";

  constructor(
    public HelperService: HelperService
    ) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.HelperService.isLoggedIn();
  }

  isAdmin() {
    return this.HelperService.isAdmin();
  }

  logout() {
    this.HelperService.clearSession();
  }

}
