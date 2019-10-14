import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppComponent } from './app.component';
import { BallComponent } from './ball/ball.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, DeviceDetectorModule.forRoot() ],
  declarations: [ AppComponent, BallComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
