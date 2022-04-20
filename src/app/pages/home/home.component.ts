import { Component, OnInit } from '@angular/core';
import { PropertiesService } from 'src/app/services/properties.service';
import { environment } from 'src/environments/environment';

enum PropertyType {
  Alquilar = 'Alquilar',
  Comprar = 'Comprar',
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  recommendeds: any = [];
  recents: any = [];
  filterPropertys: any = [];

  environment = environment;

  showResults = false;
  loading = false;
  option = '';

  // Filters
  rooms: number = 0;
  toilets: number = 0;
  garage: number = 0;

  constructor(private propertiesService: PropertiesService) {}

  async ngOnInit(): Promise<void> {
    this.recommendeds = await this.propertiesService.getRecommendeds();
    this.recents = await this.propertiesService.getRecents();
  }

  async handleSearch(type: string) {
    this.loading = true;
    this.option = type;

    const filterPropertys = await this.propertiesService.getPropertysFilter([
      { key: 'rooms', value: Number(this.rooms) },
      { key: 'garage', value: Number(this.garage) },
      { key: 'toilets', value: Number(this.toilets) },
      { key: 'type', value: type == 'Alquilar' ? 1 : 2 },
    ]);

    this.filterPropertys = filterPropertys;
    this.showResults = true;
    this.loading = false;
  }
}
