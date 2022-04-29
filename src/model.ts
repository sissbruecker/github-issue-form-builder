import { makeAutoObservable } from 'mobx';

// eslint-disable-next-line no-shadow
export enum FieldType {
  Markdown = 'markdown',
  Input = 'input',
  TextArea = 'textarea',
  Checkboxes = 'checkboxes',
}

export interface Field {
  id: number;
  type: FieldType;
  attributes: {};
}

export interface MarkdownField extends Field {
  type: FieldType.Markdown;

  attributes: {
    value: string;
  };
}

export interface InputField extends Field {
  type: FieldType.Input;

  attributes: {
    label: string;
    description: string;
    value: string;
    placeholder: string;
  };

  validations: {
    required: boolean;
  };
}

export interface TextAreaField extends Field {
  type: FieldType.TextArea;

  attributes: {
    label: string;
    description: string;
    value: string;
    placeholder: string;
  };

  validations: {
    required: boolean;
  };
}

export interface CheckboxOption {
  label: string;
  required: boolean;
}

export interface CheckboxesField extends Field {
  type: FieldType.Checkboxes;
  attributes: {
    label: string;
    description: string;
    options: CheckboxOption[];
  };
}

export interface Configuration {
  name: string;
  description: string;
  fields: Field[];
}

function getNextFieldId(configuration: Configuration) {
  const maxId = Math.max(0, ...configuration.fields.map(field => field.id));

  return maxId + 1;
}

export function createConfiguration(): Configuration {
  return makeAutoObservable({
    name: 'Bug Report',
    description: '',
    fields: [],
  });
}

export function createField(configuration: Configuration, type: FieldType) {
  switch (type) {
    case FieldType.Markdown: {
      const markdownField: MarkdownField = makeAutoObservable({
        id: getNextFieldId(configuration),
        type: FieldType.Markdown,
        attributes: {
          value: '',
        },
      });
      return markdownField;
    }
    case FieldType.Input: {
      const inputField: InputField = makeAutoObservable({
        id: getNextFieldId(configuration),
        type: FieldType.Input,
        attributes: {
          label: 'Input',
          description: '',
          value: '',
          placeholder: '',
        },
        validations: { required: false },
      });
      return inputField;
    }
    case FieldType.TextArea: {
      const textAreaField: TextAreaField = makeAutoObservable({
        id: getNextFieldId(configuration),
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
    case FieldType.Checkboxes: {
      const checkboxesField: CheckboxesField = makeAutoObservable({
        id: getNextFieldId(configuration),
        type: FieldType.Checkboxes,
        attributes: {
          label: 'Checkboxes',
          description: '',
          options: [],
        },
        validations: { required: false },
      });
      return checkboxesField;
    }
    default:
      throw new Error(`Unexpected field type: ${type}`);
  }
}
