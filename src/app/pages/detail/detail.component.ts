import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from 'src/app/services/properties.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  property: any;
  profile: any;
  environment = environment;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private properties: PropertiesService,
    private auth: AuthService
  ) {}
  async ngOnInit(): Promise<void> {
    const state: any = this.location.getState();

    if (!state?.id) {
      this.activatedRoute.params.subscribe(async (o) => {
        this.property = await this.properties.getProperty(o.id);
        this.profile = await this.auth.getProfileOfPost(this.property.uid);
      });
    } else {
      this.property = state;
      this.profile = await this.auth.getProfileOfPost(this.property.uid);
    }
  }
}
