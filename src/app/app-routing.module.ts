import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelFlowComponent } from './model-flow/model-flow.component';

const routes: Routes = [
  {
    path: '',
    component: ModelFlowComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
