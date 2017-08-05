import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {
    Input, Component, TemplateRef, ContentChild,
    ElementRef, ViewContainerRef
} from '@angular/core';
import { AGridCellDirective } from './agridcell.directive';
import { AGridHeaderDirective } from './agridheader.directive';
import { AGridFilterDirective } from './agridfilter.directive';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export const UNIT_PX='px';
export const UNIT_PERC='%';
export const WIDTH_UNITS = [UNIT_PERC, UNIT_PX];

@Component({
    selector: 'a-grid-column',
    template: `<ng-content></ng-content>`
})
export class AGridColumnComponent {
    private _destroy = new Subject();
    public destroy$ = this._destroy.asObservable().first();

    @Input() public colName: string;
    @Input() public colTitle: string;
    @Input() public resizable: boolean = true;
    @Input() public set width(value:number){
        this._width.next(value);
    };
    public get width(){
        return this._width.getValue();
    }
    private _width=new BehaviorSubject<number>(100);
    public width$=this._width.asObservable().takeUntil(this.destroy$).distinctUntilChanged();

    private _gridWidth=new Subject<number>();
    public gridWidth$=this._gridWidth.asObservable().takeUntil(this.destroy$).startWith(null);
    
    @Input() public set minWidth(value:number){
        this._minWidth.next(value);
    }
    private _minWidth = new BehaviorSubject<number>(30);
    private minWidth$ = this._minWidth.asObservable().takeUntil(this.destroy$);

    @Input() public set widthUnit(unit){
        this._units.next(unit);
    };

    public get widthUnit(){
        return this._units.getValue();
    }


    //units of width
    private _units = new BehaviorSubject<string>(UNIT_PX);
    public units$ = this._units.asObservable()
        
        .filter(unit=>WIDTH_UNITS.indexOf(unit)>-1)
        .takeUntil(this.destroy$);
    


    private _changingStart = new Subject<boolean>();
    public changingStart$ = this._changingStart.asObservable().takeUntil(this.destroy$);

    //end of width changing
    private _changingEnd=new Subject();

    //is changing in progress
    private isChanging$=this.changingStart$
        .merge(this._changingEnd.asObservable().mapTo(false)).distinctUntilChanged()
        .takeUntil(this.destroy$);

    private _diff=new Subject<number>();
    public diff$=this._diff.asObservable().takeUntil(this.destroy$);


    public inProgressWidth:string;

    public calcWidth$:Observable<string>;

    @ContentChild(AGridCellDirective) public cell;
    @ContentChild(AGridHeaderDirective) public header;
    @ContentChild(AGridFilterDirective) public filter;

    public widthChangeStart(gridWidth:number){
        this._gridWidth.next(gridWidth);
        this._changingStart.next(true);
    }

    public widthChanging(diff:number){
        this._diff.next(diff);
    }

    public widthChanged(gridWidth:number){
        this._gridWidth.next(gridWidth);
        this._changingEnd.next();
    }

    constructor(){
        //changing value of width 
        this.diff$.withLatestFrom(this.width$, this.units$, this.gridWidth$, this.minWidth$,
            (diff,width, units, gridWidth, minWidth)=>({diff,width, units, gridWidth, minWidth}))
        .subscribe(({diff,width, units, gridWidth, minWidth})=>{
            if(units===UNIT_PERC){
                diff=(diff/gridWidth)*100;
                minWidth=(minWidth/gridWidth)*100;
            }
            let result = width+diff;
            if(result>minWidth){
                this._width.next(result);
            }
        });

        //px when changing, last units$ value when changing ends
        const changingUnits$=this.isChanging$
            .withLatestFrom(this.units$,(isChanging, units)=>({isChanging, units}))
            .map(context=>context.isChanging?UNIT_PX:context.units);

        //all sources units flow
        const currentUnits$ = this.units$.startWith(this.widthUnit).merge(changingUnits$).pairwise();

        this.calcWidth$=this.width$
            .combineLatest(currentUnits$,(width, [prevUnits, curUnits])=>({width,curUnits, prevUnits}))
            
            .withLatestFrom(this.gridWidth$,(context, gridWidth)=>({...context, gridWidth}))
            
            .map(context=>{
                let widthValue=context.width;
                
                if(context.curUnits===UNIT_PX && context.prevUnits===UNIT_PERC){
                    widthValue=context.gridWidth*widthValue/100;
                }
                return `${widthValue}${context.curUnits}`;
            })
            .merge(this.width$.first().withLatestFrom(this.units$,(width,units)=>`${width}${units}`));
    }

    public ngOnDestroy(){
        this._destroy.next();
    }
}
