import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { property, query } from 'lit/decorators';
import { fire } from '../utils/ui-utils';
import { element } from '../registry';

export interface PageElement extends HTMLElement {
  onActivate(): void;
  onDeactivate(): void;
}

@element('soso-selector')
export class SosoSelector extends LitElement {
  @property({ type: String }) selected?: string;
  @property({ type: String }) default: string = 'home';

  @query('slot')
  private slotElement?: HTMLElement;

  private pages: HTMLElement[] = [];
  private pageMap = new Map<string, HTMLElement>();
  private current?: PageElement;

  set selectedForced(value: string) {
    this.selected = value;
    this.requestUpdate();
  }

  static get styles(): CSSResultGroup {
    return css`
    :host {
      display: contents;
    }

    .hidden {
      display: none !important;
    }
  
    ::slotted(.hidden) {
      display: none !important;
    }

    :host ::slotted(.hidden) {
      display: none !important;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <slot id="slot" @slotchange="${this.mapPages}"></slot>
    `;
  }

  private mapPages() {
    this.pages = [];
    this.pageMap.clear();
    if (this.slotElement) {
      const assigned = (this.slotElement as HTMLSlotElement).assignedNodes();
      if (assigned && assigned.length) {
        for (let i = 0; i < assigned.length; i++) {
          const n = assigned[i];
          if (n.nodeType === Node.ELEMENT_NODE) {
            const e = n as HTMLElement;
            this.pages.push(e);
            const name = e.getAttribute('name') || '';
            if (name) {
              name.trim().split(' ').forEach((nameSegment) => {
                if (nameSegment) {
                  this.pageMap.set(nameSegment, e);
                }
              });
            }
          }
        }
      }
    }
    this.updated();
  }

  firstUpdated() {
    this.mapPages();
  }

  updated() {
    const newPage = this.getElement();
    const samePage = newPage === this.current;
    if (this.current && (!samePage) && this.current.onDeactivate) {
      try {
        this.current.onDeactivate();
      } catch (err) { console.error(err); }
    }
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      if (p === newPage as any) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    }
    this.current = newPage || undefined;
    if (this.current && this.current.onActivate) {
      try {
        this.current.onActivate();
      } catch (err) { console.error(err); }
    }
    if (this.current) {
      fire(this, 'node-select', { node: this.current }, false);
    }
  }

  private getElement(): PageElement | null {
    let e: HTMLElement | undefined = undefined;
    if (this.selected) {
      e = this.pageMap.get(this.selected);
    }
    if ((!e) && this.default) {
      e = this.pageMap.get(this.default);
    }
    if (e) {
      return e as PageElement;
    }
    return null;
  }
}