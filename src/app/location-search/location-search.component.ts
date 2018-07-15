import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../weather.service';
import { StoreService } from '../store.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    first_time: boolean;
    subscription: Subscription;

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
        this.router.navigate([
            '/search/current', 
            this.weatherS.city, 
            this.weatherS.region_code
        ]);
        console.log(this.weatherS.latitude, this.weatherS.longitude);
    }

    // search weather by city, state || zip
    searchCityZip(text_location: string) {
        this.weatherS.apiGeoLocation(text_location);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

}
