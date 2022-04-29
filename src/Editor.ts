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
  isConfigurationEmpty,
  MarkdownField,
  TextAreaField,
} from './model.js';
import { loadLastConfiguration, saveLastConfiguration } from './storage.js';
import './HelpText.js';
import './MarkdownFieldEditor.js';
import './InputFieldEditor.js';
import './TextAreaFieldEditor.js';
import './CheckboxesFieldEditor.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { FieldEditorEvent } from './FieldEditor.js';
import { TemplateDialog } from './TemplateDialog.js';
import { Preset, presets } from './presets.js';

interface ToolbarMenuItem extends MenuBarItem {
  action: () => void;
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

    .toolbar > vaadin-menu-bar {
      margin-right: var(--lumo-space-s);
      flex: 1 1 auto;
      min-width: 0;
    }

    .toolbar > *:last-child {
      flex: 0 0 auto;
    }

    .fields > *:not(:last-child) {
      margin-bottom: var(--lumo-space-l);
    }
  `;

  toolbarItems = [
    {
      text: 'Add Field',
      theme: 'primary',
      children: [
        { text: 'Markdown', action: () => this.addField(FieldType.Markdown) },
        { text: 'Input', action: () => this.addField(FieldType.Input) },
        { text: 'Textarea', action: () => this.addField(FieldType.TextArea) },
        {
          text: 'Checkboxes',
          action: () => this.addField(FieldType.Checkboxes),
        },
      ] as ToolbarMenuItem[],
    },
    {
      text: 'Load Preset',
      children: presets.map(preset => ({
        text: preset.name,
        action: () => this.loadPreset(preset),
      })),
    },
    {
      text: 'Reset',
      action: () => this.reset(),
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

  addField(fieldType: FieldType) {
    runInAction(() => {
      const field = createField(this.configuration, fieldType);
      this.configuration.fields.push(field);
      this.scrollToField(field);
    });
  }

  reset() {
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

  loadPreset(preset: Preset) {
    const loadPreset = () => {
      this.configuration = cloneConfiguration(preset.configuration);
      saveLastConfiguration(this.configuration);
    };

    if (isConfigurationEmpty(this.configuration)) {
      loadPreset();
    } else {
      ConfirmDialog.show({
        title: 'Load Preset',
        message:
          'Loading a preset will remove your existing configuration. Are you sure you want to continue?',
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
          .items=${this.toolbarItems}
          @item-selected=${(event: MenuBarItemSelectedEvent) => {
            const item = event.detail.value as ToolbarMenuItem;
            item.action();
          }}
        ></vaadin-menu-bar>
        <vaadin-button theme="primary success" @click=${this.onCreateTemplate}
          >Create template</vaadin-button
        >
      </div>
      ${isConfigurationEmpty(this.configuration)
        ? html`<fb-help-text></fb-help-text>`
        : html`
            <div class="fields">
              ${repeat(
                this.configuration.fields,
                field => field.id,
                field => this.renderField(field)
              )}
            </div>
          `}
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
