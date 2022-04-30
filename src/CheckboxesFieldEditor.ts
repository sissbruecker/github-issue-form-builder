import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '@vaadin/button';
import '@vaadin/icon';
import { MobxLitElement } from '@adobe/lit-mobx';
import '@vaadin/checkbox';
import { CheckboxCheckedChangedEvent } from '@vaadin/checkbox';
import { action, makeAutoObservable, runInAction } from 'mobx';
import '@vaadin/text-field';
import { TextFieldValueChangedEvent } from '@vaadin/text-field';
import { CheckboxesField, CheckboxOption } from './shared/model.js';
import './FieldEditor.js';
import { fieldEditorStyles } from './FieldEditor.js';

@customElement('fb-checkboxes-field-editor')
export class CheckboxesFieldEditor extends MobxLitElement {
  static styles = [
    fieldEditorStyles,
    css`
      :host {
        display: block;
      }

      .add-option {
        display: flex;
        align-items: baseline;
      }

      .add-option > *:not(:last-child) {
        margin-right: var(--lumo-space-s);
      }

      .option-list-item {
        display: flex;
        align-items: baseline;
      }

      .option-list-item > *:not(:last-child) {
        margin-right: var(--lumo-space-s);
      }
    `,
  ];

  @property({ attribute: false })
  field!: CheckboxesField;

  @state()
  editedOptionValue: string = '';

  onAddOption() {
    runInAction(() => {
      const option: CheckboxOption = {
        label: this.editedOptionValue,
        required: false,
      };
      makeAutoObservable(option);
      this.editedOptionValue = '';
      this.field.attributes.options = [
        ...this.field.attributes.options,
        option,
      ];
    });
  }

  removeOption(optionToRemove: CheckboxOption) {
    runInAction(() => {
      this.field.attributes.options = this.field.attributes.options.filter(
        option => option !== optionToRemove
      );
    });
  }

  render() {
    return html`
      <fb-field-editor .field=${this.field}>
        <span slot="header">Checkboxes</span>
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
          <div class="add-option">
            <vaadin-text-field
              label="Options"
              .value=${this.editedOptionValue}
              @value-changed=${action((e: TextFieldValueChangedEvent) => {
                this.editedOptionValue = e.detail.value;
              })}
            ></vaadin-text-field>
            <vaadin-button
              @click="${this.onAddOption}"
              ?disabled=${!this.editedOptionValue}
              >Add</vaadin-button
            >
          </div>
          <div>
            ${repeat(
              this.field.attributes.options,
              (option, index) => index,
              option => html`
                <div class="option-list-item">
                  <vaadin-text-field
                    .value=${option.label}
                    class="width-full"
                    @value-changed=${action((e: TextFieldValueChangedEvent) => {
                      option.label = e.detail.value;
                    })}
                  ></vaadin-text-field>
                  <vaadin-checkbox
                    label="Required"
                    .checked=${option.required}
                    @checked-changed=${action(
                      (e: CheckboxCheckedChangedEvent) => {
                        option.required = e.detail.value;
                      }
                    )}
                  ></vaadin-checkbox>
                  <vaadin-button
                    theme="tertiary icon error"
                    @click=${() => this.removeOption(option)}
                  >
                    <vaadin-icon icon="lumo:cross"></vaadin-icon>
                  </vaadin-button>
                </div>
              `
            )}
          </div>
        </div>
        <div slot="preview">
          <div class="preview-title">
            <span>${this.field.attributes.label}</span>
          </div>
          ${this.field.attributes.description
            ? html`<div class="preview-description">
                ${this.field.attributes.description}
              </div>`
            : null}
          <div>
            ${repeat(
              this.field.attributes.options,
              (option, index) => index,
              option => html`
                <div>
                  <vaadin-checkbox>
                    <label slot="label">
                      ${option.label}
                      ${option.required
                        ? html`<span class="preview-required-indicator"
                            >*</span
                          >`
                        : null}
                    </label>
                  </vaadin-checkbox>
                </div>
              `
            )}
          </div>
        </div>
      </fb-field-editor>
    `;
  }
}
