# agrid

[![Greenkeeper badge](https://badges.greenkeeper.io/kachav/agrid.svg)](https://greenkeeper.io/)

[![travis build](https://img.shields.io/travis/kachav/agrid.svg?style=flat-square)](https://travis-ci.org/kachav/agrid)
[![codecov](https://img.shields.io/codecov/c/github/kachav/agrid.svg?style=flat-square)](https://codecov.io/gh/kachav/agrid)
[![version](https://img.shields.io/npm/v/agrid.svg?style=flat-square)](https://www.npmjs.com/package/agrid)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Installation
```shell
npm install --save agrid
```
Once installed you need to import our main module:
```js
import { AgridModule } from 'agrid';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [AgridModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage:

### Basic:

Bind the items you need to display to the [items] property of component and specify columns

    - colName - property name
    - colTitle - title of column (text in header)
    - resizable - column can be resized or not (true by default)
    - width - width of column in pixels

```html
    <a-grid [items]="tableState.items">
        <a-grid-column [resizable]="true" colName="name" colTitle="Name" [width]="240"></a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```

### Cell template

Specify template of column cell by setting it like this:


```html
    <a-grid [items]="tableState.items">
    	<a-grid-column [resizable]="false" [width]="40">
            <!-- pass the row to the cell template -->
			<input *aGridCell="let row" type="checkbox" [(ngModel)]="row.checked" />
		</a-grid-column>
        <a-grid-column [resizable]="false" [width]="40" colTitle="№">
            <!-- pass the rowIndex to the cell template -->
			<span *aGridCell="let index=rowIndex">{{index+1}}</span>
		</a-grid-column>
        <a-grid-column colName="name" colTitle="Name"></a-grid-column>
        <a-grid-column colName="surname" colTitle="Surname"></a-grid-column>
        <a-grid-column colTitle="Gender">
            <span *aGridCell="let row">{{row.gender?'male':'female'}}</span>
        </a-grid-column>
        <a-grid-column colTitle="delete item">
        <!-- pass the rowElement to the cell template (for adding specific class to entire row before deleting to highlight row) -->
			<div *aGridCell="let row; let tr=rowElement">
				<button (mouseenter)="tableState.deleteMouseOver(tr)" (mouseleave)="tableState.deleteMouseLeave(tr)" (click)="tableState.removeItem(row)">-</button>
			</div>
		</a-grid-column>
    </a-grid>
```
### Header template

Specify template of column header by setting it like this:

```html
    <a-grid [items]="tableState.items">
        <a-grid-column [resizable]="true" colName="name" [width]="240">
            <!-- pass the column to the header template -->
            <sortable-header *aGridHeader="let col;" (click)="tableState.sortBy('name')">Name {{col.width}}</sortable-header>
        </a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```
### Groupping

Specify template of row groups by setting it like this:

```html
    <a-grid [items]="tableState.items">
        <!-- 
            - set groupping fields (by tableState.groupFields), tableState.groupFields can be a string name of single field, and array of multiple fields names
            - optionally set initial collapsed groups (collapsed tableState.groupFields), tableState.groupFields can be a string name of single field, and array of multiple fields names
            - pass instance of group object (let group)
            - groupChild (instance of group childs array)
            - grLevel (groupping level)
            - groupCollapsed (state of group - collapsed/expanded)
            - group.toggleCollapse() (collapse/expand group) -->
        <div *aGridGroup="let group by tableState.groupFields collapsed tableState.groupFields; let groupChild=children;let grLevel=groupLevel;let groupCollapsed=collapsed;" [style.padding-left]="10+grLevel*20+'px'">
			<button (click)="group.toggleCollapse()">{{groupCollapsed?'+':'–'}}</button>
			{{group.value + ' ('+groupChild.length+') level:'+grLevel}}</div>

        <a-grid-column [resizable]="true" colName="name" colTitle="Name" [width]="240"></a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```

### Row detail

Specify the row detail template by setting it like this:

```html
    <a-grid [items]="tableState.items">
        <!-- 
            - row - current row
            - index - index of current row
            - expandedrows - bind array of rows (if current row isin this array - detail is expanded) -->
        <div *aGridDetail="let row; let index=rowIndex expandedrows tableState.expandedRows;">
			<input type="text" [(ngModel)]="tableState.editableRow.name" placeholder="Name" />
			<input type="text" [(ngModel)]="tableState.editableRow.surname" placeholder="Surname" />
			<button (click)="tableState.saveEditedRow(index)">save</button>
		</div>

        <a-grid-column [resizable]="false" [width]="40">
        <!-- tableState.toggleRow(row) - add row to expanded rows array -->
			<button *aGridCell="let row" (click)="tableState.toggleRow(row)">
				{{tableState.expandedRows.indexOf(row)===-1?'+':'–'}}
			</button>
		</a-grid-column>

        <a-grid-column [resizable]="true" colName="name" colTitle="Name" [width]="240"></a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```


### Events

```html

    <!-- 
        - onBodyScroll - body scroll event
        - onRowClick - row click event
        - onRowDoubleClick - row double click event
     -->

    <a-grid 
    (onBodyScroll)="tableState.bodyScroll($event)" 
    (onRowClick)="tableState.select($event)" 
    (onRowDoubleClick)="tableState.checkDblClick($event)" 
    [items]="tableState.items">
    	<a-grid-column [resizable]="false" [width]="40">
			<input *aGridCell="let row" type="checkbox" [(ngModel)]="row[tableState.checkedProperty]" />
		</a-grid-column>
        <a-grid-column [resizable]="true" colName="name" colTitle="Name" [width]="240"></a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```


### Properties

```html

    <!-- 
        - checkedProperty - name of field in item for setting checked state for it
        - onRowClick - name of field in item for setting selected state for it
        - showHeader - show header or not
     -->

    <a-grid 

    [checkedProperty] = "tableState.checkedProperty"
    [selectedProperty] = "tableState.selectedProperty"
    [showHeader]="true"

    (onBodyScroll)="tableState.bodyScroll($event)" 
    (onRowClick)="tableState.select($event)" 
    (onRowDoubleClick)="tableState.checkDblClick($event)" 
    [items]="tableState.items">
    	<a-grid-column [resizable]="false" [width]="40">
			<input *aGridCell="let row" type="checkbox" [(ngModel)]="row[tableState.checkedProperty]" />
		</a-grid-column>
        <a-grid-column [resizable]="true" colName="name" colTitle="Name" [width]="240"></a-grid-column>
        <a-grid-column [resizable]="false" colName="surname" colTitle="Surname"></a-grid-column>
    </a-grid>
```