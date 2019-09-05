import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelFlowComponent } from './model-flow/model-flow.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EdgeDirective } from './model-flow/edge.directive';

@NgModule({
  declarations: [
    AppComponent,
    ModelFlowComponent,
    EdgeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
