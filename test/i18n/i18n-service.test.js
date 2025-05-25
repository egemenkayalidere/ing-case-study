import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import i18nService from '../../src/i18n/i18n-service.js';
import { translations } from '../../src/i18n/translations.js';

describe('I18nService', () => {
  let originalLanguage;
  let dispatchEventStub;
  
  beforeEach(() => {
    // Save original language
    originalLanguage = i18nService.language;
    
    // Stub window.dispatchEvent
    dispatchEventStub = stub(window, 'dispatchEvent');
    
    // Stub localStorage
    stub(localStorage, 'getItem').returns('tr');
    stub(localStorage, 'setItem');
  });
  
  afterEach(() => {
    // Restore original language
    i18nService.language = originalLanguage;
    
    // Restore stubs
    window.dispatchEvent.restore();
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });
  
  it('initializes with default language from localStorage', () => {
    expect(i18nService.language).to.equal('tr');
  });
  
  it('changes language correctly', () => {
    i18nService.language = 'en';
    
    expect(i18nService.language).to.equal('en');
    expect(localStorage.setItem.calledWith('language', 'en')).to.be.true;
    expect(dispatchEventStub.calledOnce).to.be.true;
    
    const event = dispatchEventStub.firstCall.args[0];
    expect(event.type).to.equal('language-changed');
    expect(event.detail).to.equal('en');
  });
  
  it('throws error for unsupported language', () => {
    expect(() => { i18nService.language = 'de'; }).to.throw('Desteklenmeyen dil');
  });
  
  it('translates keys correctly', () => {
    // Test Turkish translation
    i18nService.language = 'tr';
    expect(i18nService.t('employeeList')).to.equal(translations.tr.employeeList);
    expect(i18nService.t('firstName')).to.equal(translations.tr.firstName);
    
    // Test English translation
    i18nService.language = 'en';
    expect(i18nService.t('employeeList')).to.equal(translations.en.employeeList);
    expect(i18nService.t('firstName')).to.equal(translations.en.firstName);
  });
  
  it('returns key as fallback for missing translations', () => {
    const nonExistentKey = 'nonExistentKey';
    expect(i18nService.t(nonExistentKey)).to.equal(nonExistentKey);
  });
});
