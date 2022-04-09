import { makeAutoObservable } from 'mobx';

interface CommonFieldAttributes {
  label: string;
  description: string;
}

export interface Field {
  attributes: CommonFieldAttributes;
}

export class TextAreaField implements Field {
  attributes: CommonFieldAttributes & {
    value: string;
    placeholder: string;
  };

  validations: {
    required: boolean;
  };

  constructor() {
    this.attributes = {
      label: 'Text area',
      description: '',
      value: '',
      placeholder: '',
    };
    this.validations = { required: false };
    makeAutoObservable(this);
  }
}
