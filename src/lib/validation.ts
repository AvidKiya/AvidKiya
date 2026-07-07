// Persian validation messages and rules

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

const messages = {
  required: 'این فیلد الزامی است',
  email: 'ایمیل معتبر نیست',
  minLength: (n: number) => `حداقل ${n} کاراکتر وارد کنید`,
  maxLength: (n: number) => `حداکثر ${n} کاراکتر مجاز است`,
  pattern: 'فرمت وارد شده معتبر نیست',
  phone: 'شماره تلفن معتبر نیست',
  url: 'آدرس وب معتبر نیست',
  password: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
  passwordMatch: 'رمز عبور مطابقت ندارد',
  number: 'لطفاً یک عدد وارد کنید',
  min: (n: number) => `مقدار باید حداقل ${n} باشد`,
  max: (n: number) => `مقدار باید حداکثر ${n} باشد`,
};

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+98|98|0)?9\d{9}$/,
  url: /^https?:\/\/.+/,
  persian: /^[\u0600-\u06FF\s]+$/,
  english: /^[a-zA-Z\s]+$/,
  kiaCode: /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
};

export function validate(value: string, rules: ValidationRule): string | null {
  if (rules.required && !value.trim()) {
    return messages.required;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return messages.minLength(rules.minLength);
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return messages.maxLength(rules.maxLength);
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return messages.pattern;
  }

  if (value && rules.custom) {
    return rules.custom(value);
  }

  return null;
}

export function validateForm(data: Record<string, string>, schema: Record<string, ValidationRule>): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const error = validate(data[field] || '', rules);
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}

export const fieldRules = {
  required: { required: true },
  email: { required: true, pattern: patterns.email },
  phone: { pattern: patterns.phone },
  url: { pattern: patterns.url },
  name: { required: true, minLength: 2, maxLength: 100 },
  message: { required: true, minLength: 10, maxLength: 2000 },
  password: { required: true, minLength: 8 },
  kiaCode: { required: true, pattern: patterns.kiaCode },
  title: { required: true, minLength: 2, maxLength: 200 },
  amount: { required: true, min: 0 },
};

export const honeypot = {
  name: 'website',
  label: 'Website',
};

export function checkHoneypot(formData: FormData): boolean {
  const value = formData.get(honeypot.name);
  return !value || value === '';
}