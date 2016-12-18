import {
  Component, 
  ElementRef
} from '@angular/core';

@Component({
  selector: `a-grid-bottom`,
  template: `<div class="a-grid__bottom-container"><ng-content></ng-content></div>`,
  styles: [`
  :host{
    display:block;
  }

  .a-grid__bottom-container{
    background-color: #fafafa;
    border-top: 1px solid #808080;
    border-bottom: 1px solid #808080;
  }
  `]
})
export class aGridBottom {
  constructor(public el: ElementRef) { }
}