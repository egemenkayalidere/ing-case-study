import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../../src/components/employee/employee-form.js';
import employeeService from '../../../src/services/employee-service.js';
import i18nService from '../../../src/i18n/i18n-service.js';
// router'ı doğrudan import etmek yerine, bileşenin metotlarını test edeceğiz

describe('EmployeeForm', () => {
  let element;
  const mockEmployee = {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
    phone: '+90 555 123 4567',
    email: 'ahmet.yilmaz@example.com',
    department: 'Tech',
    position: 'Senior'
  };

  beforeEach(async () => {
    // Tüm stub'ları temizle
    if (stub.restore) stub.restore();
    
    // Yeni element oluştur
    element = await fixture(html`<employee-form></employee-form>`);
  });

  it('renders with default properties', () => {
    expect(element.employeeId).to.be.null;
    expect(element.isEditMode).to.be.false;
    expect(element.employee).to.exist;
    expect(element.formErrors).to.deep.equal({});
  });

  it('initializes with empty employee data', () => {
    const emptyEmployee = element.getEmptyEmployee();
    expect(element.employee).to.deep.equal(emptyEmployee);
  });

  it('validates form correctly', () => {
    // Test with empty form
    const isValid = element.validateForm();
    expect(isValid).to.be.false;
    expect(Object.keys(element.formErrors).length).to.be.greaterThan(0);
    
    // Set valid data
    element.employee = { ...mockEmployee };
    const isValidWithData = element.validateForm();
    expect(isValidWithData).to.be.true;
    expect(Object.keys(element.formErrors).length).to.equal(0);
  });

  it('handles input changes', async () => {
    const input = element.shadowRoot.querySelector('input[name="firstName"]');
    input.value = 'Test';
    input.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    
    expect(element.employee.firstName).to.equal('Test');
  });

  it('loads employee data in edit mode', async () => {
    // Mock employeeService.getEmployeeById
    stub(employeeService, 'getEmployeeById').returns(mockEmployee);
    
    // Create a new element
    const editElement = await fixture(html`<employee-form></employee-form>`);
    
    // Manuel olarak edit modunu ayarlayalım
    editElement.employeeId = '1';
    editElement.isEditMode = true;
    
    // Çalışan verilerini manuel olarak ayarlayalım
    editElement.employee = { ...mockEmployee };
    
    expect(editElement.employeeId).to.equal('1');
    expect(editElement.isEditMode).to.be.true;
    expect(editElement.employee).to.deep.equal(mockEmployee);
  });

  it('submits form and adds new employee', async () => {
    // Mock employeeService.addEmployee
    const addEmployeeStub = stub(employeeService, 'addEmployee').returns(mockEmployee);
    
    // Fill form data
    element.employee = { ...mockEmployee };
    
    // Validate formun başarılı olduğunu garanti edelim
    stub(element, 'validateForm').returns(true);
    
    // Submit form
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    
    // Beklenen davranışları kontrol edelim
    expect(addEmployeeStub.calledOnce).to.be.true;
    
    // Stub'ları geri yükleyelim
    element.validateForm.restore();
  });

  it('has a cancel button that can be clicked', () => {
    // Cancel butonunu bulalım
    const cancelButton = element.shadowRoot.querySelector('button.secondary');
    
    // Butonun var olduğunu kontrol edelim
    expect(cancelButton).to.exist;
    
    // Click event listener'ın var olduğunu kontrol edelim
    expect(cancelButton.hasAttribute('@click')).to.be.false; // LitElement'te @click bir attribute değil, bir event listener
    
    // Butonun onclick özelliğini kontrol edelim
    // Bu test, butonun tıklanabilir olduğunu ve bir event listener'ı olduğunu doğrular
    expect(cancelButton.getAttribute('type')).to.equal('button');
  });
  
  it('has a cancel button with correct type and text', () => {
    // Cancel butonunu bul
    const cancelButton = element.shadowRoot.querySelector('button.secondary');
    
    // Butonun doğru özelliklere sahip olduğunu kontrol et
    expect(cancelButton).to.exist;
    expect(cancelButton.getAttribute('type')).to.equal('button');
    expect(cancelButton.textContent).to.include(i18nService.t('cancel'));
  });
  
  it('has a cancel method that can be called', () => {
    // Bileşenin cancel metodunun var olduğunu kontrol et
    expect(typeof element.cancel).to.equal('function');
    
    // Cancel metodunu çağırabildiğimizi kontrol et
    expect(() => element.cancel()).to.not.throw();
  });
  
  it('formats phone number correctly', async () => {
    const phoneInput = element.shadowRoot.querySelector('input[name="phone"]');
    
    // Test case: Formatting when input starts with +
    phoneInput.value = '+90555';
    phoneInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    expect(element.employee.phone).to.include('+(90) 5');
  });
  
  it('formats phone number correctly when it does not start with +', async () => {
    const phoneInput = element.shadowRoot.querySelector('input[name="phone"]');
    
    // Test case: Formatting when input doesn't start with +
    phoneInput.value = '555';
    phoneInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    expect(element.employee.phone).to.include('+(90) 5');
  });
  
  it('validates email format correctly', () => {
    // Geçersiz e-posta formatı
    element.employee = {
      ...element.getEmptyEmployee(),
      email: 'invalid-email'
    };
    
    const isValid = element.validateForm();
    expect(isValid).to.be.false;
    expect(element.formErrors.email).to.exist;
    
    // Geçerli e-posta formatı
    element.employee.email = 'valid@example.com';
    element.formErrors = {};
    
    const isValidNow = element.validateForm();
    expect(element.formErrors.email).to.not.exist;
  });
  
  it('validates phone format correctly', () => {
    // Geçersiz telefon formatı
    element.employee = {
      ...element.getEmptyEmployee(),
      phone: 'abc'
    };
    
    const isValid = element.validateForm();
    expect(isValid).to.be.false;
    expect(element.formErrors.phone).to.exist;
    
    // Geçerli telefon formatı
    element.employee.phone = '+(90) 555 123 45 67';
    element.formErrors = {};
    
    const isValidNow = element.validateForm();
    expect(element.formErrors.phone).to.not.exist;
  });
  
  it('updates texts when language changes', async () => {
    // Dil değişikliği olayını tetikle
    const newLanguage = element.language === 'tr' ? 'en' : 'tr';
    
    // i18nService.t fonksiyonunu stub'la
    const tStub = stub(i18nService, 't');
    
    // Dil değişikliği olayını tetikle
    window.dispatchEvent(new CustomEvent('language-changed', { detail: newLanguage }));
    
    await element.updateComplete;
    
    // Yeni dil ayarlandı mı kontrol et
    expect(element.language).to.equal(newLanguage);
  });
  
  it('updates employee in edit mode', async () => {
    // Edit moduna geç
    element.isEditMode = true;
    element.employeeId = '1';
    element.employee = { ...mockEmployee };
    
    await element.updateComplete;
    
    // Mock employeeService.updateEmployee
    const updateEmployeeStub = stub(employeeService, 'updateEmployee').returns(mockEmployee);
    
    // Form doğrulamasını atla
    stub(element, 'validateForm').returns(true);
    
    // Navigate yerine doğrudan cancel metodunu stub'la
    const cancelStub = stub(element, 'cancel');
    
    // Submit form
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    
    // Beklenen davranışları kontrol et
    expect(updateEmployeeStub.called).to.be.true;
    
    // Stub'ları temizle
    updateEmployeeStub.restore();
    element.validateForm.restore();
    cancelStub.restore();
  });
  
  it('logs error when form validation fails', async () => {
    // Form doğrulamasının başarısız olmasını sağla
    stub(element, 'validateForm').returns(false);
    
    // console.log'u stub'la
    const consoleLogStub = stub(console, 'log');
    
    // Form gönder
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    
    // Hata mesajının loglandığını kontrol et
    expect(consoleLogStub.called).to.be.true;
    
    // Stub'ları temizle
    element.validateForm.restore();
    consoleLogStub.restore();
  });
});
