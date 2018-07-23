import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { WeatherService } from '../weather.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
    @ViewChild('location') private location: ElementRef<HTMLInputElement>;
    first_time: boolean;

    constructor(public weatherS: WeatherService,
                public router: Router) { }

    ngOnInit() {
        this.first_time = this.weatherS.location.latitude ? false : true;
        

        // check if first time user, call location search service if true, save data
        if (this.first_time) {
            this.weatherS.apiIpSearch()
            .subscribe(
                o => {
                    this.weatherS.parseIpLocation(o);
                    this.setLocationValue();
                }
            );
        } else if (window.location.pathname === '/') {
            // if on the homepage, fill location input with last used value
            this.setLocationValue();
        }
    }

    // uses WeatherService location and puts it as the value of location input element
    setLocationValue() {
        this.location.nativeElement.value = `${this.weatherS.location.city}, ${this.weatherS.location.region_code}`;
    }

    // search weather by latitude and longitude and navigate to weather display page
    searchLatLong() {
        this.router.navigate([
            '/search', 
            this.weatherS.location.city, 
            this.weatherS.location.region_code.trim()
        ]);
        console.log(`Nav To: /search/${this.weatherS.location.city}/${this.weatherS.location.region_code}`);
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
