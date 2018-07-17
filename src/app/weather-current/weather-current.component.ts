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
        // check if we already have recent forecast data to avoid excessive api calls
        if (this.weatherS.withinOneHour()
            && this.weatherS.hasLocation()
            && this.weatherS.hasCurrently()) {
                this.setLocalVariables();
                console.log('We have recent weather data to use!');
        } else {
            // call weather forecast api, parse data, and setup local variables for DOM use
            console.log(`Within One Hour: ${this.weatherS.withinOneHour()}\
            Has Location: ${this.weatherS.hasLocation()}\
            Has Currently: ${this.weatherS.hasCurrently()}`
            );
            this.weatherS.apiForecast()
            .subscribe(
                o => {
                    console.log('darksky forecast api called');
                    
                    this.weatherS.parseForecast(o);
                    this.setLocalVariables();
                }
            );
        } 
    }

    setLocalVariables() {
        this.summary = this.weatherS.currently['summary'] || 'Error Retrieving Weather Info';
        this.icon = this.weatherS.currently['icon'] || '';
        this.temp = Math.round(this.weatherS.currently['temperature']) || 0;
        this.temp_low = Math.round(this.weatherS.daily['data'][0]['temperatureLow']) || 0;
        this.temp_high = Math.round(this.weatherS.daily['data'][0]['temperatureHigh']) || 0;
        this.apparent_temp = Math.round(this.weatherS.currently['apparentTemperature']) || 0;
        this.humidity = this.weatherS.currently['humidity'] * 100 || 0;
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


}
