import { Component, ViewEncapsulation } from '@angular/core';

import { HomeTableState } from './app.table.state';

@Component({
    templateUrl: './app.template.html',
    selector: 'app',
    providers: [
        HomeTableState
    ]
})
export class AppComponent {
        public showFilters = true;

    public showCol2 = true;

    public showGroup1 = true;

    public showGroup2 = true;

    public showGroup3 = true;

    public showHeader = true;

    constructor(private tableState: HomeTableState) { }

    public showMessage(message) {
        alert(JSON.stringify(message));
    }

}
