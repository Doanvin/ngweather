import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '../models/location.model';
import { WeatherService } from '../services/weather.service';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    @ViewChild('locationEl') private locationEl: ElementRef<HTMLInputElement>;
    first_time: boolean;
    location: Location;


    constructor(private weatherS: WeatherService, private router: Router) { }

    ngOnInit() {
        // subscribe to location changes
        this.weatherS.location$.subscribe(location => {
            this.location = location;
            this.setLocationValue();
        });

        // set location value
        this.first_time = this.location.latitude ? false : true;
        this.setLocationValue();
    }

    // uses WeatherService location and puts it as the value of location input element
    setLocationValue() {
        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIp().subscribe(o => {
                this.weatherS.parseIp(o);
            });
        } else if (window.location.pathname === '/') {
            // if on the homepage, fill location input with last used value
            this.locationEl.nativeElement.value = `${this.location.city}, ${this.location.region_code}`;
        } else if (window.location.pathname !== '/') {
            // dont set value
        }

    }

    // search weather by latitude and longitude and navigate to weather display page
    searchLatLong() {
        this.router.navigate([
            '/search',
            this.location.city,
            this.location.region_code.trim()
        ]);
        console.log(`Nav To: /search/${this.location.city}/${this.location.region_code}`);
    }

    // search weather by city, state || zip using the apiLocation
    searchCityZip(text_location: string) {
        this.weatherS.apiLocation(text_location).subscribe(o => {
            this.weatherS.parseLocation(o);
            this.searchLatLong();
        });
    }

}
