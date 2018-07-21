import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { WeatherService } from '../weather.service';

import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
// global.d.ts
import * as d3 from "d3";



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
    this.daily = this.weatherS.daily['data'];
    console.log(this.daily);
    this.d3AreaChart(this.parseForD3LineChart());

    // set the daily weather variable on every route change
    this.router.events
    .subscribe(
      event => {
        if (event instanceof NavigationEnd && window.location.pathname !== '/') {
          this.daily = this.weatherS.daily['data'];
          console.log(this.daily);
          this.d3AreaChart(this.parseForD3LineChart());
        }
      }
    )
  }

  parseForD3LineChart() {
    let temperatures: {
      date: Date|number|string, 
      low_temp: number,
      high_temp: number 
    }[] = [];

    this.daily.forEach( (day, i, arr) => {
      const date: Date = new Date(day['time'] * 1000);
      const low_temp: number = Math.round(day['temperatureMin']);
      const high_temp: number = Math.round(day['temperatureMax']);
      console.log(date, low_temp, high_temp);
      temperatures.push({date, low_temp, high_temp});
    });
    console.log(temperatures);
    return temperatures;
  }

  d3AreaChart(data: object[]) {
    // set the size of the chart
    const margin = {top: 30, right: 40, bottom: 30, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // parse date from data
    const parseDate = d3.timeFormat('%b %e');

    // set scales [domain and range]
    let xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d['date']))
      .range([0, width]);

    let yScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => Math.min(d['low_temp'])),
      d3.max(data, d => Math.max(d['high_temp']))
    ]).range([height, 0]);

    // create axis'
    let xAxis = d3.axisBottom(xScale).ticks(8),
        yAxis = d3.axisLeft(yScale).ticks(6);

    // create svg
    let svg = d3.select('div.line-chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      // create chart group
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // create high and low temp lines
    let low_line = d3.line()
      .curve(d3.curveLinear)
      .x( d => xScale(d['date']))
      .y( d => yScale(d['low_temp']));

    let high_line = d3.line()
      .curve(d3.curveLinear)
      .x( d => xScale(d['date']))
      .y( d => yScale(d['high_temp']));

    // add groups [x-axis, y-axis, low_line, high_line]
    svg.datum(data);

    // x-axis
    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0, ' + height + ')')
      .style('text-anchor', 'middle')
      .call(xAxis);

    // y-axis
    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Temperature &deg;F');

    // low_temp line
    svg.append('path')
      .attr('class', 'line')
      .attr('d', low_line)
      .style('fill', 'none')
      .style('stroke', 'rgba(8, 97, 156, 0.6)')
      .style('stroke-width', '3px')
      .style('shape-rendering', 'optimzeSpeed');

    // high_temp line
    svg.append('path')
      .attr('class', 'line')
      .attr('d', high_line)
      .style('fill', 'none')
      .style('stroke', 'rgba(255, 86, 29, 0.6)')
      .style('stroke-width', '3px')
      .style('shape-rendering', 'optimzeSpeed');

    svg.selectAll("circle.low-temp")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d['date']))
      .attr("cy", d => yScale(d['low_temp']))
      .attr("r", 4);

    svg.selectAll("circle.high-temp")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d['date']))
      .attr("cy", d => yScale(d['high_temp']))
      .attr("r", 4);

    // low_temp labels
    svg.selectAll('text.low-temp')
      .data(data)    
      .enter()
      .append('text')
      .text( d => d['low_temp'] + ' °F')
      .attr("x", d => xScale(d['date']))
      .attr("y", d => yScale(d['low_temp']) - 10);

    // high_temp labels
    svg.selectAll('text.high-temp')
      .data(data)    
      .enter()
      .append('text')
      .text( d => d['high_temp'] + ' °F')
      .attr("x", d => xScale(d['date']))
      .attr("y", d => yScale(d['high_temp']) - 10);
  }

}
