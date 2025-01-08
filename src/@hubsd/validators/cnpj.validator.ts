import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CnpjValidator {
  static valid(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      const cnpj = control.value.replace(/[^\d]+/g, '');

      if (cnpj.length !== 14 || !CnpjValidator.validCnpj(cnpj)) {
        control.setErrors({ invalidCnpj: true });

        return {
          invalidCnpj: true,
          message: 'O CNPJ é inválido.',
        };
      }

      control.setErrors({ invalidCnpj: false });
      return null;
    };
  }

  static validCnpj(cnpj: string): boolean {
    const numbers = cnpj.split('').map(Number);
    let sum = 0;
    let pos = 5;

    for (let i = 0; i < 12; i++) {
      sum += numbers[i] * pos;
      pos -= 1;
      if (pos === 1) {
        pos = 9;
      }
    }

    const mod = sum % 11;
    const digit1 = mod < 2 ? 0 : 11 - mod;

    if (digit1 !== numbers[12]) {
      return false;
    }

    sum = 0;
    pos = 6;

    for (let i = 0; i < 13; i++) {
      sum += numbers[i] * pos;
      pos -= 1;
      if (pos === 1) {
        pos = 9;
      }
    }

    const mod2 = sum % 11;
    const digit2 = mod2 < 2 ? 0 : 11 - mod2;

    return digit2 === numbers[13];
  }
}
