import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { WeatherService } from '../weather.service';

import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
// global.d.ts
import * as _d3 from "d3";

declare global {
  const d3: typeof _d3;
}

@Component({
  selector: 'app-weather-daily',
  templateUrl: './weather-daily.component.html',
  styleUrls: ['./weather-daily.component.scss']
})
export class WeatherDailyComponent implements OnInit {
  private daily: object[];

  constructor(private weatherS: WeatherService,
              private router: Router) { }

  ngOnInit() {
    // set the daily weather variable on every route change
    this.router.events
    .subscribe(
      event => {
        if (event instanceof NavigationEnd && window.location.pathname !== '/') {
          this.daily = this.weatherS.daily['data'];
        }
      }
    )
  }

  parseForD3LineChart() {
    let high_temps: {time: Date|number|string, temp: number},
        low_temps: {time: Date|number|string, temp: number};

    this.daily.forEach( (day, i, arr) => {
      const low: number = day[i].temperatureMin;
      const high: number = day[i].temperatureMax;
      const time: Date = new Date(day[i].time * 1000);
      high_temps = {time, temp: high};
      low_temps = {time, temp: low};
    });
    return [low_temps, high_temps];
  }

  d3AreaChart(data: object[]) {
    // set the size of the chart
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // parse date from data
    const parseDate = d3.timeFormat('%b %e');

    // set scales
    let xScale = d3.scaleTime()
      .range([0, width]);

    let yScale = d3.scaleLinear()
      .range([height, 0]);

    // create axis'
    let xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);

    // create line
    let svg = d3.select('div.line-chart').append('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    let chartGroup = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
      

    // construct the line using points from the data
    data.forEach( obj => {
      let line = d3.line()
      .x( d => d['time'])
      .y( d => d['temp']);
    })


    

    
  }

}
