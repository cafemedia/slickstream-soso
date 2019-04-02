import { LitElement, html, TemplateResult, customElement, property, css, CSSResult } from 'lit-element';

@customElement('soso-button')
export class SosoButton extends LitElement {
  @property({ type: Boolean }) outlined = false;
  @property({ type: Boolean }) solid = false;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      font-size: 14px;
    }
    button {
      cursor: pointer;
      outline: none;
      border-radius: 4px;
      overflow: hidden;
      color: inherit;
      user-select: none;
      position: relative;
      font-family: inherit;
      text-transform: uppercase;
      text-align: center;
      font-size: inherit;
      letter-spacing: 1.25px;
      padding: 1px 8px;
      min-height: 36px;
    }
    button.flat {
      background: none;
      border: none;
    }
    button.outlined {
      background: none;
      border: 2px solid;
      padding: 1px 10px;
    }
    button.solid {
      background: currentColor;
      border: none;
      padding: 1px 10px;
      transition: box-shadow 0.3s ease;
    }

    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: currentColor;
      opacity: 0;
    }
    button:hover::before {
      opacity: 0.05;
    }
    button:focus::before {
      opacity: 0.1;
    }
    button.solid::before {
      display: none;
    }
    button.solid:hover {
      box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.4);
    }
    button.solid:focus {
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
    }

    button.solid span {
      color: var(--soso-button-text-color, white);
    }
    button span {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    button:active span {
      transform: scale(1.03);
    }
    `;
  }

  render(): TemplateResult {
    const buttonClass = this.solid ? 'solid' : (this.outlined ? 'outlined' : 'flat');
    return html`
    <button class="${buttonClass}">
      <span>
        <slot></slot>
      </span>
    </button>`;
  }
}