import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StoreService } from './store.service';
import { Location } from '../models/location.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private locationSource = new BehaviorSubject<Location>(this.store.get('location') || '');
    currentLocation = this.locationSource.asObservable();
    location: Location;
    private currentlySource = new BehaviorSubject<object>(this.store.get('currently') || {});
    currently$ = this.currentlySource.asObservable();
    private hourlySource = new BehaviorSubject<object[]>(this.store.get('hourly') || {});
    hourly$ = this.hourlySource.asObservable();
    private dailySource = new BehaviorSubject<object[]>(this.store.get('daily') || {});
    daily$ = this.dailySource.asObservable();
    private timeSource = new BehaviorSubject<Date>(this.store.get('time') || {});
    location_matches: boolean;

    constructor(public store: StoreService,
        public http: HttpClient,
        public router: Router) {
        this.currentLocation.subscribe(location => this.location = location);
        this.location_matches = false;
    }

    // calls the ipstack api to get user location data
    apiIp() {
        const url = `${environment.server_host}/api/ip`;
        console.log('ip search api called');
        return this.http.get(url);
    }

    parseIp(o: object) {
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
            this.locationSource.next(location);
            this.store.set('location', location);
        }
    }

    // calls yahoo geo places api to get lat, long, 
    // updates service data, stores location and api call time data
    apiLocation(text_location: string) {
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
        this.location_matches = this.location === location;
        this.locationSource.next(location);
        this.timeSource.next(location.time);
        this.store.bulkSet([
            { location: location },
            { time: location.time }
        ]);
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
        this.currentlySource.next(o['currently']);
        this.hourlySource.next(o['hourly']['data']);
        this.dailySource.next(o['daily']['data']);
        this.timeSource.next(new Date(o['currently']['time'] * 1000));

        let location = this.location;
        location.time = new Date(o['currently']['time'] * 1000);
        this.locationSource.next(location)
        this.timeSource.next(location['time']);

        this.store.bulkSet([
            { location: location },
            { currently: o['currently'] },
            { hourly: o['hourly']['data'] },
            { daily: o['daily']['data'] },
            { time: new Date(o['currently']['time'] * 1000) }
        ]);
    }

}                                                                                         
