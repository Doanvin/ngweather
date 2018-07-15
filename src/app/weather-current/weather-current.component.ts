import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-current',
  templateUrl: './weather-current.component.html',
  styleUrls: ['./weather-current.component.scss']
})
export class WeatherCurrentComponent implements OnInit {
  summary: string;
  icon: string;
  temp: number;
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
    this.weatherS.apiForecast();
    this.summary = this.weatherS.currently['summary'] || 'Error Retrieving Weather Info';
    this.icon = this.weatherS.currently['icon'] || '';
    this.temp = this.weatherS.currently['temperature'] || 0;
    this.apparent_temp = this.weatherS.currently['humidity'];
    this.precip_probability = this.weatherS.currently['precipProbability'] * 100 || 0;
    this.precip_type = this.weatherS.currently['precipType'] || '';
    this.pressure = this.weatherS.currently['pressure'] || 0;
    this.wind_speed = this.weatherS.currently['windSpeed'] || 0;
    this.uv_index = this.weatherS.currently['uvIndex'] || 0;
    this.ozone = this.weatherS.currently['ozone'] || 0;
  }


}
