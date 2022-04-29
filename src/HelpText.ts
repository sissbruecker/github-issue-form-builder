import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('fb-help-text')
export class HelpText extends LitElement {
  render() {
    return html`
      <p><b>What is this?</b></p>
      <p>
        This is a visual editor for creating an issue form template for your
        Github repository. Github now allows configuring an actual form for
        reporting issues, by providing a YAML configuration file (<a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms"
          >more information here</a
        >). This tool makes it easy to get started with building a form, without
        having to understand the YAML schema, and shows you a live preview of
        how your form will look.
      </p>
      <p><b>Getting Started</b></p>
      <p>
        Simply start adding form fields, or load a preset. Then configure the
        fields to your liking. When you're done, click on create template to get
        a template that you can then configure in Github.
      </p>
    `;
  }
}
