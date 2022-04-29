import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MobxLitElement } from '@adobe/lit-mobx';
import '@vaadin/button';
import '@vaadin/icon';
import { Field } from './model.js';

export interface FieldEditorEvent extends CustomEvent<{ field: Field }> {}

// Reusable styles for all field editors
export const fieldEditorStyles = css`
  .width-full {
    width: 100%;
  }

  .preview-title {
    font-size: var(--lumo-font-size-xl);
    font-weight: bold;
  }

  .preview-required-indicator {
    color: var(--lumo-error-text-color);
  }

  .preview-description {
    font-size: var(--lumo-font-size-s);
    color: var(--lumo-secondary-text-color);
  }
`;

@customElement('fb-field-editor')
export class FieldEditor extends MobxLitElement {
  static styles = css`
    :host {
      display: flex;
      background: var(--lumo-base-color);
      border-radius: var(--lumo-border-radius-l);
      box-shadow: var(--lumo-box-shadow-s);
    }

    @media (max-width: 768px) {
      :host {
        flex-direction: column;
      }
    }

    .header {
      display: flex;
      align-items: baseline;
    }
    .header-content {
      font-weight: bold;
      margin-right: auto;
    }
    .header vaadin-button {
      visibility: hidden;
    }
    :host(:hover) .header vaadin-button {
      visibility: visible;
    }

    .edit-pane {
      flex: 1 1 50%;
      padding: var(--lumo-space-m);
    }

    .preview-pane {
      flex: 1 1 50%;
      padding: var(--lumo-space-m);
      background: var(--lumo-contrast-5pct);
      border-left: solid 1px var(--lumo-contrast-5pct);
    }
  `;

  @property({ attribute: false })
  field!: Field;

  onMoveUp() {
    this.dispatchEvent(
      new CustomEvent('field-editor-move-up', {
        bubbles: true,
        composed: true,
        detail: { field: this.field },
      })
    );
  }

  onMoveDown() {
    this.dispatchEvent(
      new CustomEvent('field-editor-move-down', {
        bubbles: true,
        composed: true,
        detail: { field: this.field },
      })
    );
  }

  onRemove() {
    this.dispatchEvent(
      new CustomEvent('field-editor-remove', {
        bubbles: true,
        composed: true,
        detail: { field: this.field },
      })
    );
  }

  render() {
    return html`
      <div class="edit-pane">
        <div class="header">
          <div class="header-content">
            <slot name="header"></slot>
          </div>
          <vaadin-button theme="tertiary icon" @click=${this.onMoveUp}>
            <vaadin-icon icon="lumo:arrow-up"></vaadin-icon>
          </vaadin-button>
          <vaadin-button theme="tertiary icon" @click=${this.onMoveDown}>
            <vaadin-icon icon="lumo:arrow-down"></vaadin-icon>
          </vaadin-button>
          <vaadin-button theme="tertiary icon error" @click=${this.onRemove}>
            <vaadin-icon icon="lumo:cross"></vaadin-icon>
          </vaadin-button>
        </div>
        <slot name="editor"></slot>
      </div>
      <div class="preview-pane">
        <slot name="preview"></slot>
      </div>
    `;
  }
}
