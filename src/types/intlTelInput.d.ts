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
  onlyCountries?: string[];
  autoPlaceholder?: 'aggressive' | 'polite' | 'off';
  separateDialCode?: boolean;
  validationNumberType?: string;
  countrySearch?: boolean;
  i18n?: Record<string, string>;
}

declare global {
  interface Window {
    intlTelInput?: (
      node: HTMLInputElement,
      options?: IntlTelInputOptions
    ) => IntlTelInputInstance;
  }
}
