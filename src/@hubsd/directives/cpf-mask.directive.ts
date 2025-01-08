import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[hubsdCpfMask]',
})
export class CpfMaskDirective implements OnChanges {
  @Input('value') public value: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.value) {
      this.el.nativeElement.value = this.format(this.value);
    }
  }

  @HostListener('input', ['$event']) onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = this.format(input.value);
  }

  @HostListener('ngModelChange', ['$event']) onNgModelChange(
    event: string
  ): void {
    const formattedValue = this.format(event);
    this.el.nativeElement.value = formattedValue;
  }

  format(input: string): string {
    if (input) {
      let value = input.replace(/\D/g, '');

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      return value;
    }
    return '';
  }
}
