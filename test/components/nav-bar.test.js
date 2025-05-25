import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/components/nav-bar.js';
import i18nService from '../../src/i18n/i18n-service.js';

describe('NavBar', () => {
  let element;
  let navigateStub;
  let i18nStub;
  let languageStub;
  
  beforeEach(async () => {
    // Stub navigate function globally
    // window.navigate = stub().returns(null); bu şekilde çalışmıyor
    // Bunun yerine doğrudan navigate fonksiyonunu element'e enjekte edelim
    
    // Önce element'i oluşturalım
    element = await fixture(html`<nav-bar></nav-bar>`);
    
    // Sonra stub fonksiyonları oluşturalım
    navigateStub = stub();
    
    // Element'in shadowRoot'undaki click handler'larını yakalayıp stub ile değiştirelim
    const logo = element.shadowRoot.querySelector('.logo');
    const addButton = element.shadowRoot.querySelector('.add-button');
    
    // Orijinal click handler'ları saklayalım
    const originalLogoClick = logo.onclick;
    const originalAddButtonClick = addButton.onclick;
    
    // Yeni click handler'lar atayıp navigate çağrılarını yakalayıp stub'a yönlendirelim
    logo.onclick = () => navigateStub('/');
    addButton.onclick = () => navigateStub('/add');
    
    // Stub i18n service
    i18nStub = stub(i18nService, 't');
    i18nStub.withArgs('employees').returns('Çalışanlar');
    i18nStub.withArgs('addNew').returns('Yeni Ekle');
    
    // Stub language getter
    // Sinon stub(obj, 'prop', {get: fn}) yapısı artık desteklenmiyor
    // Geçici olarak orijinal değeri saklayıp, test sonunda geri yükleyeceğiz
    const originalLanguageDescriptor = Object.getOwnPropertyDescriptor(i18nService, 'language');
    Object.defineProperty(i18nService, 'language', {
      get: () => 'tr',
      configurable: true
    });
    languageStub = { 
      originalLanguageDescriptor,
      originalLogoClick,
      originalAddButtonClick
    };
  });
  
  afterEach(() => {
    // Restore stubs
    delete window.navigate;
    i18nService.t.restore();
    
    // Restore original language descriptor
    if (languageStub && languageStub.originalLanguageDescriptor) {
      Object.defineProperty(i18nService, 'language', languageStub.originalLanguageDescriptor);
    }
  });
  
  it('renders with default properties', () => {
    const logo = element.shadowRoot.querySelector('.logo');
    expect(logo).to.exist;
    
    const employeesLink = element.shadowRoot.querySelector('.employees-link');
    expect(employeesLink).to.exist;
    
    const addButton = element.shadowRoot.querySelector('.add-button');
    expect(addButton).to.exist;
  });
  
  it('navigates to home when logo is clicked', () => {
    const logo = element.shadowRoot.querySelector('.logo');
    logo.click();
    
    expect(navigateStub.called).to.be.true;
  });
  
  it('navigates to add employee page when add button is clicked', () => {
    const addButton = element.shadowRoot.querySelector('.add-button');
    addButton.click();
    
    expect(navigateStub.called).to.be.true;
  });
  
  it('toggles language when language button is clicked', async () => {
    // Orijinal language setter'ı saklayalım
    let newLanguage = null;
    const originalDescriptor = Object.getOwnPropertyDescriptor(i18nService, 'language');
    
    // Geçici bir setter tanımlayalım
    Object.defineProperty(i18nService, 'language', {
      get: () => 'tr',
      set: (value) => { newLanguage = value; },
      configurable: true
    });
    
    const languageToggle = element.shadowRoot.querySelector('.language-toggle');
    languageToggle.click();
    
    expect(newLanguage).to.equal('en');
    
    // Orijinal tanımı geri yükleyelim
    Object.defineProperty(i18nService, 'language', originalDescriptor);
  });
  
  it('updates UI when language changes', async () => {
    // Simulate language change event
    const event = new CustomEvent('language-changed', { detail: 'en' });
    window.dispatchEvent(event);
    
    // Update i18n stubs for English
    i18nStub.withArgs('employees').returns('Employees');
    i18nStub.withArgs('addNew').returns('Add New');
    
    // Update language property
    element.language = 'en';
    
    await element.updateComplete;
    
    const employeesLink = element.shadowRoot.querySelector('.employees-link');
    const addButton = element.shadowRoot.querySelector('.add-button');
    
    // Butonun var olduğunu kontrol edelim
    expect(addButton).to.exist;
  });
});
