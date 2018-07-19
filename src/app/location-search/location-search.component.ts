import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../weather.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    first_time: boolean;
    locationElement: HTMLElement;

    constructor(public weatherS: WeatherService,
                public router: Router) { }

    ngOnInit() {
        this.first_time = this.weatherS.location.latitude ? false : true;
        this.locationElement = document.getElementById('location-search');
        

        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIpSearch()
            .subscribe(
                o => {
                    this.weatherS.parseIpLocation(o);
                    this.locationElement['value'] = `${this.weatherS.location.city}, ${this.weatherS.location.region_code}`;
                }
            );
        }
    }

    // search weather by latitude and longitude
    searchLatLong() {
        this.weatherS.navigate('current');
    }

    // search weather by city, state || zip
    searchCityZip(text_location: string) {
        this.weatherS.apiGeoLocation(text_location)
        .subscribe(
            o => {
                this.weatherS.parseLocation(o);
                this.searchLatLong();
            }
        );
    }

}
