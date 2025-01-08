import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[hubsdCepMask]',
})
export class CepMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = this.format(input.value);
  }

  @HostListener('ngModelChange', ['$event']) onNgModelChange(
    event: string
  ): void {
    this.el.nativeElement.value = this.format(event);
  }

  format(input: string): string {
    let value = input.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    return value;
  }
}
