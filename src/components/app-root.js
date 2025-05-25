import { LitElement, html, css } from 'lit';
import { initRouter } from '../utils/router.js';
import i18nService from '../i18n/i18n-service.js';

export class AppRoot extends LitElement {
  static properties = {
    language: { type: String },
    route: { type: Object }
  };

  constructor() {
    super();
    this.language = i18nService.language;
    
    // Dil değişikliği olayını dinle
    this.languageChangedHandler = this.handleLanguageChanged.bind(this);
    window.addEventListener('language-changed', this.languageChangedHandler);
  }

  firstUpdated() {
    // Router'ı başlat
    const outlet = this.renderRoot.querySelector('#outlet');
    if (outlet) {
      this.router = initRouter(outlet);
      console.log('Router initialized', this.router);
    } else {
      console.error('Outlet element not found');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.languageChangedHandler);
  }

  handleLanguageChanged(event) {
    this.language = event.detail;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--text-color);
      min-height: 100vh;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    
    #outlet {
      display: block;
    }
  `;

  render() {
    return html`
      <div class="app-container">
        <nav-bar .language=${this.language}></nav-bar>
        <div class="content">
          <div id="outlet"></div>
        </div>
      </div>
    `;
  }
}
