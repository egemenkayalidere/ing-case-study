import { LitElement, html, css } from 'lit';
import { navigate } from '../utils/router.js';
import i18nService from '../i18n/i18n-service.js';

export class NavBar extends LitElement {
  static properties = {
    language: { type: String }
  };

  constructor() {
    super();
    this.language = i18nService.language;
  }

  toggleLanguage() {
    const newLanguage = this.language === 'tr' ? 'en' : 'tr';
    i18nService.language = newLanguage;
  }

  static styles = css`
    :host {
      display: block;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid var(--border-color);
    }
    
    .navbar-container {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 0 24px;
    }
    
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      width: 100%;
      max-width: 1280px;
      padding: 0;
      margin: 0 auto;
    }
    
    .left-section {
      display: flex;
      align-items: center;
    }
    
    .right-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .ing-logo {
      height: 32px;
      width: auto;
    }
    
    .nav-item {
      cursor: pointer;
      color: var(--text-color);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .employee-icon {
      color: var(--ing-orange);
      font-size: 16px;
    }
    
    .employees-text {
      color: var(--ing-orange);
      font-weight: 500;
      font-size: 15px;
      margin-left: 4px;
    }
    
    .employees-link {
      color: var(--ing-orange);
    }
    
    .nav-item:hover {
      opacity: 0.9;
    }
    
    .language-toggle {
      background-color: transparent;
      border: none;
      color: var(--text-color);
      padding: 0;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .language-toggle:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    
    .add-button {
      background-color: transparent;
      border: none;
      color: var(--ing-orange);
      padding: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .add-icon {
      font-size: 16px;
      font-weight: 500;
    }
    
    .add-button:hover {
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .employees-text {
        display: none;
      }
    }
  `;

  render() {
    return html`
      <div class="navbar-container">
        <div class="navbar">
          <div class="left-section">
            <div class="logo" @click=${() => navigate('/')}>
              <img src="/src/assets/images/ing-logo.png" alt="ING Logo" class="ing-logo" />
            </div>
          </div>
          
          <div class="right-section">
            <div class="nav-item employees-link" @click=${() => navigate('/')}>
              <span class="employee-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span class="employees-text">${i18nService.t('employees')}</span>
            </div>
            
            <button class="add-button" @click=${() => { navigate('/add'); }}>
              <span class="add-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
              <span>${i18nService.t('addNew')}</span>
            </button>
            
            <button class="language-toggle" @click=${this.toggleLanguage}>
              ${this.language === 'tr' ? '🇬🇧' : '🇹🇷'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('nav-bar', NavBar);
