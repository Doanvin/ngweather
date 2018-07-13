import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../weather.service';
import { StoreService } from '../store.service';
import { Location } from "../models/location.model";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
  first_time: boolean;
  subscription: Subscription;

  constructor(private http: HttpClient, public weatherService: WeatherService, public store: StoreService) { }

  ngOnInit() {
    this.first_time = this.weatherService.latitude ? false : true;

    // check if first time user, call location search service if true, save data
    if (this.first_time) {
      this.weatherService.autoIpSearch()
        .subscribe( o => {
          let location: Location = {
            city: o['city'] || '',
            region_code: o['region_code'] || '',
            country_code: o['country_code'] || '',
            zip: o['zip'] || '',
            latitude: o['latitude'] || 0,
            longitude: o['longitude'] || 0,
            location_data: o['location']
          }

          if (location.latitude === 0 || location.longitude === 0) {
            return console.error('error using auto geographic lookup');
          }

          this.weatherService.setLocation(location);
        }
      );
    }

    if (this.weatherService.latitude && this.weatherService.longitude) {
      this.searchLatLong(
        this.weatherService.latitude, 
        this.weatherService.longitude
      );
    }
  }

  // search weather by latitude and longitude
  searchLatLong(latitude: number, longitude: number) {
    console.log(latitude, longitude);
  }

  // search weather by city, state || zip
  searchCityZip() {

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
