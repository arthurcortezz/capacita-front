import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CepMaskDirective,
  CpfMaskDirective,
  CnpjMaskDirective,
  PhoneMaskDirective,
} from '@hubsd/directives';
import { HubsdTableModule } from '@hubsd/components/table';
import { HubsdMenuModule } from '@hubsd/components/menu/menu.module';
import { HubsdApplicationMenuModule } from '@hubsd/components/application-menu/application-menu.module';

@NgModule({
  declarations: [
    PhoneMaskDirective,
    CpfMaskDirective,
    CnpjMaskDirective,
    CepMaskDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HubsdMenuModule,
    HubsdApplicationMenuModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    HubsdMenuModule,
    HubsdTableModule,
    CpfMaskDirective,
    CepMaskDirective,
    CnpjMaskDirective,
    PhoneMaskDirective,
    ReactiveFormsModule,
    HubsdApplicationMenuModule,
  ],
})
export class SharedModule {}
