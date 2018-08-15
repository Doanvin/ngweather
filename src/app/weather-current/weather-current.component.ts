import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { WeatherService } from '../services/weather.service';
declare var Skycons: any;

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit, OnDestroy {
    currently: object;
    location: {city: string, region_code: string};

    currently$: Subscription;
    daily$: Subscription;    


    city: string;
    region_code: string;
    summary: string;
    icon: string;
    temp: number;
    temp_low: number;
    temp_high: number;
    apparent_temp: number;
    humidity: number;
    precip_probability: number;
    precip_type: string;
    pressure: number;
    wind_speed: number;
    uv_index: number;
    visibility: number;
    ozone: number;

    constructor(private route: ActivatedRoute, private weatherS: WeatherService) { }

    ngOnInit() {
        // subscribe to url changes and 
        this.route.params
            .subscribe(
                params => {
                    this.city = params['city'];
                    this.region_code = params['region_code'];
                    this.initiationSequence();
                }
            );
        // subscribe to forecast: currently
        this.currently$ = this.weatherS.currently$.subscribe(currently => {
            this.currently = currently;
            this.setCurrentlyVars();
        });

        // subscribe to forecast: daily
        this.daily$ = this.weatherS.daily$.subscribe(daily => {
            // sets local variables for forecast: daily
            this.temp_low = Math.round(daily[0]['temperatureLow']) || 0;
            this.temp_high = Math.round(daily[0]['temperatureHigh']) || 0;
        });
    }

    // sets local variables for forecast: currently
    setCurrentlyVars() {
        this.summary = this.currently['summary'] || 'Error Retrieving Weather Info';
        this.icon = this.currently['icon'] || '';
        this.temp = Math.round(this.currently['temperature']) || 0;
        this.apparent_temp = Math.round(this.currently['apparentTemperature']) || 0;
        this.humidity = Math.round(this.currently['humidity'] * 100) || 0;
        this.precip_probability = Math.round(this.currently['precipProbability'] * 100) || 0;
        this.precip_type = this.currently['precipType'] || 'precipitaion';
        this.pressure = Math.round(this.currently['pressure']) || 0;
        this.wind_speed = Math.round(this.currently['windSpeed']) || 0;
        this.uv_index = this.currently['uvIndex'] || 0;
        this.ozone = Math.round(this.currently['ozone']) || 0;
        this.startSkycons();
    }

    // weather images
    startSkycons() {
        let skycons = new Skycons({ "color": "#D46A6A" });
        let icon = this.icon.toUpperCase().replace(/-/g, "_");
        skycons.add('icon', Skycons[icon]);
        skycons.play();
    }

    initiationSequence() {
        // if city and state match route params don't make another location api call
        if (this.weatherS.location_matches) {
            this.weatherS.apiForecast().subscribe(response => {
                console.log('darksky forecast api called from if');
                this.weatherS.parseForecast(response);
            });
        } else {
            const city_region = `${this.city}, ${this.region_code}`;
            this.weatherS.apiLocation(city_region).subscribe(res => {
                this.weatherS.parseLocation(res);
                this.weatherS.apiForecast().subscribe(response => {
                    console.log('darksky forecast api called from else');
                    this.weatherS.parseForecast(response);
                });
            });
        }
    }

    ngOnDestroy() {
        this.currently$.unsubscribe();
        this.daily$.unsubscribe();
    }

}
