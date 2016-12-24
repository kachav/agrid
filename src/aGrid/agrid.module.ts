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
import {ScrollToPaddingRight} from './scrollToPaddingRight/scrollToPaddingRight.directive';

import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { COMPILER_PROVIDERS } from '@angular/compiler';

@NgModule({
    imports:[CommonModule, FormsModule],
    providers:[COMPILER_PROVIDERS],
    declarations:[aGrid,ScrollToPaddingRight,aGridBottom,aGridButton, aGridFilterLoader, aGridPager, aGridBody, aGridColumn, aGridFilter, aGridCell, aGridColumnCellLoader,aGridHeader,aGridColumnHeaderLoader],
    exports:[aGrid,ScrollToPaddingRight,aGridBottom, aGridPager,aGridButton, aGridFilterLoader, aGridBody, aGridFilter, CommonModule, FormsModule, aGridColumn, aGridCell, aGridColumnCellLoader,aGridHeader,aGridColumnHeaderLoader]
})
export class AgridModule{}