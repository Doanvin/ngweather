import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WeatherService } from '../weather.service';

import * as d3 from "d3";

@Component({
    selector: 'app-weather-hourly',
    templateUrl: './weather-hourly.component.html',
    styleUrls: ['./weather-hourly.component.scss']
})
export class WeatherHourlyComponent implements OnInit {
    private hourly: object[];
    private temperatureData: Object[];
    private lessThanMd: boolean;

    constructor(private router: Router, private weatherS: WeatherService) { }

    ngOnInit() {

        let client_width = document.documentElement.clientWidth || document.body.clientWidth;
        this.hourly = this.weatherS.hourly['data'];
        this.lessThanMd = client_width <= 767;
        this.temperatureData = this.parseForD3LineChart();
        this.d3LineChart(this.temperatureData);

        // set the hourly weather variable on every route change
        this.router.events
            .subscribe(
                event => {
                    if (event instanceof NavigationEnd && window.location.pathname !== '/') {
                        this.hourly = this.weatherS.hourly['data'];
                        this.temperatureData = this.parseForD3LineChart();
                        this.d3LineChart(this.temperatureData);
                    }
                }
            )
    }

    parseForD3LineChart() {
        // create our data model for the chart
        let temperatures: {
            time: Date | number | string,
            temp: number
        }[] = [];

        this.hourly.forEach(hour => {
            let time = hour['time'] * 1000;
            let temp = Math.round(hour['temperature']);
            temperatures.push({ time, temp });
        })

        return temperatures;
    }

    d3LineChart(data: object[]) {
        // set chart sizes
		let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
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
			margin = { top: 30, right: 40, bottom: 20, left: 40 };
			width = 660 - margin.left - margin.right;
			height = 333 - margin.top - margin.bottom;
		} else if (clientWidth > 960 && clientWidth < 1200) {
			margin = { top: 30, right: 40, bottom: 30, left: 26 };
			width = 900 - margin.left - margin.right;
			height = 470 - margin.top - margin.bottom;
        } else if (clientWidth > 1200) {
            margin = { top: 30, right: 40, bottom: 30, left: 26 };
			width = 960 - margin.left - margin.right;
			height = 500 - margin.top - margin.bottom;
        }
        
        // parse date from data
		const parseDate = d3.timeFormat('%I %p');

        // set scales [domain and range]
        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d['time']))
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d['temp']))
            .range([height, 0]);

        // create axes
        let xAxis, yAxis;
        if (clientWidth < 574) {
            xAxis = d3.axisBottom(xScale). ticks(4)
            .tickSizeInner(-height)
            .tickSizeOuter(6)
            .tickPadding(10);
            yAxis = d3.axisLeft(yScale).ticks(6)
            .tickSizeInner(-width)
            .tickSizeOuter(6)
            .tickPadding(10);
        } else {
            xAxis = d3.axisBottom(xScale)
            .tickSizeInner(-height)
            .tickSizeOuter(6)
            .tickPadding(10);
            yAxis = d3.axisLeft(yScale).ticks(6)
            .tickSizeInner(-width)
            .tickSizeOuter(6)
            .tickPadding(10);
        }


        // create svg
        let svg = d3.select('svg.line-chart--hourly')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // create chart group
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // create temp line
        let line = d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(d['time']))
            .y(d => yScale(d['temp']));

        // add groups [x-axis, y-axis, line]
        svg.datum(data);

        // x-axis
        svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${height})`)
            .style('text-anchor', 'middle')
            .call(xAxis)
            ;

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

        // temperature line
        svg.append('path')
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', 'url(#gradient1)')
            .style('stroke-width', '3px')
            .style('shape-rendering', 'optimzeSpeed');

        // temperature coordinate circles
        if (clientWidth < 574) {
            svg.selectAll("circle.weather-hourly-chart.temp")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d['time']))
                .attr("cy", d => yScale(d['temp']))
                .attr("r", 2)
                .style('fill', 'rgba(0, 0, 0, 0.7)');

        } else {
            svg.selectAll("circle.weather-hourly-chart.temp")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d['time']))
                .attr("cy", d => yScale(d['temp']))
                .attr("r", 3)
                .style('fill', 'rgba(0, 0, 0, 0.8)');
        }
        
        // style hacks to override d3/angular inline styles
        // THERE'S GOTTA BE A BETTER WAY!!!
        const tickElements = document.querySelectorAll('g.axis g.tick line');
        // convert nodelist to array
        let ticks = [];
        for(let i = tickElements.length; i--; ticks.unshift(tickElements[i]));
        // apply styles to each tick
        ticks.forEach( tick => {
            tick['style']['stroke'] = 'rgba(0, 0, 0, 0.15)';
        });
    }

}
