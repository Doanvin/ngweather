import { Currently } from './currently.model';
import { Hourly } from './hourly.model';
import { Daily } from './daily.model';

export interface Weather {
    [city: string]: {
        currently: Currently,
        hourly: Hourly,
        daily: Daily
    };
}