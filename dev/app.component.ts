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

    showFilters = true;

    showCol2 = true;

    showGroup1 = true;

    showGroup2 = true;

    showGroup3 = true;

    showHeader = true;

    showMessage(message) {
        alert(JSON.stringify(message));
    }

}