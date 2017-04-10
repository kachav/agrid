import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    template: `<button class='a-grid__button'><ng-content></ng-content></button>`,
    selector: 'a-grid-button',
    styleUrls: ['./agridbutton.styles.css'],
    encapsulation: ViewEncapsulation.None
})

export class AGridButtonComponent {
}
