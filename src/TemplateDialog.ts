import { css, html, LitElement, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { autorun } from 'mobx';
import { Configuration } from './model.js';
import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/icon';
import { yaml } from './yaml.js';

export class TemplateDialog {
  static show(configuration: Configuration) {
    const dialog = document.createElement('vaadin-dialog');

    const closeHandler = () => {
      dialog.opened = false;
    };

    const openedChangedHandler = () => {
      if (dialog.opened) return;
      document.body.removeChild(dialog);
    };

    dialog.renderer = root => {
      render(
        html`
          <fb-template-dialog-content
            .configuration=${configuration}
            .onClose=${closeHandler}
          ></fb-template-dialog-content>
        `,
        root
      );
    };
    dialog.opened = true;
    dialog.setAttribute('theme', 'no-padding');
    dialog.addEventListener('opened-changed', openedChangedHandler);
    document.body.appendChild(dialog);
  }
}

@customElement('fb-template-dialog-content')
export class TemplateDialogContent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header {
      flex: 0 0 auto;
      display: flex;
      padding: var(--lumo-space-m) var(--lumo-space-m) 0 var(--lumo-space-m);
    }

    .header h2 {
      margin: 0;
      flex: 1 1 auto;
    }

    .header .close-button {
      margin: 0;
      flex: 0 0 auto;
    }

    .content {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 0 var(--lumo-space-m) var(--lumo-space-m) var(--lumo-space-m);
    }

    .content pre {
      flex: 1 1 auto;
      padding: var(--lumo-space-s);
      background-color: var(--lumo-contrast-10pct);
      border-radius: var(--lumo-border-radius-l);
      overflow-y: auto;
    }
  `;

  @property({ attribute: false })
  configuration!: Configuration;

  @property({ attribute: false })
  onClose!: () => void;

  @state()
  configurationYaml: string = '';

  protected firstUpdated(): void {
    autorun(() => {
      this.configurationYaml = yaml(this.configuration);
    });
  }

  render() {
    return html`
      <div class="header">
        <h2>Issue Template</h2>
        <vaadin-button
          class="close-button"
          theme="tertiary icon"
          @click=${this.onClose}
        >
          <vaadin-icon icon="lumo:cross"></vaadin-icon>
        </vaadin-button>
      </div>
      <div class="content">
        <p>
          To use this template in your repository, copy the configuration below,
          and paste it into a new <code>.yaml</code> file into your
          repositories' <code>.github/ISSUE_TEMPLATE</code> folder. Optionally,
          change the template name from <code>Bug Report</code> to something
          more appropriate. See the
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms"
            >Github documentation</a
          >
          for more information.
        </p>
        <pre><code>${this.configurationYaml}</code></pre>
      </div>
    `;
  }
}
