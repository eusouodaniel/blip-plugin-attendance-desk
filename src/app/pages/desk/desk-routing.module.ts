import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeskComponent } from './desk.component';

const routes: Routes = [{ path: '', component: DeskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeskRoutingModule {}
