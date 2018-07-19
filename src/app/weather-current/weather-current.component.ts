import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WeatherService } from '../weather.service';
declare var Skycons: any;

@Component({
    selector: 'app-weather-current',
    templateUrl: './weather-current.component.html',
    styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {
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

    constructor(private route: ActivatedRoute, public weatherS: WeatherService) { }

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
    }

    setLocalVariables() {
        this.summary = this.weatherS.currently['summary'] || 'Error Retrieving Weather Info';
        this.icon = this.weatherS.currently['icon'] || '';
        this.temp = Math.round(this.weatherS.currently['temperature']) || 0;
        this.temp_low = Math.round(this.weatherS.daily['data'][0]['temperatureLow']) || 0;
        this.temp_high = Math.round(this.weatherS.daily['data'][0]['temperatureHigh']) || 0;
        this.apparent_temp = Math.round(this.weatherS.currently['apparentTemperature']) || 0;
        this.humidity = Math.round(this.weatherS.currently['humidity'] * 100) || 0;
        this.precip_probability = Math.round(this.weatherS.currently['precipProbability'] * 100) || 0;
        this.precip_type = this.weatherS.currently['precipType'] || 'precipitaion';
        this.pressure = Math.round(this.weatherS.currently['pressure']) || 0;
        this.wind_speed = Math.round(this.weatherS.currently['windSpeed']) || 0;
        this.uv_index = this.weatherS.currently['uvIndex'] || 0;
        this.ozone = Math.round(this.weatherS.currently['ozone']) || 0;
        this.startSkycons();
    }

    startSkycons() {
        let skycons = new Skycons({"color": "#D46A6A"});
        let icon = this.icon.toUpperCase().replace(/-/g, "_");
        skycons.add('icon', Skycons[icon]);
        skycons.play();
    }

    initiationSequence() {
         // check if we already have recent forecast data to avoid excessive api calls
         const check = {
            has_location: this.weatherS.hasLocation(),
            location_matches: false,
            within_ten_minutes: this.weatherS.withinTenMinutes(),
            has_currently: this.weatherS.hasCurrently()
         };

         if (check.has_location
         && check.location_matches
         && check.within_ten_minutes
         && check.has_currently) {
             console.log(this.weatherS.hasLocation(),
                 this.locationMatches(),
                 this.weatherS.hasCurrently(),
                 this.weatherS.withinTenMinutes()
             );
             this.setLocalVariables();
             console.log('We have recent weather data to use!');

        // check for correct location but no recent data
        } else if (check.has_location 
                && check.location_matches
                && check.within_ten_minutes == false) {
            console.log(this.weatherS.hasLocation(),
                this.locationMatches(),
                this.weatherS.hasCurrently(),
                this.weatherS.withinTenMinutes()
            );
            this.weatherS.apiForecast()
            .subscribe(
                o => {
                    console.log('darksky forecast api called from else if');
                    this.weatherS.parseForecast(o);
                    this.setLocalVariables();
                }
            );

        // call location search api, call weather forecast api, parse data, and setup local variables for DOM use
        } else {
            const city_region = `${this.city}, ${this.region_code}`;
            console.log(this.weatherS.hasLocation(),
                 this.locationMatches(),
                 this.weatherS.hasCurrently(),
                 this.weatherS.withinTenMinutes()
             );
            console.log(city_region);
            this.weatherS.apiGeoLocation(city_region).subscribe(
                res => {
                    this.weatherS.parseLocation(res);
                    this.weatherS.apiForecast()
                    .subscribe(
                        response => {
                            console.log('darksky forecast api called from else');
                            this.weatherS.parseForecast(response);
                            this.setLocalVariables();
                        }
                    );

                }
            );
        }
    }

    locationMatches() {
        // NEEEDS FIXXXX
        const location = this.weatherS.getLocation();
        console.log(location);
        console.log(this.city, this.region_code);
        return location.city == this.city
            && location.region_code == this.region_code;
    }

}
