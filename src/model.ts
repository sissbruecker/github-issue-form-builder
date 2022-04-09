import { makeAutoObservable } from 'mobx';

let nextFieldId = 0;

function getNextFieldId() {
  nextFieldId += 1;
  return nextFieldId.toString();
}

// eslint-disable-next-line no-shadow
export enum FieldType {
  TextArea = 'textArea',
}

interface CommonFieldAttributes {
  label: string;
  description: string;
}

export interface Field {
  id: string;
  type: FieldType;
  attributes: CommonFieldAttributes;
}

export class TextAreaField implements Field {
  id: string;

  type = FieldType.TextArea;

  attributes: CommonFieldAttributes & {
    value: string;
    placeholder: string;
  };

  validations: {
    required: boolean;
  };

  constructor() {
    this.id = getNextFieldId();
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

export class Configuration {
  fields: Field[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}
