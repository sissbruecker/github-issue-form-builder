import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import { autorun, runInAction } from 'mobx';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/menu-bar';
import { Notification } from '@vaadin/notification';
import '@vaadin/button';
import {
  CheckboxesField,
  cloneConfiguration,
  createConfiguration,
  createField,
  Field,
  FieldType,
  InputField,
  MarkdownField,
  TextAreaField,
} from './model.js';
import { loadLastConfiguration, saveLastConfiguration } from './storage.js';
import './MarkdownFieldEditor.js';
import './InputFieldEditor.js';
import './TextAreaFieldEditor.js';
import './CheckboxesFieldEditor.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { FieldEditorEvent } from './FieldEditor.js';
import { TemplateDialog } from './TemplateDialog.js';
import { Preset, presets } from './presets.js';

interface FieldMenuItem extends MenuBarItem {
  type: FieldType;
}

interface PresetMenuItem extends MenuBarItem {
  preset: Preset;
}

@customElement('fb-editor')
export class Editor extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
    }

    .toolbar {
      display: flex;
      align-items: baseline;
      padding: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-l);
      border-radius: var(--lumo-border-radius-l);
      background: var(--lumo-base-color);
      box-shadow: var(--lumo-box-shadow-s);
    }

    .toolbar > *:not(:last-child) {
      margin-right: var(--lumo-space-s);
    }

    .toolbar > *:last-child {
      margin-left: auto;
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
        { text: 'Markdown', type: FieldType.Markdown },
        { text: 'Input', type: FieldType.Input },
        { text: 'Textarea', type: FieldType.TextArea },
        { text: 'Checkboxes', type: FieldType.Checkboxes },
      ] as FieldMenuItem[],
    },
  ];

  presetItems = [
    {
      text: 'Load Preset',
      children: presets.map(preset => ({
        text: preset.name,
        preset,
      })),
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
    runInAction(() => {
      const fieldMenuitem = event.detail.value as FieldMenuItem;
      const field = createField(this.configuration, fieldMenuitem.type);
      this.configuration.fields.push(field);
      this.scrollToField(field);
    });
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

  onLoadPreset(event: MenuBarItemSelectedEvent) {
    const presetMenuItem = event.detail.value as PresetMenuItem;

    const loadPreset = () => {
      this.configuration = cloneConfiguration(
        presetMenuItem.preset.configuration
      );
      saveLastConfiguration(this.configuration);
    };

    if (this.configuration.fields.length === 0) {
      loadPreset();
    } else {
      ConfirmDialog.show({
        title: 'Load Preset',
        message:
          'Loading a preset configuration will remove your existing configuration. Are you sure you want to go ahead?',
        confirmButtonTheme: 'primary error',
        cancelButtonTheme: 'tertiary',
        onConfirm: loadPreset,
      });
    }
  }

  onCreateTemplate() {
    TemplateDialog.show(this.configuration);
  }

  onFieldEditorMoveUp(e: FieldEditorEvent) {
    const index = this.configuration.fields.indexOf(e.detail.field);
    if (index < 1) return;
    runInAction(() => {
      this.configuration.fields.splice(index, 1);
      this.configuration.fields.splice(index - 1, 0, e.detail.field);
      this.scrollToField(e.detail.field);
    });
  }

  onFieldEditorMoveDown(e: FieldEditorEvent) {
    const index = this.configuration.fields.indexOf(e.detail.field);
    if (index < 0 || index > this.configuration.fields.length - 2) return;
    runInAction(() => {
      this.configuration.fields.splice(index, 1);
      this.configuration.fields.splice(index + 1, 0, e.detail.field);
      this.scrollToField(e.detail.field);
    });
  }

  onFieldEditorRemove(e: FieldEditorEvent) {
    const index = this.configuration.fields.indexOf(e.detail.field);
    if (index < 0) return;
    runInAction(() => {
      this.configuration.fields.splice(index, 1);
    });
  }

  scrollToField(field: Field) {
    setTimeout(() => {
      const element = this.shadowRoot!.querySelector(
        `[data-field-id="${field.id}"]`
      );
      element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
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
        <vaadin-menu-bar
          class="dropdown"
          .items=${this.presetItems}
          @item-selected=${this.onLoadPreset}
        ></vaadin-menu-bar>
        <vaadin-button theme="primary success" @click=${this.onCreateTemplate}
          >Create template</vaadin-button
        >
      </div>
      <div class="fields">
        ${repeat(
          this.configuration.fields,
          field => field.id,
          field => this.renderField(field)
        )}
      </div>
    `;
  }

  renderField(field: Field) {
    switch (field.type) {
      case FieldType.Markdown: {
        const markdownField = field as MarkdownField;
        return html`<fb-markdown-field-editor
          .field=${markdownField}
          data-field-id=${field.id}
          @field-editor-move-up=${this.onFieldEditorMoveUp}
          @field-editor-move-down=${this.onFieldEditorMoveDown}
          @field-editor-remove=${this.onFieldEditorRemove}
        ></fb-markdown-field-editor>`;
      }
      case FieldType.Input: {
        const inputField = field as InputField;
        return html`<fb-input-field-editor
          .field=${inputField}
          data-field-id=${field.id}
          @field-editor-move-up=${this.onFieldEditorMoveUp}
          @field-editor-move-down=${this.onFieldEditorMoveDown}
          @field-editor-remove=${this.onFieldEditorRemove}
        ></fb-input-field-editor>`;
      }
      case FieldType.TextArea: {
        const textAreaField = field as TextAreaField;
        return html`<fb-textarea-field-editor
          .field=${textAreaField}
          data-field-id=${field.id}
          @field-editor-move-up=${this.onFieldEditorMoveUp}
          @field-editor-move-down=${this.onFieldEditorMoveDown}
          @field-editor-remove=${this.onFieldEditorRemove}
        ></fb-textarea-field-editor>`;
      }
      case FieldType.Checkboxes: {
        const checkboxesField = field as CheckboxesField;
        return html`<fb-checkboxes-field-editor
          .field=${checkboxesField}
          data-field-id=${field.id}
          @field-editor-move-up=${this.onFieldEditorMoveUp}
          @field-editor-move-down=${this.onFieldEditorMoveDown}
          @field-editor-remove=${this.onFieldEditorRemove}
        ></fb-checkboxes-field-editor>`;
      }
      default:
        throw new Error(`Unexpected field type: ${field.type}`);
    }
  }
}
