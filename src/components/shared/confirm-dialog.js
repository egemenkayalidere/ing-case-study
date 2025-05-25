import { LitElement, html, css } from 'lit';
import i18nService from '../../i18n/i18n-service.js';

export class ConfirmDialog extends LitElement {
  static properties = {
    show: { type: Boolean },
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    language: { type: String } // Dil değişikliğini izlemek için eklendi
  };

  constructor() {
    super();
    this.show = false;
    this.title = '';
    this.message = '';
    this.confirmText = i18nService.t('proceed');
    this.cancelText = i18nService.t('cancel');
    this.language = i18nService.language; // Mevcut dili ayarla
    
    // Dil değişikliği olayını dinle
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Dil değişikliği olayını dinlemeye başla
    window.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Olay dinleyicisini temizle
    window.removeEventListener('language-changed', this.handleLanguageChange);
  }
  
  handleLanguageChange(event) {
    this.language = event.detail; // Yeni dili ayarla
    
    // Çeviri metinlerini güncelle
    this.confirmText = i18nService.t('proceed');
    this.cancelText = i18nService.t('cancel');
    
    this.requestUpdate(); // Bileşeni yeniden render et
  }
  
  confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.show = false;
  }

  cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.show = false;
  }

  static styles = css`
    :host {
      display: block;
    }
    
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .modal-body {
      margin-bottom: 20px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    button {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
    }
    
    button.primary {
      background-color: var(--primary-color);
      color: white;
      border: none;
    }
    
    button.secondary {
      background-color: white;
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }
    
    button.primary:hover {
      background-color: #e55800;
    }
    
    button.secondary:hover {
      background-color: #f1f1f1;
    }
  `;

  render() {
    if (!this.show) return html``;
    
    return html`
      <div class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${this.title}</div>
          </div>
          <div class="modal-body">
            <p>${this.message}</p>
          </div>
          <div class="modal-footer">
            <button class="secondary" @click=${this.cancel}>${this.cancelText}</button>
            <button class="primary" @click=${this.confirm}>${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
