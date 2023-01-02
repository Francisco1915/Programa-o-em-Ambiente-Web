import { Component, Input, OnInit } from '@angular/core';

//Models
import { User } from 'src/app/core/models/user';

//Service
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-profile-history',
  templateUrl: './profile-history.component.html',
  styleUrls: ['./profile-history.component.css']
})
export class ProfileHistoryComponent implements OnInit {

  @Input() user: User | undefined;
  message: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getPurchaseHistory().subscribe((res) => {
      if (res.data && this.user) {
        this.user.receipts = res.data;
      }
    })
  }

}
