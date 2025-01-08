export class PhoneValidator {
  static valid() {
    return (control) => {
      if (!control.value) {
        return null;
      }

      const phone = control.value.replace(/[^\d]+/g, '');

      if (!PhoneValidator.validPhone(phone)) {
        control.setErrors({ invalidPhone: true });
        return {
          invalidPhone: true,
          message: 'O número de telefone é inválido.',
        };
      }

      control.setErrors(null);
    };
  }

  static validPhone(phone) {
    const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5}\-?\d{4})$/;
    if (phone.length < 10 || phone.length > 11) return false;
    return phoneRegex.test(phone);
  }
}
