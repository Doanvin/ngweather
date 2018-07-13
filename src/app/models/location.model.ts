export interface Location {
    city: string;
    region_code: string;
    country_code: string;
    zip: string;
    latitude: number;
    longitude: number;
    location_data: {
        "geoname_id": number,
        "capital":string,
        "languages":[
          {
            "code":string,
            "name":string,
            "native":string
          }
        ],
        "country_flag":string,
        "country_flag_emoji":string,
        "country_flag_emoji_unicode":string,
        "calling_code":string,
        "is_eu":boolean
    }

}