import { AGridComponent } from './aGrid/agrid.component';
import { AGridBottomComponent } from './aGrid/aGridBottom/agridbottom.component';
import { AGridBodyComponent } from './aGrid/aGridBody/agridbody.component';
import { AGridColumnComponent } from './aGrid/aGridColumn/agridcolumn.component';
import { AGridCellDirective } from './aGrid/aGridColumn/agridcell.directive';
import { AGridFilterDirective } from './aGrid/aGridColumn/agridfilter.directive';
import { AGridFilterLoaderComponent } from './aGrid/aGridColumn/agridfilterloader.component';
import { AGridColumnCellLoaderComponent } from './aGrid/aGridColumn/agridcellloader.component';
import { AGridHeaderDirective } from './aGrid/aGridColumn/agridheader.directive';
import { AGridColumnHeaderLoaderComponent } from './aGrid/aGridColumn/agridheaderloader.component';
import { AGridPagerComponent } from './aGrid/aGridPager/agridpager.component';
import { AGridButtonComponent } from './aGrid/aGridButton/agridbutton.component';
import {
    ScrollToPaddingRightDirective
} from './aGrid/scrollToPaddingRight/scrollToPaddingRight.directive';
import { ContentUpdatedDirective } from './aGrid/contentUpdated/contentUpdated.directive';
import {
    AGridColumnResizerComponent
}
from './aGrid/aGridColumnResizer/aGridColumnResizer.component';
import {
    SynkHorizontalScrollDirective
} from './aGrid/synkHorizontalScroll/synkHorizontalScroll.directive';
import { MutationObserverService } from './aGrid/utils/mutationObserver.service';
import { AGridGroupDirective } from './aGrid/aGridGroup/aGridGroup.directive';
import { AGridGroupLoaderComponent } from './aGrid/aGridGroup/aGridGroupLoader.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPILER_PROVIDERS } from '@angular/compiler';
import { AGridDetailDirective } from './aGrid/aGridDetail/aGridDetail.directive';
import { AGridDetailLoaderComponent } from './aGrid/aGridDetail/aGridDetailLoader.component';

import {AGroupForModule} from 'agroupfor';

@NgModule({
    imports: [CommonModule, FormsModule, AGroupForModule],
    providers: [
        COMPILER_PROVIDERS, { provide: Window, useValue: window },
        MutationObserverService
    ],
    declarations: [
        AGridComponent, AGridGroupDirective,
        AGridGroupLoaderComponent, SynkHorizontalScrollDirective,
        ScrollToPaddingRightDirective, ContentUpdatedDirective,
        AGridColumnResizerComponent, AGridBottomComponent, AGridButtonComponent,
        AGridFilterLoaderComponent, AGridPagerComponent,
        AGridBodyComponent, AGridColumnComponent,
        AGridFilterDirective, AGridCellDirective,
        AGridColumnCellLoaderComponent, AGridHeaderDirective,
        AGridColumnHeaderLoaderComponent, AGridDetailDirective, AGridDetailLoaderComponent
    ],
    exports: [
        AGridComponent, AGridGroupDirective, ScrollToPaddingRightDirective,
        AGridBottomComponent, AGridPagerComponent, AGridButtonComponent, AGridFilterLoaderComponent,
        AGridBodyComponent, AGridFilterDirective, CommonModule, FormsModule,
        AGridColumnComponent, AGridCellDirective,
        AGridColumnCellLoaderComponent, AGridHeaderDirective, AGridColumnHeaderLoaderComponent,
        AGridDetailDirective, AGridDetailLoaderComponent
    ]
})
export class AgridModule { }
export { AGridGroupDirective } from './aGrid/aGridGroup/aGridGroup.directive';
export { AGridCellDirective } from './aGrid/aGridColumn/agridcell.directive';
export { AGridFilterDirective } from './aGrid/aGridColumn/agridfilter.directive';
export { AGridHeaderDirective } from './aGrid/aGridColumn/agridheader.directive';
export { AGridDetailDirective } from './aGrid/aGridDetail/aGridDetail.directive';