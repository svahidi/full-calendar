import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalenderViewComponent } from './calender-view/calender-view.component';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ClickOutSideOfCalendarTimeDirective } from './Directives/click-out-side-of-calendar-time.directive';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [
    CalenderViewComponent,
    ClickOutSideOfCalendarTimeDirective
  ],
  exports: [
    CalenderViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CalenderModule { }
