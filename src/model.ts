import { makeAutoObservable } from 'mobx';

// eslint-disable-next-line no-shadow
export enum FieldType {
  Markdown = 'markdown',
  TextArea = 'textarea',
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

export interface Configuration {
  fields: Field[];
}

function getNextFieldId(configuration: Configuration) {
  const maxId = Math.max(0, ...configuration.fields.map(field => field.id));

  return maxId + 1;
}

export function createConfiguration(): Configuration {
  return makeAutoObservable({
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
    default:
      throw new Error(`Unexpected field type: ${type}`);
  }
}
