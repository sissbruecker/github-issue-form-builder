import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Remarkable } from 'remarkable';
import '@vaadin/text-area';
import { TextAreaChangeEvent } from '@vaadin/text-area';
import { MobxLitElement } from '@adobe/lit-mobx';
import { action } from 'mobx';
import { MarkdownField } from './shared/model.js';
import './FieldEditor.js';
import { fieldEditorStyles } from './FieldEditor.js';

const remarkable = new Remarkable();

@customElement('fb-markdown-field-editor')
export class MarkdownFieldEditor extends MobxLitElement {
  static styles = [
    fieldEditorStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({ attribute: false })
  field!: MarkdownField;

  render() {
    return html`
      <fb-field-editor .field=${this.field}>
        <span slot="header">Markdown</span>
        <div slot="editor">
          <vaadin-text-area
            label="Value"
            class="width-full"
            .value=${this.field.attributes.value}
            @value-changed=${action((e: TextAreaChangeEvent) => {
              this.field.attributes.value = e.target.value;
            })}
          ></vaadin-text-area>
        </div>
        <div slot="preview">
          <div
            class="preview-markdown-value"
            .innerHTML=${remarkable.render(this.field.attributes.value)}
          ></div>
        </div>
      </fb-field-editor>
    `;
  }
}
