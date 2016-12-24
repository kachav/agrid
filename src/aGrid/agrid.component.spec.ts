import {ElementRef, Renderer} from '@angular/core';

import {async,inject,TestBed} from '@angular/core/testing';

import {BrowserDynamicTestingModule,platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

import { destroyPlatform } from '@angular/core';

import {aGrid} from './agrid.component';
import {aGridBottom} from './aGridBottom/agridbottom.component';
import {aGridBody} from './aGridBody/agridbody.component';
import {aGridColumn} from './aGridColumn/agridcolumn.component';
import {aGridCell} from './aGridColumn/agridcell.component';
import {aGridFilter} from './aGridColumn/agridfilter.component';
import {aGridFilterLoader} from './aGridColumn/agridfilterloader.component';
import {aGridColumnCellLoader} from './aGridColumn/agridcellloader.component';
import {aGridHeader} from './aGridColumn/agridheader.component';
import {aGridColumnHeaderLoader} from './aGridColumn/agridheaderloader.component';
import {aGridPager} from './aGridPager/agridpager.component';
import {aGridButton} from './aGridButton/agridbutton.component';

import {FormsModule} from '@angular/forms';

class ElementRefMock {

}

class RendererMock {

}


describe('Home', () => {
  let gridInsgance;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports:[FormsModule],
      declarations: [
        aGrid,aGridBottom,aGridButton, aGridFilterLoader, aGridPager, aGridBody, aGridColumn, aGridFilter, aGridCell, aGridColumnCellLoader,aGridHeader,aGridColumnHeaderLoader
      ],
      providers: [
        { provide: ElementRef, useClass: ElementRefMock },
        { provide: Renderer, useClass: RendererMock }
      ]
    }).compileComponents().then(() => {
      gridInsgance = TestBed.createComponent(aGrid);
      gridInsgance.detectChanges();
    });
  }));

  it('headerPaddingRight is "0px"', () => {
    expect(gridInsgance.headerPaddingRight).toEqual('0px');
  });

});
