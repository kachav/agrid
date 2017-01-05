import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class homeTableState {

    private _items: BehaviorSubject<Array<any>>;
    get items$() {
        return this._items.asObservable();
    }
    get items() {
        return this._items.getValue();
    }

    private _selectedIndex: BehaviorSubject<number>;
    get selectedIndex$() {
        return this._selectedIndex.asObservable();
    }
    get selectedIndex() {
        return this._selectedIndex.getValue();
    }


    get checked$() {
        return this._items.map(items => items.filter(item => item[this.checkedProperty]));
    }
    get checked() {
        return this._items.getValue().filter(item => item[this.checkedProperty]);
    }

    modifyDays(index: number, value: number) {
        let items = this._items.getValue();

        if (items[index]) {
            items[index].eee = items[index].eee + value;
            this._items.next([...items]);
        }
    }

    addDay(index: number) {
        this.modifyDays(index, 1);
    }

    removeDay(index: number) {
        this.modifyDays(index, -1);
    }

    public aaaFilter: string;

    public dddFilter: string;

    public selectedProperty: string;
    public checkedProperty: string;
    constructor() {
        this._items = new BehaviorSubject<Array<any>>([]);
        this._selectedIndex = new BehaviorSubject<number>(-1);

        this.selectedProperty = "aGridSelected";
        this.checkedProperty = "aGridChecked";

        this.load();

        this.aaaFilter = "";
        this.dddFilter = "";
    }

    count = 10;

    addItem() {
        let arr = [...this._items.getValue()];
        arr.push({ _ouid: this.count, aaa: `aaa-value ${this.count}`, sss: `sss-value ${this.count}`, ddd: `ddd-value ${this.count}`, eee: 1 });
        this.count++;

        this._items.next(arr);
    }

    load() {
        let arr = [];
        for (let i = 1; i < this.count; i++) {
            arr.push({ _ouid: i, aaa: `aaa-value ${i}`, sss: `sss-value ${i}`, ddd: `ddd-value ${i}`, eee: 1 });
        }

        this._items.next(arr);
    }
    select(row) {
        let _itemsArray = this._items.getValue(), _index = this._selectedIndex.getValue();
        //set current row selected property to true
        if (_index>-1) {
            _itemsArray[_index][this.selectedProperty] = false;
        }

        _index=_itemsArray.indexOf(row);

        row[this.selectedProperty] = true;
        //set current selected index
        this._selectedIndex.next(_index);
        //save changed collection
        this._items.next([..._itemsArray]);

    }
    checkDblClick(row) {
        let _itemsArray = this._items.getValue();
        row[this.checkedProperty] = !row[this.checkedProperty];

        this._items.next([..._itemsArray]);

    }
    refresh() {

    }

}