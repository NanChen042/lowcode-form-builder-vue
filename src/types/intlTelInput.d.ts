export interface IntlTelInputCountryData {
  name: string;
  iso2: string;
  dialCode: string;
  priority?: number;
  areaCodes?: string[] | null;
}

export interface IntlTelInputInstance {
  destroy: () => void;
  isValidNumber: () => boolean;
  getNumber: (format?: any) => string;
  setNumber: (number: string) => void;
  setCountry: (countryCode: string) => void;
  getSelectedCountryData: () => IntlTelInputCountryData;
}

export interface IntlTelInputOptions {
  initialCountry?: string;
  preferredCountries?: string[];
  countryOrder?: string[];
  onlyCountries?: string[];
  autoPlaceholder?: 'aggressive' | 'polite' | 'off';
  separateDialCode?: boolean;
  validationNumberType?: string;
  nationalMode?: boolean;
  autoInsertDialCode?: boolean;
  countrySearch?: boolean;
  i18n?: Record<string, string>;
}

export interface IntlTelInputUtils {
  formatNumberAsYouType: (number: string, countryCode?: string) => string;
  formatNumber: (number: string, countryCode?: string, format?: number) => string;
  getExampleNumber: (countryCode: string, national: boolean, numberType?: number) => string;
  getExtension: (number: string, countryCode?: string) => string;
  getNumberType: (number: string, countryCode?: string) => number;
  getValidationError: (number: string, countryCode?: string) => number;
  isValidNumber: (number: string, countryCode?: string) => boolean;
  isPossibleNumber: (number: string, countryCode?: string) => boolean;
  numberFormat?: Record<string, number>;
  numberType?: Record<string, number>;
  validationError?: Record<string, number>;
}

export interface IntlTelInputFn {
  (node: HTMLInputElement, options?: IntlTelInputOptions): IntlTelInputInstance;
  utils?: IntlTelInputUtils;
  getCountryData?: () => IntlTelInputCountryData[];
}

declare global {
  interface Window {
    intlTelInput?: IntlTelInputFn;
  }
}
