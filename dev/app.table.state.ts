import { Injectable, EventEmitter, Renderer } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HomeTableState {

    public aaaFilter: string;

    public dddFilter: string;

    public selectedProperty: string;

    public checkedProperty: string;

    private _items: BehaviorSubject<any[]>;

    private _selectedIndex: BehaviorSubject<number>;

    private count = 0;

    constructor(private renderer:Renderer) {
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

    public modifyDays(index: number, value: number) {
        let items = this._items.getValue();

        if (items[index]) {
            items[index].eee = items[index].eee + value;
            this._items.next([...items]);
        }
    }

    public addDay(index: number) {
        this.modifyDays(index, 1);
    }

    public removeDay(index: number) {
        this.modifyDays(index, -1);
    }

    public removeItem(row) {
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
        for (let i = 1; i < 100; i++) {
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

    public bodyScroll(e) {
        console.log(e.target.scrollTop);
    }

    public checkDblClick(row) {
        let _itemsArray = this._items.getValue();
        row[this.checkedProperty] = !row[this.checkedProperty];

        this._items.next([..._itemsArray]);

    }

    deleteMouseOver(row){
        this.renderer.setElementClass(row,'row-delete',true);
        console.log(row);
    }

    deleteMouseLeave(row){
        this.renderer.setElementClass(row,'row-delete',false);
        console.log(row);
    }

    private _newItem() {
        let aaaValues = ['Иванов', 'Петров', 'Сидоров', 'Бананов', 'Пустозвонов', 'Бонд', 'Смит'];
        let dddValues = [
            'Иванович', 'Петрович', 'Аристархович',
            'Николаевич', 'Васильевич', 'Олегович'];
        let sssValues = ['Иван', 'Петр', 'Василий', 'Евлампий', 'Дмитрий', 'Николай'];

        let getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
        this.count++;
        return {
            _ouid: this.count, aaa: getRandomItem(aaaValues),
            sss: getRandomItem(sssValues), ddd: getRandomItem(dddValues), eee: 1
        };
    }
}
