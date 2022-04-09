import './setup-env.js';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import './Editor.js';
import { lumoStyles } from './lumo.js';
import './theme.js';

@customElement('fb-app')
export class App extends LitElement {
  static styles = [
    lumoStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--lumo-contrast-20pct);
        padding: var(--lumo-space-l);
      }

      header {
        flex: 0 0 auto;
        margin-bottom: var(--lumo-space-l);
      }

      h1 {
        margin: 0;
        padding: 0;
        font-size: var(--lumo-font-size-xxl);
        text-shadow: 1px 1px 1px #ffffff;
      }

      main {
        flex: 1 1 0;
      }
    `,
  ];

  render() {
    return html`
      <header>
        <h1>Github Issue Form Builder</h1>
      </header>
      <main>
        <fb-editor></fb-editor>
      </main>
    `;
  }
}
