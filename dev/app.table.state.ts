import { Injectable, EventEmitter, Renderer } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HomeTableState {

    public aaaFilter: string;

    public dddFilter: string;

    public selectedProperty: string;

    public checkedProperty: string;

    public expandedRows = [];

    public groupFields = ['aaa', 'sss', 'ddd'];

    public editableRow = null;

    private _items: BehaviorSubject<any[]>;

    private _selectedIndex: BehaviorSubject<number>;

    public get showGroup1() {
        return this._showGroup1;
    }

    public set showGroup1(val) {
        this._showGroup1 = val;
        this.updateGroups();
    }

    public get showGroup2() {
        return this._showGroup2;
    }

    public set showGroup2(val) {
        this._showGroup2 = val;
        this.updateGroups();
    }

    public get showGroup3() {
        return this._showGroup3;
    }

    public set showGroup3(val) {
        this._showGroup3 = val;
        this.updateGroups();
    }

    private _showGroup1 = true;

    private _showGroup2 = true;

    private _showGroup3 = true;

    private count = 0;

    constructor(private renderer: Renderer) {
        this._items = new BehaviorSubject<any[]>([]);
        this._selectedIndex = new BehaviorSubject<number>(-1);

        this.selectedProperty = 'aGridSelected';
        this.checkedProperty = 'aGridChecked';

        this.load();

        this.aaaFilter = '';
        this.dddFilter = '';
    }

    get items$() {
        return this._items.asObservable();
    }
    get items() {
        return this._items.getValue();
    }

    get selectedIndex$() {
        return this._selectedIndex.asObservable();
    }
    get selectedIndex() {
        return this._selectedIndex.getValue();
    }

    get checked$() {
        return this._items.map((items) => items.filter((item) => item[this.checkedProperty]));
    }
    get checked() {
        return this._items.getValue().filter((item) => item[this.checkedProperty]);
    }

    public updateGroups() {
        let groups = [];
        if (this._showGroup1) {
            groups.push('aaa');
        }
        if (this._showGroup2) {
            groups.push('sss');
        }
        if (this._showGroup3) {
            groups.push('ddd');
        }
        this.groupFields = groups;
    }

    public modifyDays(index: number, value: number) {
        let items = this._items.getValue();

        if (items[index]) {
            items[index].eee = items[index].eee + value;
            this._items.next([...items]);
        }
    }

    public toggleRow(row) {
        if (this.expandedRows.indexOf(row) === -1) {
            this.expandedRows = [row];
            this.editableRow = { ...row };
        } else {
            this.expandedRows = [];
            this.editableRow = null;
        }
    }

    public saveEditedRow(index: number) {
        let leftPart = [];
        let rightPart = [];
        let items = this._items.getValue();

        if (index > 0) {
            leftPart = items.slice(0, index);
        }

        if (index < items.length - 1) {
            rightPart = items.slice(index + 1);
        }

        this._items.next([...leftPart, this.editableRow, ...rightPart]);
    }

    public addDay(index: number) {
        this.modifyDays(index, 1);
    }

    public removeDay(index: number) {
        this.modifyDays(index, -1);
    }

    public removeItem(row) {
        console.log(JSON.stringify(this._items.getValue()));
        this._items.next(this._items.getValue().filter((item) => item._ouid !== row._ouid));
    }

    public addItem() {
        let item = this._newItem();
        let arr = [...this._items.getValue(), this._newItem()];
        this._items.next(arr);
    }

    public sortBy(fieldName) {
        let arr = this._items.getValue();
        arr = arr.sort((a, b) => {
            let aval = a[fieldName] || 0;
            let bval = b[fieldName] || 0;
            if (aval < bval) {
                return -1;
            }
            if (aval > bval) {
                return 1;
            }
            return 0;
        });
        this._items.next([...arr]);
    }

    public load() {
        let arr = [];
        for (let i = 1; i < 10; i++) {
            arr.push(this._newItem());
        }

        this._items.next(arr);
    }
    public select(row) {
        let _itemsArray = this._items.getValue();
        let _index = this._selectedIndex.getValue();
        // set current row selected property to true
        if (_index > -1) {
            _itemsArray[_index][this.selectedProperty] = false;
        }

        _index = _itemsArray.indexOf(row);

        row[this.selectedProperty] = true;
        // set current selected index
        this._selectedIndex.next(_index);
        // save changed collection
        this._items.next([..._itemsArray]);

    }

    public checkDblClick(row) {
        let _itemsArray = this._items.getValue();
        row[this.checkedProperty] = !row[this.checkedProperty];

        this._items.next([..._itemsArray]);

    }

    private deleteMouseOver(row) {
        this.renderer.setElementClass(row, 'row-delete', true);
    }

    private deleteMouseLeave(row) {
        this.renderer.setElementClass(row, 'row-delete', false);
    }

    private _newItem() {
        /*        let aaaValues = ['Иванов', 'Петров', 'Сидоров', 'Бананов', 'Пустозвонов', 'Бонд', 'Смит'];
                let dddValues = [
                    'Иванович', 'Петрович', 'Аристархович',
                    'Николаевич', 'Васильевич', 'Олегович'];
                let sssValues = ['Иван', 'Петр', 'Василий', 'Евлампий', 'Дмитрий', 'Николай'];*/
        let aaaValues = ['Иванов', 'Петров', 'Сидоров'];
        let dddValues = [
            'Иванович', 'Петрович', 'Аристархович'];
        let sssValues = ['Иван', 'Петр', 'Василий'];

        let getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
        this.count++;
        return {
            _ouid: this.count, aaa: getRandomItem(aaaValues),
            sss: getRandomItem(sssValues), ddd: getRandomItem(dddValues), eee: 1
        };
    }
}
