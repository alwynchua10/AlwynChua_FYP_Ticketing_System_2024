import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderContainerComponent } from './header-container/header-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HeaderContainerComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [HeaderComponent, FooterComponent, HeaderContainerComponent],
})
export class CoreModule {}
