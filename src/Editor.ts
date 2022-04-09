import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/menu-bar';
import { Configuration, Field, FieldType, TextAreaField } from './model.js';
import './TextAreaFieldEditor.js';

interface FieldMenuItem extends MenuBarItem {
  type: FieldType;
}

@customElement('fb-editor')
export class Editor extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
    }

    .toolbar {
      padding: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-l);
      border-radius: var(--lumo-border-radius-l);
      background: var(--lumo-base-color);
      box-shadow: var(--lumo-box-shadow-s);
    }

    .fields > *:not(:last-child) {
      margin-bottom: var(--lumo-space-l);
    }
  `;

  toolbarItems = [
    {
      text: 'Add',
      theme: 'primary',
      children: [
        { text: 'Markdown' },
        { text: 'Input' },
        { text: 'TextArea', type: FieldType.TextArea },
        { text: 'Checkbox' },
      ],
    },
  ];

  @state()
  configuration = new Configuration();

  onAddField(event: MenuBarItemSelectedEvent) {
    const fieldMenuitem = event.detail.value as FieldMenuItem;

    switch (fieldMenuitem.type) {
      case FieldType.TextArea: {
        const field = new TextAreaField();
        this.configuration.fields.push(field);
        break;
      }
      default:
        throw new Error(`Unexpected field type: ${fieldMenuitem.type}`);
    }
  }

  render() {
    return html`
      <div class="toolbar">
        <vaadin-menu-bar
          class="dropdown"
          .items=${this.toolbarItems}
          @item-selected=${this.onAddField}
        ></vaadin-menu-bar>
      </div>
      <div class="fields">
        ${repeat(
          this.configuration.fields,
          field => field.id,
          field => Editor.renderField(field)
        )}
      </div>
    `;
  }

  static renderField(field: Field) {
    switch (field.type) {
      case FieldType.TextArea: {
        const textAreaField = field as TextAreaField;
        return html`<fb-textarea-field-editor
          .field=${textAreaField}
        ></fb-textarea-field-editor>`;
      }
      default:
        throw new Error(`Unexpected field type: ${field.type}`);
    }
  }
}
