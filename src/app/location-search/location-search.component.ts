import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from '../weather.service';
import { StoreService } from '../store.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    first_time: boolean;
    subscription: Subscription;

    constructor(private http: HttpClient, public weatherS: WeatherService, public store: StoreService) { }

    ngOnInit() {
        this.first_time = this.weatherS.latitude ? false : true;

        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIpSearch();
        }

        // check if location has been set and 
        if (this.weatherS.latitude && this.weatherS.longitude) {
            this.searchLatLong(
                this.weatherS.latitude,
                this.weatherS.longitude
            );
        }
    }

    // search weather by latitude and longitude
    searchLatLong(latitude: number, longitude: number) {
        // this.weatherS.apiForecast(latitude, longitude);
        console.log(latitude, longitude);
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
