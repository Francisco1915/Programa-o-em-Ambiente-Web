import { Component, Input, OnInit } from '@angular/core';

// Models
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  @Input() user: User | undefined;
  message: string = "";

  constructor() { }

  ngOnInit(): void {
  }


}
