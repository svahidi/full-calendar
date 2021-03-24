import {Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef} from '@angular/core';
// import {ApiService} from '../../../../../public/core/services/api/api.service';

@Component({
  selector: 'calender-view',
  templateUrl: './calender-view.component.html',
  styleUrls: ['./calender-view.component.scss']
})
export class CalenderViewComponent implements OnChanges, OnInit {

  // Date

  days: any = [];
  today: any;
  month = [
    {text: 'January', value: 1},
    {text: 'February', value: 2},
    {text: 'March', value: 3},
    {text: 'April', value: 4},
    {text: 'May', value: 5},
    {text: 'June', value: 6},
    {text: 'July', value: 7},
    {text: 'August', value: 8},
    {text: 'September', value: 9},
    {text: 'October', value: 10},
    {text: 'November', value: 11},
    {text: 'December', value: 12}];
  lastDay: any;
  firstDay: any;
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekdaysObj = [
    {fullName: 'Sunday', shortName: 'Su'},
    {fullName: 'Monday', shortName: 'Mo'},
    {fullName: 'Tuesday', shortName: 'Tu'},
    {fullName: 'Wednesday', shortName: 'We'},
    {fullName: 'Thursday', shortName: 'Th'},
    {fullName: 'Friday', shortName: 'Fr'},
    {fullName: 'Saturday', shortName: 'Sa'}];
  currentDetail = {month: 2, day: 2, year: 2};
  showCalendarContent = false;
  showYearList = false;
  showMonthList = false;
  yearsList = [];

  @Input() pickerType: 'calendar' | 'calendarInline' | 'calendarBasic' | 'timeInline' | 'timeBasic' | 'calendarTimeBasic' | 'calendarTimeInline' = 'calendarInline';

  @Input() showHeader = true;
  @Input() showSelectedDate = true;
  @Input() showHeaderAction = true;
  @Input() selectedDateData: any;

  @ContentChild('contentTemplate') contentTemplate: TemplateRef<any>;

  @Output() selectedDate = new EventEmitter();

  // Time

  counter = 0;
  timeSelected = '';
  hourSelected = 0;
  minuteSelected = 0;
  hourList = [];
  minuteList = [];
  cloneSelectedTime = '';
  showTimeContent = false;

  @Input() time = '20:20';
  @Input() label = 'Time';
  @Input() format = '24';
  @Input() required = false;
  @Input() toggleButtonRight = true;
  @Input() hideRequiredMarker = false;
  @Output() selectedTime = new EventEmitter();

  constructor(
    // private api: ApiService
  ) { }

  ngOnChanges(changes): void {
    if (changes && changes.pickerType) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    if (this.pickerType === 'calendar' || this.pickerType === 'calendarInline' ||
      this.pickerType === 'calendarBasic' || this.pickerType === 'calendarTimeBasic' || this.pickerType === 'calendarTimeInline') {
      this.getCurrentDetail();
      this.completeYearList();
    }
    if (this.pickerType === 'timeInline' || this.pickerType === 'timeBasic' ||
      this.pickerType === 'calendarTimeBasic' || this.pickerType === 'calendarTimeInline') {
      this.cloneSelectedTime = JSON.parse(JSON.stringify(this.time));
      this.calcHourMinute();
      this.setTime(this.hourSelected, this.hourList, 24);
      this.setTime(this.minuteSelected, this.minuteList, 60);
    }
  }

  // Initiate calendar

  getCurrentDetail(): void {
    const date = new Date();
    const todayAmount = date.toLocaleDateString().split('/');
    this.today = {month: Number(todayAmount[0]), day: Number(todayAmount[1]), year: Number(todayAmount[2])};
    this.currentDetail = this.selectedDateData && this.selectedDateData.year && this.selectedDateData.day && this.selectedDateData.month ?
      JSON.parse(JSON.stringify(this.selectedDateData)) :
      { month: Number(this.today.month), day: Number(this.today.day), year: Number(date.getFullYear())};
    this.selectedDateData = JSON.parse(JSON.stringify(this.currentDetail));
    this.computeFirstAndLast(true);
    this.completeDaysArray();
  }

  computeFirstAndLast(current): void {
    this.firstDay =
      this.weekdaysObj[new Date(current ? this.today.year : this.currentDetail.year,
        current ? this.today.month : this.currentDetail.month, 1).getDay()].fullName;
    this.lastDay =
      this.weekdaysObj[new Date(current ? this.today.year : this.currentDetail.year,
        current ? this.today.month : this.currentDetail.month + 1, 0).getDay()].fullName;
  }

  completeDaysArray(current?): void {
    this.days = [];
    const first: any =
      this.weekdaysObj[new Date(current ? this.today.year : this.currentDetail.year, (current ? this.today.month : this.currentDetail.month) - 1, 1).getDay()].fullName;
    if (first !== 'Sunday') {
      for (let i = 0; i < this.weekdaysObj.findIndex(x => x.fullName === first); i++) {
        this.days.push({
          disabled: true,
          index: i - this.weekdaysObj.findIndex(x => x.fullName === first),
          day: this.weekdaysObj[i].fullName
        });
      }}
    for (let i = 1; i <= Number(new Date(current ? this.today.year : this.currentDetail.year, current ? this.today.month : this.currentDetail.month, 0).getDate()); i++) {
      this.days.push({
        index: i,
        day: this.weekdaysObj[new Date(current ? this.today.year : this.currentDetail.year, (current ? this.today.month : this.currentDetail.month) - 1, i).getDay()].fullName
      });
    }
  }

  completeYearList(): void {
    this.yearsList = [];
    for (let i = this.today.year - 10; i < this.today.year + 10; i++) {
      this.yearsList.push(i);
    }
  }

  // Main function

  nextMonth(): void {
    if (this.showYearList) {
      const lastItem = this.yearsList[this.yearsList.length - 1];
      this.yearsList = [];
      for (let i = lastItem + 1; i < lastItem + 21; i++) {
        this.yearsList.push(i);
      }
      return;
    }
    if (this.currentDetail.month === 12) {
      this.currentDetail = {month: 1, day: this.currentDetail.day, year: this.currentDetail.year + 1};
    } else {
      this.currentDetail = {month: this.currentDetail.month + 1, day: this.currentDetail.day, year: this.currentDetail.year};
    }
    this.calculateDaysOfSelectedYearMonth();
  }

  previousMonth(): void {
    if (this.showYearList) {
      const firstItem = this.yearsList[0];
      this.yearsList = [];
      for (let i = firstItem - 20; i < firstItem; i++) {
        this.yearsList.push(i);
      }
      return;
    }
    if (this.currentDetail.month === 1) {
      this.currentDetail = {month: 12, day: this.currentDetail.day, year: this.currentDetail.year - 1};
    } else {
      this.currentDetail = {month: this.currentDetail.month - 1, day: this.currentDetail.day, year: this.currentDetail.year};
    }
    this.calculateDaysOfSelectedYearMonth();
  }

  selectDate(day): void {
    if (!day.disabled) {
      this.currentDetail.day = day.index;
      this.emitSelectedDate();
    }
  }

  calculateDaysOfSelectedYearMonth(): void {
    this.computeFirstAndLast(false);
    this.completeDaysArray();
  }

  // Calendar type

  getDayName(): string {
    return this.weekdaysObj[new Date(this.selectedDateData.year, this.selectedDateData.month, this.selectedDateData.day).getDay()].fullName;
  }

  changeYear(event): void {
    if (event.toString().length !== 4) {
      return;
    }
    this.currentDetail.year = Number(event);
    this.calculateDaysOfSelectedYearMonth();
  }

  changeMonth(event): void {
    this.currentDetail.month = event;
    this.calculateDaysOfSelectedYearMonth();
  }

  goToToday(): void {
    this.currentDetail.year = this.today.year;
    this.currentDetail.month = this.today.month;
    this.computeFirstAndLast(true);
    this.completeDaysArray(true);
  }

  // CalendarBasic type

  selectYear(year): void {
    this.currentDetail.year = year;
    this.showMonthList = false;
    this.showYearList = false;
    this.emitSelectedDate();
    this.calculateDaysOfSelectedYearMonth();
  }

  selectMonth(month): void {
    this.currentDetail.month = month.value;
    this.showMonthList = false;
    this.showYearList = false;
    this.emitSelectedDate();
    this.calculateDaysOfSelectedYearMonth();
  }

  openCalendar(): void {
    this.calculateDaysOfSelectedYearMonth();
    this.showCalendarContent = true;
  }

  closeCalendar(): void {
    this.showCalendarContent = false;
    this.showMonthList = false;
    this.showYearList = false;
    this.showTimeContent = false;
  }

  // Emit data

  emitSelectedDate(): void {
    this.selectedDateData = JSON.parse(JSON.stringify(this.currentDetail));
    this.selectedDate.emit(this.selectedDateData);
  }

  // Time

  calcHourMinute(): void {
    this.hourSelected = Number(this.time.substr(0, 2));
    this.minuteSelected = Number(this.time.substr(3, 2));
  }

  keyUp(event): void {
    const excludedKeys = [8, 37, 39, 46, 32];
    if (this.time.length === 2 && this.time > '23') {
      this.time = '00';
    }
    if (!excludedKeys.includes(event.keyCode) && !this.time.includes(':') && this.time.length === 2) {
      this.time += ':';
    }
  }

  keyDown(event): void {
    const re = /[:0-9]/g;
    const excludedKeys = [8, 37, 39, 46, 32];
    if ((!excludedKeys.includes(event.keyCode) && !re.test(event.key)) ||
      (!excludedKeys.includes(event.keyCode) && this.time.length >= 5) ||
      (this.time.length === 0 && event.key === ':') ||
      (event.key === ':' && this.time.includes(':')) ||
      (!excludedKeys.includes(event.keyCode) && event.key > '5' && this.time.length === 3)) {
      event.preventDefault();
    }
    if (this.time.length === 1 && event.key === ':') {
      this.time = '0' + this.time;
    }
  }

  calcTime(time): string {
    return time < 10 ? '0' + Math.abs(time).toString() : Math.abs(time).toString();
  }

  selectTime(): void {
    this.timeSelected = this.calcTime(this.hourSelected) + ':' + this.calcTime(this.minuteSelected);
    this.time = this.timeSelected;
  }

  openTime(): void {
    this.showTimeContent = true;
    this.calcHourMinute();
    this.setTime(this.hourSelected, this.hourList, 24);
    this.setTime(this.minuteSelected, this.minuteList, 60);
  }

  setTime(num, list, limit): void {
    for (let ind = 0, i = num; i < num + 7; i ++, ind ++) {
      list[ind] = {value: i % limit, text: this.calcTime(i % limit)};
    }
  }

  findCurrentTime(): void {
    const a = new Date();
    const h = this.calcTime(a.getHours());
    const m = this.calcTime(a.getMinutes());
    this.time = h + ':' + m;
    this.cloneSelectedTime = JSON.parse(JSON.stringify(this.time));
    this.hourSelected = Number(this.cloneSelectedTime.split(':')[0]);
    this.minuteSelected = Number(this.cloneSelectedTime.split(':')[1]);
    this.emitSelectedTime();
  }

  cancel(): void {
    this.time = this.cloneSelectedTime;
    this.hourSelected = Number(this.cloneSelectedTime.split(':')[0]);
    this.minuteSelected = Number(this.cloneSelectedTime.split(':')[1]);
    this.emitSelectedTime();
  }

  scrollNum(state, time): void {
    state.stopPropagation();
    this.counter ++;
    if (this.counter % 10 === 0) {
      if (state.deltaY > 0) {
        time === 'hour' ? this.hourList.map(x => x.value = (x.value + 1) % 24) : this.minuteList.map(x => x.value = (x.value + 1) % 60);
      } else {
        time === 'hour' ? this.hourList.map(x => x.value = x.value - 1 < 0 ? 24 - (Math.abs(x.value - 1) % 24) : (x.value - 1) % 24) :
          this.minuteList.map(x => x.value = x.value - 1 < 0 ? 60 - (Math.abs(x.value - 1) % 60) : (x.value - 1) % 60);
      }
    }
  }

  emitSelectedTime(): void {
    this.selectedTime.emit(this.time);
    this.showTimeContent = false;
  }
}
