import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { WeatherService } from '../weather.service';

import { scaleLinear } from 'd3-scale';
import { select, style } from 'd3-selection';
// global.d.ts
import * as d3 from "d3";



//  d3.scaleTime d3.scaleLinear d3.line() d3.curveLinear d3.axisBottom d3.axisLeft d3.select
// d3.min d3.max d3.domain d3.range


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
		this.d3AreaChart(this.parseForD3LineChart());

		// set the daily weather variable on every route change
		this.router.events
			.subscribe(
				event => {
					if (event instanceof NavigationEnd && window.location.pathname !== '/') {
						this.daily = this.weatherS.daily['data'];
						this.d3AreaChart(this.parseForD3LineChart());
					}
				}
			)
	}

	parseForD3LineChart() {
		let temperatures: {
			date: Date | number | string,
			low_temp: number,
			high_temp: number
		}[] = [];

		this.daily.forEach((day, i, arr) => {
			const date: Date = new Date(day['time'] * 1000);
			const low_temp: number = Math.round(day['temperatureMin']);
			const high_temp: number = Math.round(day['temperatureMax']);
			temperatures.push({ date, low_temp, high_temp });
		});
		return temperatures;
	}

	d3AreaChart(data: object[]) {
		// sets the size of the chart responsively
		let clientWidth:number = document.documentElement.clientWidth || document.body.clientWidth;
		let margin, width, height;
		if (clientWidth < 321) {
			margin = { top: 6, right: 20, bottom: 20, left: 26 };
			width = 260 - margin.left - margin.right;
			height = 150 - margin.top - margin.bottom;

		} else if(clientWidth >= 321 && clientWidth < 574) {
			margin = { top: 6, right: 20, bottom: 20, left: 20 };
			width = 300 - margin.left - margin.right;
			height = 160 - margin.top - margin.bottom;

		} else if(clientWidth > 720 && clientWidth < 960) {
			margin = { top: 30, right: 20, bottom: 20, left: 20 };
			width = 660 - margin.left - margin.right;
			height = 333 - margin.top - margin.bottom;
		} else if (clientWidth > 960) {
			margin = { top: 30, right: 40, bottom: 30, left: 20 };
			width = 960 - margin.left - margin.right;
			height = 500 - margin.top - margin.bottom;
		}
		

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
			])
			.range([height, 0]);

		// create axes
		let xAxis, yAxis;
		if (clientWidth < 574) {
			xAxis = d3.axisBottom(xScale).ticks(4),
			yAxis = d3.axisLeft(yScale).ticks(6);
		} else {
			xAxis = d3.axisBottom(xScale).ticks(8),
			yAxis = d3.axisLeft(yScale).ticks(6);
		}

		// create svg
		let svg = d3.select('svg.line-chart--daily')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			// create chart group
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// create high and low temp lines
		let low_line = d3.line()
			.curve(d3.curveLinear)
			.x(d => xScale(d['date']))
			.y(d => yScale(d['low_temp']));

		let high_line = d3.line()
			.curve(d3.curveLinear)
			.x(d => xScale(d['date']))
			.y(d => yScale(d['high_temp']));

		// create area
		let area = d3.area()
			.x(d => xScale(d['date']))
			.y0(d => yScale(d['low_temp']))
			.y1(d => yScale(d['high_temp']));

		// add groups [x-axis, y-axis, low_line, high_line]
		svg.datum(data);

		// x-axis
		svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0, ${height})`)
			.style('text-anchor', 'middle')
			.call(xAxis);

		// y-axis
		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(yAxis);
		
			// HOW TO ADD LABEL TO AXIS
			// .select('.tick:last-of-type')
			// .append('text')
			// .attr('x', 160)
			// .attr('y', -25)
			// .style('fill', 'rgba(0, 0, 0, 0.9)')
			// .attr('dy', '.32em')
			// .text('Temperature Highs & Lows (°F)')

		// low_temp line
		svg.append('path')
			.attr('class', 'line')
			.attr('d', low_line)
			.style('fill', 'none')
			.style('stroke', 'rgba(8, 97, 156, 0.8)')
			.style('stroke-width', '3px')
			.style('shape-rendering', 'optimzeSpeed');

		// high_temp line
		svg.append('path')
			.attr('class', 'line')
			.attr('d', high_line)
			.style('fill', 'none')
			.style('stroke', 'rgba(255, 86, 29, 0.8)')
			.style('stroke-width', '3px')
			.style('shape-rendering', 'optimzeSpeed');

		svg.append('path')
			.attr('class', 'area')
			.attr('d', area)
			.style('fill', 'url(#gradient2)');

		svg.selectAll("circle.low-temp")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", d => xScale(d['date']))
			.attr("cy", d => yScale(d['low_temp']))
			.attr("r", 4)
			.style('fill', 'rgba(0, 0, 0, 0.7)');

		svg.selectAll("circle.high-temp")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", d => xScale(d['date']))
			.attr("cy", d => yScale(d['high_temp']))
			.attr("r", 4)
			.style('fill', 'rgba(0, 0, 0, 0.7)');

		if (clientWidth > 574) {
			// low_temp labels
			svg.selectAll('text.low-temp')
				.data(data)
				.enter()
				.append('text')
				.text(d => d['low_temp'] + ' °F')
				.attr("x", d => xScale(d['date']))
				.attr("y", d => yScale(d['low_temp']) - 10)
				.attr('title', d => `${parseDate(d['date'])}, ${d['low_temp']}`);

			// high_temp labels
			svg.selectAll('text.high-temp')
				.data(data)
				.enter()
				.append('text')
				.text(d => d['high_temp'] + ' °F')
				.attr("x", d => xScale(d['date']))
				.attr("y", d => yScale(d['high_temp']) - 10)
				.attr('title', d => `${parseDate(d['date'])}, ${d['high_temp']}`);
		}
	}

}
