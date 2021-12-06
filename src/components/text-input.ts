import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { property, query } from 'lit/decorators';
import { flex } from '../styles/flex';
import { element } from '../registry';

@element('soso-text-input')
export class SosoTextInput extends LitElement {
  @property() label = '';
  @property() type = 'text';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) minimal = false;
  @property({ type: String }) autocomplete = '';
  @property() placeholder = '';

  @query('#container') private container?: HTMLDivElement;
  @query('input') input?: HTMLInputElement;

  private pendingValue?: string;

  static get styles(): CSSResultGroup {
    return [
      flex,
      css`
        :host {
          display: inline-block;
          width: 240px;
          color: #000;
          --soso-border-color: rgba(0,0,0,0.24);
          --soso-text-input-highlight: var(--soso-highlight-color, #6200ee);
          --soso-text-input-border: 1px solid;
        }
        #container {
          position: relative;
          display: -ms-flexbox;
          display: flex;
          height: 56px;
          width: 100%;
          box-sizing: border-box;
        }
        input {
          font-family: Roboto, system-ui, sans-serif;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-size: 1em;
          line-height: 1.75em;
          font-weight: 400;
          letter-spacing: .009375em;
          text-decoration: inherit;
          text-transform: inherit;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
          background: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: none;
          -ms-flex-item-align: end;
          align-self: flex-end;
          color: var(--soso-input-color, rgba(0,0,0,.87));
          display: flex;
          padding: 12px 16px 14px;
          background-color: transparent;
        }
        #overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          pointer-events: none;
        }
        #leftOverlay {
          width: 12px;
          border: var(--soso-text-input-border);
          border-radius: 4px 0 0 4px;
          border-right: none;
          border-color: var(--soso-border-color);
          box-sizing: border-box;
        }
        #rightOverlay {
          border: var(--soso-text-input-border);
          border-radius: 0 4px 4px 0;
          border-left: none;
          border-color: var(--soso-border-color);
          box-sizing: border-box;
        }
        #midOverlay {
          border: var(--soso-text-input-border);
          border-left: none;
          border-right: none;
          position: relative;
          border-color: var(--soso-border-color);
          padding-right: 8px;
        }
        #midOverlay.empty {
          padding-right: 0;
        }
        #midOverlay span {
          opacity: 0;
          font-size: 0.75em;
          white-space: nowrap;
        }
        label {
          position: absolute;
          left: 0;
          top: 17px;
          opacity: 0.6;
          font-size: 1em;
          line-height: 1;
          transition: transform .15s cubic-bezier(.4,0,.2,1);
          white-space: nowrap;
        }
        #container.focussed {
          --soso-border-color: var(--soso-text-input-highlight, #000);
          --soso-text-input-border: 2px solid;
          color: var(--soso-border-color);
        }
        #container.focussed label {
          transform: translateX(-4px) translateY(-26px) scale(0.75);
          opacity: 1;
        }
        #container.focussed #midOverlay {
          border-top: none;
        }
        #container.notched label {
          transform: translateX(-4px) translateY(-26px) scale(0.75);
        }
        #container.notched #midOverlay {
          border-top: none;
        }

        #container.minimal #leftOverlay {
          display: none;
        }
        #container.minimal #rightOverlay {
          display: none;
        }
        #container.minimal #midOverlay {
          border: none;
        }
        #container.minimal #overlay {
          border-radius: 0;
          border: var(--soso-text-input-border);
          border-left: none;
          border-top: none;
          border-right: none;
        }
        #container.minimal input {
          padding: 12px 8px 14px;
        }
        #container.minimal label {
          transform: translateX(8px);
        }
        #container.minimal.notched label {
          transform: translateX(-4px) translateY(-26px) scale(0.75);
        }
        #container.minimal.focussed label {
          transform: translateX(-4px) translateY(-26px) scale(0.75);
          opacity: 1;
        }

        @media (hover: hover) {
          #container:hover {
            --soso-border-color: rgba(0,0,0,0.65);
          }
          #container.focussed {
            --soso-border-color: var(--soso-text-input-highlight, #000);
            --soso-text-input-border: 2px solid;
            color: var(--soso-border-color);
          }
        }
      `
    ];
  }

  render(): TemplateResult {
    const midOverlayClass = (this.label || '').trim() ? '' : 'empty';
    return html`
    <div id="container" class="${this.minimal ? 'minimal' : ''}">
      <input type="${this.type}" ?disabled="${this.disabled}" autocomplete="${this.autocomplete}" placeholder="${this.placeholder}" @focus="${this.onFocus}" @blur="${this.onBlur}" @input="${this.onInput}">
      <div id="overlay" class="horizontal layout">
        <div id="leftOverlay"></div>
        <div id="midOverlay" class="${midOverlayClass}">
          <span>${this.label}</span>
          <label>${this.label}</label>
        </div>
        <div id="rightOverlay" class="flex"></div>
      </div>
    </div>
    `;
  }

  focus() {
    if (this.shadowRoot) {
      const btn = this.shadowRoot.querySelector('input');
      if (btn) {
        btn.focus();
      }
    }
  }

  firstUpdated() {
    if (this.pendingValue) {
      this.input!.value = this.pendingValue;
      this.pendingValue = undefined;
      this.onInput();
    }
  }

  private onInput() {
    const text = this.input!.value;
    if (text) {
      this.container!.classList.add('notched');
    } else {
      this.container!.classList.remove('notched');
    }
  }

  private onFocus() {
    this.container!.classList.add('focussed');
  }

  private onBlur() {
    this.container!.classList.remove('focussed');
  }

  get value(): string {
    if (this.input) {
      return this.input.value;
    } else if (this.pendingValue !== undefined) {
      return this.pendingValue;
    }
    return '';
  }

  set value(v: string) {
    if (this.input) {
      this.input.value = v;
      this.onInput();
    } else {
      this.pendingValue = v;
    }
  }
}