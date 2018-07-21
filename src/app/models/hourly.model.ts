export interface Hourly {
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
    }
}