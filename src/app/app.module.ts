import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { WeatherCurrentComponent } from './weather-current/weather-current.component';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { StoreService } from './store.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    LocationSearchComponent,
    WeatherCurrentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    WeatherService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
