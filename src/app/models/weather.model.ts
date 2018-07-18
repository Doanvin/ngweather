export interface Weather {
    [city: string]: {
        currently: {
            time: number,
            summary: string,
            icon: string,
            nearestStormDistance: number,
            nearestStormBearing: number,
            precipIntensity: number,
            precipProbability: number,
            temperature: number,
            apparentTemperature: number,
            dewPoint: number,
            humidity: number,
            pressure: number,
            windSpeed: number,
            windGust: number,
            windBearing: number,
            cloudCover: number,
            uvIndex: number,
            visibility: number,
            ozone: number
        },
        hourly: {
            summary: string,
            icon: string,
            data: [
              {
                time: number,
                summary: string,
                icon: string,
                precipIntensity: number,
                precipProbability: number,
                temperature: number,
                apparentTemperature: number,
                dewPoint: number,
                humidity: number,
                pressure: number,
                windSpeed: number,
                windGust: number,
                windBearing: number,
                cloudCover: number,
                uvIndex: number,
                visibility: number,
                ozone: number
              }
            ]
        },
        daily: {
            summary: string,
            icon: string,
            data: [
                {
                time: number,
                summary: string,
                icon: string,
                sunriseTime: number,
                sunsetTime: number,
                moonPhase: number,
                precipIntensity: number,
                precipIntensityMax: number,
                precipIntensityMaxTime: number,
                precipProbability: number,
                temperatureHigh: number,
                temperatureHighTime: number,
                temperatureLow: number,
                temperatureLowTime: number,
                apparentTemperatureHigh: number,
                apparentTemperatureHighTime: number,
                apparentTemperatureLow: number,
                apparentTemperatureLowTime: number,
                dewPoint: number,
                humidity: number,
                pressure: number,
                windSpeed: number,
                windGust: number,
                windGustTime: number,
                windBearing: number,
                cloudCover: number,
                uvIndex: number,
                uvIndexTime: number,
                visibility: number,
                ozone: number,
                temperatureMin: number,
                temperatureMinTime: number,
                temperatureMax: number,
                temperatureMaxTime: number,
                apparentTemperatureMin: number,
                apparentTemperatureMinTime: number,
                apparentTemperatureMax: number,
                apparentTemperatureMaxTime: number
                }
            ]
        }
    };
}