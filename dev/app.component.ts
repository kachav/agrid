import { Component, ViewEncapsulation } from '@angular/core';

import { homeTableState } from './app.table.state';

@Component({
    templateUrl: './app.template.html',
    selector: "app",
    providers: [
        homeTableState
    ]
})
export class AppComponent {
    constructor(private tableState: homeTableState) { }

    showFilters=true;

    showCol2=true;

    showMessage(message) {
        alert(JSON.stringify(message));
    }

}