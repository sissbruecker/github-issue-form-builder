import { Configuration, FieldType, TextAreaField } from './model.js';

export interface Preset {
  name: string;
  configuration: Configuration;
}

export const presets: Preset[] = [
  {
    name: 'Bug Report',
    configuration: {
      name: 'Bug Report',
      description: '',
      fields: [
        {
          id: 1,
          type: FieldType.TextArea,
          attributes: {
            label: 'Description',
            description: 'Give a concise description of the problem',
            value: '',
            placeholder: '',
          },
          validations: { required: true },
        } as TextAreaField,
        {
          id: 2,
          type: FieldType.TextArea,
          attributes: {
            label: 'Expected outcome',
            description: 'What did you expect to happen instead?',
            value: '',
            placeholder: '',
          },
          validations: { required: true },
        } as TextAreaField,
        {
          id: 3,
          type: FieldType.TextArea,
          attributes: {
            label: 'Minimal Reproducible Example',
            description:
              'Provide an example that reproduces the issue, either as a code snippet or a link.',
            value: '',
            placeholder: '',
          },
          validations: { required: true },
        } as TextAreaField,
      ],
    },
  },
];
