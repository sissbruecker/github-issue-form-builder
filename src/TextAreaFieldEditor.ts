import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/text-area';
import { MobxLitElement } from '@adobe/lit-mobx';
import '@vaadin/checkbox';
import { CheckboxCheckedChangedEvent } from '@vaadin/checkbox';
import { action } from 'mobx';
import '@vaadin/text-field';
import { TextFieldValueChangedEvent } from '@vaadin/text-field';
import { TextAreaChangeEvent } from '@vaadin/text-area';
import '@vaadin/details';
import { TextAreaField } from './shared/model.js';
import './FieldEditor.js';
import { fieldEditorStyles } from './FieldEditor.js';

@customElement('fb-textarea-field-editor')
export class TextAreaFieldEditor extends MobxLitElement {
  static styles = [
    fieldEditorStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({ attribute: false })
  field!: TextAreaField;

  render() {
    return html`
      <fb-field-editor .field=${this.field}>
        <span slot="header">Textarea</span>
        <div slot="editor">
          <vaadin-text-field
            label="Label"
            class="width-full"
            .value=${this.field.attributes.label}
            @value-changed=${action((e: TextFieldValueChangedEvent) => {
              this.field.attributes.label = e.detail.value;
            })}
          ></vaadin-text-field>
          <br />
          <vaadin-text-field
            label="Description"
            class="width-full"
            .value=${this.field.attributes.description}
            @value-changed=${action((e: TextFieldValueChangedEvent) => {
              this.field.attributes.description = e.detail.value;
            })}
          ></vaadin-text-field>
          <br />
          <vaadin-details theme="small">
            <div slot="summary">More</div>
            <vaadin-checkbox
              label="Required"
              .checked=${this.field.validations.required}
              @checked-changed=${action((e: CheckboxCheckedChangedEvent) => {
                this.field.validations.required = e.detail.value;
              })}
            ></vaadin-checkbox>
            <br />

            <vaadin-text-area
              label="Value"
              class="width-full"
              .value=${this.field.attributes.value}
              @value-changed=${action((e: TextAreaChangeEvent) => {
                this.field.attributes.value = e.target.value;
              })}
            ></vaadin-text-area>
            <br />
            <vaadin-text-area
              label="Placeholder"
              class="width-full"
              .value=${this.field.attributes.placeholder}
              @value-changed=${action((e: TextAreaChangeEvent) => {
                this.field.attributes.placeholder = e.target.value;
              })}
            ></vaadin-text-area>
          </vaadin-details>
        </div>
        <div slot="preview">
          <div class="preview-title">
            <span>${this.field.attributes.label}</span>
            ${this.field.validations.required
              ? html`<span class="preview-required-indicator">*</span>`
              : null}
          </div>
          ${this.field.attributes.description
            ? html`<div class="preview-description">
                ${this.field.attributes.description}
              </div>`
            : null}
          <div>
            <vaadin-text-area
              class="width-full"
              .value=${this.field.attributes.value}
              .placeholder=${this.field.attributes.placeholder}
            ></vaadin-text-area>
          </div>
        </div>
      </fb-field-editor>
    `;
  }
}
