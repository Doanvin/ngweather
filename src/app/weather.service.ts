import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StoreService } from './store.service';
import { Location } from './models/location.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  location: any;
  latitude: number;
  longitude: number;
  city: string;
  region_code: string;

  constructor(public store: StoreService, public http: HttpClient) { 
    this.location = JSON.parse(localStorage.getItem('location')) || '';
    this.latitude =  this.location.latitude || 0;
    this.longitude = this.location.longitude || 0;
    this.city = this.location.city || '';
    this.region_code = this.location.region_code || '';
  }

  autoIpSearch() {
    const url = 'http://api.ipstack.com/check?access_key=781d96fbe17ec4d760a7474492866543';
    console.log('ip search api called');
    return this.http.get(url);
  }

  setLocation(location: Location) {
    this.location = location;
    this.store.set('location', location);
    console.log('location set successful');
    return true;
  }

  getLocation() {
    return this.store.get('location');
  }
}
