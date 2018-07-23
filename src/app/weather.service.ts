import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StoreService } from './store.service';
import { Location } from './models/location.model';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    location: any;
    currently: object;
    hourly: object;
    daily: object;
    time: Date;
    location_matches: boolean;

    constructor(public store: StoreService, 
                public http: HttpClient, 
                public router: Router) {
        this.location = this.store.get('location') || '';
        this.time = new Date(this.store.get('time'));
        this.currently = this.store.get('currently') || {};
        this.hourly = this.store.get('hourly') || {};
        this.daily = this.store.get('daily') || {};
        this.location_matches = false;
    }

    setLocation(location: Location) {
        this.location = location;
        this.store.set('location', location);
        console.log('location set successfully');
        return true;
    }

    getLocation() {
        return this.location || this.store.get('location');
    }

    setTime(time: Date) {
        this.time = time;
        this.store.set('time', time);
        return true;
    }

    getTime() {
        return this.time || new Date(this.store.get('time'));
    }

    getCurrently() {
        return this.currently || this.store.get('currently');
    }

    getHourly() {
        return this.hourly || this.store.get('hourly');
    }

    getDaily() {
        return this.daily || this.store.get('hourly');
    }

    // calls the ipstack api to get user location data
    apiIpSearch() {
        const url = `${environment.server_host}/api/ip`;
        console.log('ip search api called');
        return this.http.get(url);
    }

    parseIpLocation(o: object) {
        let location: Location = {
            city: o['city'] || '',
            region_code: o['region_code'] || '',
            latitude: o['latitude'] || 0,
            longitude: o['longitude'] || 0,
            time: new Date(o['created']) || new Date()
        };

        if (location.latitude === 0 || location.longitude === 0) {
            console.error('error using auto geographic lookup');
        } else {
            this.setLocation(location);
        }
    }

    // calls yahoo geo places api to get lat, long, 
    // updates service data, stores location and api call time data
    apiGeoLocation(text_location: string) {
        let url = `${environment.server_host}/api/location?q=${text_location}`;
        console.log('yahoo geoplaces api called');
        return this.http.get(url);
    }

    parseLocation(o: object) {
        const location: Location = {
            city: o['query']['results']['channel']['location']['city'],
            region_code: o['query']['results']['channel']['location']['region'].toUpperCase(),
            latitude: o['query']['results']['channel']['item']['lat'],
            longitude: o['query']['results']['channel']['item']['long'],
            time: new Date(o['query']['created'])
        };
        this.location_matches = this.location == location;
        this.setLocation(location);
        this.setTime(location.time);
    }

    // calls the darksky weather api, updates service data, saves api call time to localStorage
    apiForecast(exclude: string = 'minutely', units?: string) {
        let excluded,
            unit;
        exclude ? excluded = `&exclude=${exclude}` : excluded = '';
        units ? unit = `&units=${units}` : unit = '';
        let url = `${environment.server_host}/api/forecast?latitude=${this.location.latitude}&longitude=${this.location.longitude}${excluded}${unit}`;
        return this.http.get(url);
    }

    parseForecast(o: object) {
        this.currently = o['currently'];
        this.hourly = o['hourly'];
        this.daily = o['daily'];
        this.time = new Date(o['currently']['time'] * 1000);

        this.location['time'] = this.time;

        this.store.bulkSet([
            {location: this.location},
            {currently: this.currently},
            {hourly: this.hourly},
            {daily: this.daily},
            {time: this.time}
        ]);
    }

    withinTenMinutes() {
        const ten_minutes = 60 * 10 * 1000;
        let now: any = new Date();
        now = now.getTime();
        const last_query_time: any = this.getTime().getTime()*1000;
        return (now - last_query_time) < ten_minutes;
    }

    hasLocation() {
        return this.location.latitude && this.location.longitude ? true : false;
    }

    hasCurrently() {
        return this.currently['temperature'] ? true : false;
    }

}                                                                                         
