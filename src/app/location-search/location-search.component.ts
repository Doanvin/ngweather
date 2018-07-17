import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../weather.service';
import { StoreService } from '../store.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    first_time: boolean;

    constructor(public weatherS: WeatherService, 
                public store: StoreService,
                public router: Router) { }

    ngOnInit() {
        this.first_time = this.weatherS.latitude ? false : true;

        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIpSearch();
        }

        // check if location has been set, search weather using lat long if true 
        if (this.weatherS.hasLocation) {
            this.searchLatLong();
        }
    }

    // search weather by latitude and longitude
    searchLatLong() {
        this.weatherS.navigate('current');
    }

    // search weather by city, state || zip
    searchCityZip(text_location: string) {
        this.weatherS.apiGeoLocation(text_location);
    }

}
