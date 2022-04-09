import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import { autorun } from 'mobx';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/menu-bar';
import { Notification } from '@vaadin/notification';
import '@vaadin/button';
import {
  createConfiguration,
  createField,
  Field,
  FieldType,
  TextAreaField,
} from './model.js';
import { loadLastConfiguration, saveLastConfiguration } from './storage.js';
import './TextAreaFieldEditor.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';

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
  configuration = createConfiguration();

  protected firstUpdated(): void {
    const restoredConfiguration = loadLastConfiguration();

    if (restoredConfiguration) {
      this.configuration = restoredConfiguration;
      Notification.show('Restored configuration', { position: 'top-end' });
    }

    // Save configuration on updates
    autorun(() => {
      saveLastConfiguration(this.configuration);
    });
  }

  onAddField(event: MenuBarItemSelectedEvent) {
    const fieldMenuitem = event.detail.value as FieldMenuItem;
    const field = createField(fieldMenuitem.type);
    this.configuration.fields.push(field);
  }

  onReset() {
    ConfirmDialog.show({
      title: 'Reset Configuration',
      message: 'Do you really want to reset the configuration?',
      confirmButtonTheme: 'primary error',
      cancelButtonTheme: 'tertiary',
      onConfirm: () => {
        this.configuration = createConfiguration();
        saveLastConfiguration(this.configuration);
      },
    });
  }

  render() {
    return html`
      <div class="toolbar">
        <vaadin-menu-bar
          class="dropdown"
          .items=${this.toolbarItems}
          @item-selected=${this.onAddField}
        ></vaadin-menu-bar>
        <vaadin-button @click=${this.onReset}>Reset</vaadin-button>
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
