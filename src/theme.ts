import { css } from 'lit';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';

registerStyles(
  'vaadin-details',
  css`
    :host([theme~='small']) [part~='summary-content'] {
      font-size: var(--lumo-font-size-s);
    }
    :host([theme~='small']) [part~='toggle'] {
      font-size: var(--lumo-font-size-m);
    }
  `
);
