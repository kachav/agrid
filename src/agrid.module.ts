import { aGrid } from './aGrid/agrid.component';
import { aGridBottom } from './aGrid/aGridBottom/agridbottom.component';
import { aGridBody } from './aGrid/aGridBody/agridbody.component';
import { aGridColumn } from './aGrid/aGridColumn/agridcolumn.component';
import { aGridCell } from './aGrid/aGridColumn/agridcell.directive';
import { aGridFilter } from './aGrid/aGridColumn/agridfilter.directive';
import { aGridFilterLoader } from './aGrid/aGridColumn/agridfilterloader.component';
import { aGridColumnCellLoader } from './aGrid/aGridColumn/agridcellloader.component';
import { aGridHeader } from './aGrid/aGridColumn/agridheader.directive';
import { aGridColumnHeaderLoader } from './aGrid/aGridColumn/agridheaderloader.component';
import { aGridPager } from './aGrid/aGridPager/agridpager.component';
import { aGridButton } from './aGrid/aGridButton/agridbutton.component';
import { ScrollToPaddingRight } from './aGrid/scrollToPaddingRight/scrollToPaddingRight.directive';
import { ContentUpdated } from './aGrid/contentUpdated/contentUpdated.directive';
import { AGridColumnResizer } from './aGrid/aGridColumnResizer/aGridColumnResizer.component';
import { SynkHorizontalScroll } from './aGrid/synkHorizontalScroll/synkHorizontalScroll.directive';
import {MutationObserverService} from './aGrid/utils/mutationObserver.service';
import {LodashService} from './aGrid/utils/lodash.service';
import {AGridFor} from './aGrid/aGridFor/aGridFor.directive';
import {aGridGroup} from './aGrid/aGridGroup/aGridGroup.directive'
import {aGridGroupLoader} from './aGrid/aGridGroup/aGridGroupLoader.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPILER_PROVIDERS } from '@angular/compiler';

@NgModule({
    imports: [CommonModule, FormsModule],
    providers: [COMPILER_PROVIDERS,{ provide: Window, useValue: window}, MutationObserverService,LodashService],
    declarations: [aGrid,AGridFor,aGridGroup,aGridGroupLoader, SynkHorizontalScroll, ScrollToPaddingRight, ContentUpdated, AGridColumnResizer, aGridBottom, aGridButton, aGridFilterLoader, aGridPager, aGridBody, aGridColumn, aGridFilter, aGridCell, aGridColumnCellLoader, aGridHeader, aGridColumnHeaderLoader],
    exports: [aGrid,aGridGroup, ScrollToPaddingRight, aGridBottom, aGridPager, aGridButton, aGridFilterLoader, aGridBody, aGridFilter, CommonModule, FormsModule, aGridColumn, aGridCell, aGridColumnCellLoader, aGridHeader, aGridColumnHeaderLoader]
})
export class AgridModule { }