import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { WeatherCurrentComponent } from './weather-current/weather-current.component';
import { WeatherService } from './weather.service';
import { StoreService } from './store.service';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'search/current/:city/:region_code', component: WeatherCurrentComponent}
]

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
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [
    WeatherService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
