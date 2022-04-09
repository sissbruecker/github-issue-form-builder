import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TextAreaField } from './model.js';
import './TextAreaFieldEditor.js';
import '@vaadin/menu-bar';

@customElement('fb-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .toolbar {
      padding: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-l);
      border-radius: var(--lumo-border-radius-l);
      background: var(--lumo-base-color);
      box-shadow: var(--lumo-box-shadow-s);
    }
  `;

    toolbarItems = [
      {
      text: "Add",
      theme: "primary",
      children: [
        {text: 'Markdown'},
        {text: 'Input'},
        {text: 'TextArea'},
        {text: 'Checkbox'},
      ]
      },
    ]

  render() {
    return html`
    <div class="toolbar">
    <vaadin-menu-bar class="dropdown" .items=${this.toolbarItems}></vaadin-menu-bar>
    </div>
    <div class="fields">
    <fb-textarea-field .field=${new TextAreaField()}></fb-textarea-field>
    </div>
      
    `;
  }
}
