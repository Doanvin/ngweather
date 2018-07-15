import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StoreService } from './store.service';
import { Location } from './models/location.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    location: any;
    latitude: number;
    longitude: number;
    city: string;
    region_code: string;
    currently: object;
    hourly: object;
    daily: object;
    time: Date;

    constructor(public store: StoreService, public http: HttpClient) {
        this.location = this.store.get('location') || '';
        this.latitude = this.location.latitude || 0;
        this.longitude = this.location.longitude || 0;
        this.city = this.location.city || '';
        this.region_code = this.location.region_code || '';
        this.time = new Date(this.store.get('time'));
        this.currently = this.store.get('currently') || {};
        this.hourly = this.store.get('hourly') || {};
        this.daily = this.store.get('daily') || {};
    }

    setLocation(location: Location) {
        this.location = location;
        this.store.set('location', location);
        console.log('location set successfully');
        return true;
    }

    getLocation() {
        return this.store.get('location');
    }

    // calls the ipstack api to get user location data
    apiIpSearch() {
        const url = 'http://api.ipstack.com/check?access_key=781d96fbe17ec4d760a7474492866543';
        console.log('ip search api called');
        this.http.get(url)
            .subscribe(
                o => {
                    let location: Location = {
                        city: o['city'] || '',
                        region_code: o['region_code'] || '',
                        latitude: o['latitude'] || 0,
                        longitude: o['longitude'] || 0
                    };

                    if (location.latitude === 0 || location.longitude === 0) {
                        console.error('error using auto geographic lookup');
                    } else {
                        this.setLocation(location);
                    }
                }
            );
    }

    // calls yahoo geo places api to get lat, long, 
    // updates service data, stores location and api call time data
    apiGeoLocation(text_location: string) {
        let location = text_location;
        let url = `https://query.yahooapis.com/v1/public/yql?q=select location.city,location.region,item.lat,item.long from weather.forecast where woeid in (select woeid from geo.places(1) where text="${location}")&format=json`;
        console.log('yahoo geoplaces api called');
        this.http.get(url)
            .subscribe(
                o => {
                    if (this.withinOneHour) {
                        console.log('WITHIN AN HOUR. RESULTS STILL VALID');
                    } else {
                        this.location.city = o['query']['results']['channel']['location']['city'];
                        this.location.region_code = o['query']['results']['channel']['location']['region'].toUpperCase();
                        this.location.latitude = o['query']['results']['channel']['item']['lat'];
                        this.location.longitude = o['query']['results']['channel']['item']['long'];
                        this.time = new Date(o['query']['created']);
                        this.store.set('location', this.location);
                        this.store.set('time', this.time);
                    }
                }
            );
    }

    // calls the darksky weather api, updates service data, saves api call time to localStorage
    apiForecast(exclude?: string, ) {
        let url = `http://localhost:8888/search?latitude=${this.latitude}&longitude=${this.longitude}`;
        return this.http.get(url);
    }

    parseForecast(o: object) {
        this.currently = o['currently'];
        this.hourly = o['hourly'];
        this.daily = o['daily'];
        this.time = o['currently']['time'];
        this.store.bulkSet([
            {currently: this.currently},
            {hourly: this.hourly},
            {daily: this.daily},
            {time: this.time}
        ]);
    }

    withinOneHour() {
        const one_hour = 60 * 60 * 1000;
        let now: any = new Date();
        now = now.getTime();
        const last_query_time: any = this.time.getTime()*1000;
        return (now - last_query_time) < one_hour;
    }

    hasLocation() {
        return this.latitude && this.longitude ? true : false;
    }

    hasCurrently() {
        return this.currently ? true : false;
    }

}                                                                                         
