import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[ClickOutSideOfCalendarTime]'
})
export class ClickOutSideOfCalendarTimeDirective {

  constructor(
    private _elementRef: ElementRef
  ) {}

  @Input() elementName: any;
  @Input() elementData: any;

  @Output() public ClickOutSideOfCalendarTime = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(
      targetElement
    );
    if (!clickedInside) {
      this.ClickOutSideOfCalendarTime.emit({
        element: this.elementName,
        data: this.elementData,
      });
    }
  }

}
