import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { DevLibrarySharedModule } from 'app/shared/shared.module';
import { DevLibraryCoreModule } from 'app/core/core.module';
import { DevLibraryAppRoutingModule } from './app-routing.module';
import { DevLibraryHomeModule } from './home/home.module';
import { DevLibraryEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    DevLibrarySharedModule,
    DevLibraryCoreModule,
    DevLibraryHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    DevLibraryEntityModule,
    DevLibraryAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent]
})
export class DevLibraryAppModule {}
