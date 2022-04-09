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

export interface TextAreaField extends Field {
  id: string;

  type: FieldType.TextArea;

  attributes: CommonFieldAttributes & {
    value: string;
    placeholder: string;
  };

  validations: {
    required: boolean;
  };
}

export interface Configuration {
  fields: Field[];
}

export function createConfiguration(): Configuration {
    return makeAutoObservable({
        fields: []
    });
}

export function createField(type: FieldType) {
  switch (type) {
    case FieldType.TextArea: {
      const textAreaField: TextAreaField = makeAutoObservable({
        id: getNextFieldId(),
        type: FieldType.TextArea,
        attributes: {
          label: 'Text area',
          description: '',
          value: '',
          placeholder: '',
        },
        validations: { required: false },
      });
      return textAreaField;
    }
    default:
      throw new Error(`Unexpected field type: ${type}`);
  }
}
