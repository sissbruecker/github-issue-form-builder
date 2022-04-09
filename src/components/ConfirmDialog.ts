import '@vaadin/dialog';
import { DialogOpenedChangedEvent } from '@vaadin/dialog';
import '@vaadin/button';
import { css, html, LitElement, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmButtonTheme?: string;
  cancelButtonTheme?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export class ConfirmDialog {
  static show(options: ConfirmDialogOptions) {
    const dialog = document.createElement('vaadin-dialog');
    let isConfirmed = false;

    const confirmHandler = () => {
      options.onConfirm();
      isConfirmed = true;
      dialog.opened = false;
    };

    const cancelHandler = () => {
      dialog.opened = false;
    };

    const openedChangedHandler = (event: DialogOpenedChangedEvent) => {
      if (!event.detail.value && !isConfirmed) {
        if (options.onCancel) options.onCancel();
      }
      document.body.removeChild(dialog);
    };

    dialog.renderer = root => {
      render(
        html`
          <fb-confirm-dialog-content
            .options=${options}
            .onConfirm=${confirmHandler}
            .onCancel=${cancelHandler}
          ></fb-confirm-dialog-content>
        `,
        root
      );
    };
    dialog.setAttribute('theme', 'no-padding');
    dialog.addEventListener('opened-changed', openedChangedHandler);

    document.body.appendChild(dialog);
    dialog.opened = true;
  }
}

@customElement('fb-confirm-dialog-content')
export class ConfirmDialogContent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .content {
      padding: var(--lumo-space-m);
    }

    .title {
      margin-bottom: var(--lumo-space-m);
      font-size: var(--lumo-font-size-xl);
      font-weight: bold;
    }

    .actions {
      display: flex;
      padding: var(--lumo-space-s);
      background-color: var(--lumo-contrast-10pct);
    }

    .actions > *:first-child {
      margin-right: auto;
    }
  `;

  @property()
  options!: ConfirmDialogOptions;

  @property()
  onCancel!: () => void;

  @property()
  onConfirm!: () => void;

  render() {
    return html`
      <div class="content">
        <div class="title">${this.options.title}</div>
        <div class="message">${this.options.message}</div>
      </div>
      <div class="actions">
        <vaadin-button
          theme=${this.options.cancelButtonTheme || ''}
          @click=${this.onCancel}
          >Cancel</vaadin-button
        >
        <vaadin-button
          theme=${this.options.confirmButtonTheme || ''}
          @click=${this.onConfirm}
          >Confirm</vaadin-button
        >
      </div>
    `;
  }
}
