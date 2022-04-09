import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MobxLitElement } from '@adobe/lit-mobx';

// Reusable styles for all field editors
export const fieldEditorStyles = css`
    vaadin-text-area,
    vaadin-text-field {
      width: 100%;
    }

    .preview-title {
      font-size: var(--lumo-font-size-xl);
      font-weight: bold;
    }

    .preview-title-required-indicator {
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

    .header {
      font-weight: bold;
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

  render() {
    return html`
      <div class="edit-pane">
        <div class="header">
          <slot name="header"></slot>
        </div>
        <slot name="editor"></slot>
      </div>
      <div class="preview-pane">
        <slot name="preview"></slot>
      </div>
    `;
  }
}
