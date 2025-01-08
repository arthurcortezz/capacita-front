import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[hubsdCnpjMask]',
})
export class CnpjMaskDirective implements OnChanges {
  @Input('value') public value: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.value) this.el.nativeElement.value = this.format(this.value);
  }

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
    if (input) {
      let value = input.replace(/\D/g, '');

      if (value.length > 14) {
        value = value.slice(0, 14);
      }

      if (value.length <= 14) {
        value = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          '$1.$2.$3/$4-$5'
        );
      }

      return value;
    }
  }
}
