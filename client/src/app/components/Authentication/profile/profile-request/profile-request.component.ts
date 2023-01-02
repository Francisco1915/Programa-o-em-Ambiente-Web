import { Component, Input, OnInit } from '@angular/core';
import { Request } from 'src/app/core/models/request';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-profile-request',
  templateUrl: './profile-request.component.html',
  styleUrls: ['./profile-request.component.css']
})
export class ProfileRequestComponent implements OnInit {

  @Input() user: User | undefined;
  requests: Request[] = [];
  message: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRequests().subscribe((res) => {
      if (res.data && this.requests) {
        this.message = res.message;
        this.requests = res.data;
      }
    })
  }

  deleteRequest(id: string) {
    this.userService.deleteRequest(id).subscribe(res => {
      this.message = res.message;
    })
  }
}
