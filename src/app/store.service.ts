import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor() { }

    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    bulkSet(objs: object[]) {
        objs.forEach(
            obj => {
                this.set(Object.keys(obj)[0], Object.values(obj)[0]);
            })
    }

    get(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }
}
