import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../../src/components/shared/confirm-dialog.js';
import i18nService from '../../../src/i18n/i18n-service.js';

describe('ConfirmDialog', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
  });

  it('renders with default properties', () => {
    expect(element.show).to.be.false;
    expect(element.title).to.equal('');
    expect(element.message).to.equal('');
    expect(element.confirmText).to.equal(i18nService.t('proceed'));
    expect(element.cancelText).to.equal(i18nService.t('cancel'));
  });

  it('does not render dialog when show is false', () => {
    const dialog = element.shadowRoot.querySelector('.modal-backdrop');
    expect(dialog).to.be.null;
  });

  it('renders dialog when show is true', async () => {
    element.show = true;
    await element.updateComplete;
    
    const dialog = element.shadowRoot.querySelector('.modal-backdrop');
    expect(dialog).to.exist;
    
    const title = element.shadowRoot.querySelector('.modal-title');
    expect(title).to.exist;
    expect(title.textContent).to.equal('');
    
    const message = element.shadowRoot.querySelector('.modal-body p');
    expect(message).to.exist;
    expect(message.textContent).to.equal('');
    
    const cancelButton = element.shadowRoot.querySelector('button.secondary');
    expect(cancelButton).to.exist;
    expect(cancelButton.textContent).to.equal(i18nService.t('cancel'));
    
    const confirmButton = element.shadowRoot.querySelector('button.primary');
    expect(confirmButton).to.exist;
    expect(confirmButton.textContent).to.equal(i18nService.t('proceed'));
  });

  it('renders with custom properties', async () => {
    element.show = true;
    element.title = 'Test Title';
    element.message = 'Test Message';
    element.confirmText = 'Yes';
    element.cancelText = 'No';
    
    await element.updateComplete;
    
    const title = element.shadowRoot.querySelector('.modal-title');
    expect(title.textContent).to.equal('Test Title');
    
    const message = element.shadowRoot.querySelector('.modal-body p');
    expect(message.textContent).to.equal('Test Message');
    
    const cancelButton = element.shadowRoot.querySelector('button.secondary');
    expect(cancelButton.textContent).to.equal('No');
    
    const confirmButton = element.shadowRoot.querySelector('button.primary');
    expect(confirmButton.textContent).to.equal('Yes');
  });

  it('fires confirm event and hides dialog when confirm button is clicked', async () => {
    element.show = true;
    await element.updateComplete;
    
    const confirmHandler = stub();
    element.addEventListener('confirm', confirmHandler);
    
    const confirmButton = element.shadowRoot.querySelector('button.primary');
    confirmButton.click();
    
    expect(confirmHandler.calledOnce).to.be.true;
    expect(element.show).to.be.false;
    
    await element.updateComplete;
    
    const dialog = element.shadowRoot.querySelector('.modal-backdrop');
    expect(dialog).to.be.null;
  });

  it('fires cancel event and hides dialog when cancel button is clicked', async () => {
    element.show = true;
    await element.updateComplete;
    
    const cancelHandler = stub();
    element.addEventListener('cancel', cancelHandler);
    
    const cancelButton = element.shadowRoot.querySelector('button.secondary');
    cancelButton.click();
    
    expect(cancelHandler.calledOnce).to.be.true;
    expect(element.show).to.be.false;
    
    await element.updateComplete;
    
    const dialog = element.shadowRoot.querySelector('.modal-backdrop');
    expect(dialog).to.be.null;
  });

  it('updates texts when language changes', async () => {
    element.show = true;
    await element.updateComplete;
    
    // Orijinal dil metinlerini kontrol et
    const originalConfirmText = element.confirmText;
    const originalCancelText = element.cancelText;
    
    // Dil değişikliği olayını tetikle
    const newLanguage = element.language === 'tr' ? 'en' : 'tr';
    
    // i18nService.t fonksiyonunu stub'la
    const tStub = stub(i18nService, 't');
    tStub.withArgs('proceed').returns('Yeni Onay');
    tStub.withArgs('cancel').returns('Yeni İptal');
    
    // Dil değişikliği olayını tetikle
    window.dispatchEvent(new CustomEvent('language-changed', { detail: newLanguage }));
    
    await element.updateComplete;
    
    // Yeni dil metinlerini kontrol et
    expect(element.language).to.equal(newLanguage);
    expect(i18nService.t.calledWith('proceed')).to.be.true;
    expect(i18nService.t.calledWith('cancel')).to.be.true;
    
    // Stub'ı temizle
    i18nService.t.restore();
  });
});
