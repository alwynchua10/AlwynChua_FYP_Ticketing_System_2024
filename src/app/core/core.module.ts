import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderContainerComponent } from './header-container/header-container.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HeaderContainerComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent, HeaderContainerComponent],
})
export class CoreModule {}
