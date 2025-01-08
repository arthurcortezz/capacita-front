import { FormGroup, ValidatorFn } from "@angular/forms";

export class OneYearDateValidator {
  static valid(firstDateControlName: string, secondDateControlName: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const firstDateControl = formGroup.get(firstDateControlName);
      const secondDateControl = formGroup.get(secondDateControlName);

      if (!firstDateControl || !secondDateControl) {
        return null;
      }

      const firstDate = firstDateControl.value;
      const secondDate = secondDateControl.value;

      if (firstDate && secondDate) {
        const startAt = new Date(firstDate);
        const finishAt = new Date(secondDate);
        let differenceInMonths = (finishAt.getFullYear() - startAt.getFullYear()) * 12;
        differenceInMonths -= startAt.getMonth();
        differenceInMonths += finishAt.getMonth();
        differenceInMonths = differenceInMonths <= 0 ? 0 : differenceInMonths

        if (Math.abs(differenceInMonths) !== 11) {
          formGroup.get(secondDateControlName).setErrors({ invalidDate: true })
          return {
            invalidDate: true,
            message: 'O perído deve ser de um ano corrido.'
          };
        }
      }

      return null;
    };
  }
}
