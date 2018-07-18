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
    city_region: string;

    constructor(public weatherS: WeatherService,
                public router: Router) { }

    ngOnInit() {
        this.first_time = this.weatherS.location.latitude ? false : true;
        this.city_region = `${this.weatherS.location.city}, ${this.weatherS.location.region_code}`;

        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIpSearch();
        }
    }

    // search weather by latitude and longitude
    searchLatLong() {
        this.weatherS.navigate('current');
    }

    // search weather by city, state || zip
    searchCityZip(text_location: string) {
        this.weatherS.apiGeoLocation(text_location);
        setTimeout(()=> {
            this.searchLatLong();
        }, 2000);
    }

}
