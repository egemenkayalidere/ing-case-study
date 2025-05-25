import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { navigate } from '../../utils/router.js';
import employeeService from '../../services/employee-service.js';
import i18nService from '../../i18n/i18n-service.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String },
    isEditMode: { type: Boolean },
    employee: { type: Object },
    formErrors: { type: Object },
    language: { type: String } // Dil değişikliğini izlemek için eklendi
  };

  constructor() {
    super();
    this.employeeId = null;
    this.isEditMode = false;
    this.employee = this.getEmptyEmployee();
    this.formErrors = {};
    this.language = i18nService.language; // Mevcut dili ayarla
    
    // Dil değişikliği olayını dinle
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  getEmptyEmployee() {
    return {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployeeData();
    
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
    this.requestUpdate(); // Bileşeni yeniden render et
  }

  loadEmployeeData() {
    // URL'den çalışan ID'sini al
    const path = window.location.pathname;
    const match = path.match(/\/edit\/([^/]+)/);
    
    if (match && match[1]) {
      this.employeeId = match[1];
      this.isEditMode = true;
      
      // Çalışan verilerini yükle
      const employee = employeeService.getEmployeeById(this.employeeId);
      if (employee) {
        // Tarihlerin formatını kontrol et ve düzenle
        const formattedEmployee = { ...employee };
        
        // Tarihlerin doğru formatta olduğundan emin ol
        // HTML input date formatı YYYY-MM-DD olmalı
        this.employee = formattedEmployee;
      } else {
        // Çalışan bulunamadıysa listeye yönlendir
        navigate('/');
      }
    } else {
      this.isEditMode = false;
      this.employee = this.getEmptyEmployee();
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    
    // Telefon numarası için özel işlem
    if (name === 'phone') {
      // Sadece rakamları ve + işaretini koru
      const digitsOnly = value.replace(/[^0-9+]/g, '');
      
      // Telefon numarası formatını uygula
      let formattedPhone = '';
      
      if (digitsOnly.startsWith('+')) {
        // Alan kodu kısmını formatla
        if (digitsOnly.length >= 3) {
          formattedPhone = `+(${digitsOnly.substring(1, 3)}`;  // +(90
          
          if (digitsOnly.length >= 3) {
            // 5 ile başlayan operatör kodu için kontrol
            let operatorPart = '';
            
            if (digitsOnly.length >= 4) {
              // İlk rakam 5 olmalı
              operatorPart = '5';
              
              // Diğer rakamları ekle
              if (digitsOnly.length >= 5) {
                operatorPart += digitsOnly.substring(4, 5);
              }
              
              if (digitsOnly.length >= 6) {
                operatorPart += digitsOnly.substring(5, 6);
              }
              
              formattedPhone += `) ${operatorPart}`; // +(90) 5XX
              
              if (digitsOnly.length >= 7) {
                let restPart = '';
                
                // Kalan rakamları grupla
                if (digitsOnly.length >= 9) {
                  restPart = digitsOnly.substring(6, 9);
                  formattedPhone += ` ${restPart}`; // +(90) 5XX XXX
                } else {
                  restPart = digitsOnly.substring(6);
                  formattedPhone += ` ${restPart}`;
                }
                
                if (digitsOnly.length >= 11) {
                  formattedPhone += ` ${digitsOnly.substring(9, 11)}`; // +(90) 5XX XXX XX
                  
                  if (digitsOnly.length >= 13) {
                    formattedPhone += ` ${digitsOnly.substring(11, 13)}`; // +(90) 5XX XXX XX XX
                  }
                }
              }
            } else {
              formattedPhone += `) 5`; // Varsayılan olarak 5 ekle
            }
          }
        } else {
          formattedPhone = digitsOnly;
        }
      } else if (digitsOnly.length > 0) {
        // + ile başlamıyorsa, otomatik olarak ekle
        formattedPhone = `+(90)`;
        
        // 5 ile başlayan operatör kodu ekle
        let operatorPart = '5';
        
        if (digitsOnly.length >= 1) {
          // İlk giriş rakamını operatör kodunun ikinci rakamı olarak kullan
          operatorPart += digitsOnly.substring(0, 1);
          
          if (digitsOnly.length >= 2) {
            operatorPart += digitsOnly.substring(1, 2);
          }
        }
        
        formattedPhone += ` ${operatorPart}`;
        
        if (digitsOnly.length >= 3) {
          let restPart = '';
          
          // Kalan rakamları grupla
          if (digitsOnly.length >= 5) {
            restPart = digitsOnly.substring(2, 5);
            formattedPhone += ` ${restPart}`; // +(90) 5XX XXX
          } else {
            restPart = digitsOnly.substring(2);
            formattedPhone += ` ${restPart}`;
          }
          
          if (digitsOnly.length >= 7) {
            formattedPhone += ` ${digitsOnly.substring(5, 7)}`; // +(90) 5XX XXX XX
            
            if (digitsOnly.length >= 9) {
              formattedPhone += ` ${digitsOnly.substring(7, 9)}`; // +(90) 5XX XXX XX XX
            }
          }
        }
      } else {
        formattedPhone = '+(90) 5'; // Boş giriş için varsayılan başlangıç
      }
      
      this.employee = { ...this.employee, [name]: formattedPhone };
    } else {
      this.employee = { ...this.employee, [name]: value };
    }
    
    // Girdi değiştiğinde hata mesajını temizle
    if (this.formErrors[name]) {
      this.formErrors = { ...this.formErrors, [name]: null };
    }
  }

  validateForm() {
    const errors = {};
    const { firstName, lastName, dateOfEmployment, dateOfBirth, phone, email } = this.employee;
    
    // Zorunlu alanları kontrol et
    if (!firstName) errors.firstName = i18nService.t('requiredField');
    if (!lastName) errors.lastName = i18nService.t('requiredField');
    if (!dateOfEmployment) errors.dateOfEmployment = i18nService.t('requiredField');
    if (!dateOfBirth) errors.dateOfBirth = i18nService.t('requiredField');
    if (!phone) errors.phone = i18nService.t('requiredField');
    if (!email) errors.email = i18nService.t('requiredField');
    
    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.email = i18nService.t('invalidEmail');
    }
    
    // Telefon formatını kontrol et (basit bir doğrulama)
    const phoneRegex = /^[+]?[\d\s()-]{8,}$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.phone = i18nService.t('invalidPhone');
    }
    
    this.formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted', this.employee);
    
    if (this.validateForm()) {
      try {
        if (this.isEditMode) {
          // Mevcut çalışanı güncelle
          const updated = employeeService.updateEmployee(this.employeeId, this.employee);
          console.log('Employee updated', updated);
        } else {
          // Yeni çalışan ekle
          const added = employeeService.addEmployee(this.employee);
          console.log('Employee added', added);
        }
        
        // Çalışan listesine yönlendir
        console.log('Navigating to home');
        navigate('/');
      } catch (error) {
        console.error('Error saving employee', error);
      }
    } else {
      console.log('Form validation failed', this.formErrors);
    }
  }

  cancel() {
    navigate('/');
  }

  static styles = css`
    :host {
      display: block;
    }
    
    .form-container {
      background-color: var(--card-background);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 30px;
      max-width: 800px;
      margin: 20px auto;
    }
    
    .form-header {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .form-title {
      color: var(--primary-color);
      font-size: 24px;
      font-weight: 600;
    }
    
    .form-row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .form-group {
      flex: 1;
      min-width: 250px;
      padding: 0 15px;
      margin-bottom: 25px;
      position: relative;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text-color);
      font-size: 14px;
    }
    
    .required::after {
      content: " *";
      color: var(--danger-color);
    }
    
    .error-message {
      color: var(--danger-color);
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }
    
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
      background-color: #fff;
      box-sizing: border-box;
      transition: border-color 0.2s ease-in-out;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: var(--ing-orange);
      box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.1);
    }
    
    input[type="date"] {
      padding: 10px 12px;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.2);
    }
    
    .error-message {
      color: var(--danger-color);
      font-size: 12px;
      margin-top: 5px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }
    
    button {
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    button.primary {
      background-color: var(--primary-color);
      color: white;
      border: none;
    }
    
    button.primary:hover {
      background-color: #e55800;
    }
    
    button.secondary {
      background-color: white;
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }
    
    button.secondary:hover {
      background-color: #f1f1f1;
    }
    
    @media (max-width: 768px) {
      .form-group {
        flex: 100%;
      }
    }
  `;

  render() {
    return html`
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">
            ${this.isEditMode ? i18nService.t('editEmployee') : i18nService.t('addEmployee')}
          </h1>
        </div>
        
        <form @submit=${this.handleSubmit}>
          <div class="form-row">
            <div class="form-group">
              <label class="required">${i18nService.t('firstName')}</label>
              <input 
                type="text" 
                name="firstName" 
                .value=${this.employee.firstName} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.firstName ? html`<div class="error-message">${this.formErrors.firstName}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required">${i18nService.t('lastName')}</label>
              <input 
                type="text" 
                name="lastName" 
                .value=${this.employee.lastName} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.lastName ? html`<div class="error-message">${this.formErrors.lastName}</div>` : ''}
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="required">${i18nService.t('dateOfEmployment')}</label>
              <input 
                type="date" 
                name="dateOfEmployment" 
                .value=${this.employee.dateOfEmployment} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.dateOfEmployment ? html`<div class="error-message">${this.formErrors.dateOfEmployment}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required">${i18nService.t('dateOfBirth')}</label>
              <input 
                type="date" 
                name="dateOfBirth" 
                .value=${this.employee.dateOfBirth} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.dateOfBirth ? html`<div class="error-message">${this.formErrors.dateOfBirth}</div>` : ''}
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="required">${i18nService.t('phone')}</label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="+(90) 5XX XXX XX XX" 
                .value=${this.employee.phone} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.phone ? html`<div class="error-message">${this.formErrors.phone}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label class="required">${i18nService.t('email')}</label>
              <input 
                type="email" 
                name="email" 
                .value=${this.employee.email} 
                @input=${this.handleInputChange}
              />
              ${this.formErrors.email ? html`<div class="error-message">${this.formErrors.email}</div>` : ''}
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="required">${i18nService.t('department')}</label>
              <select 
                name="department" 
                .value=${this.employee.department} 
                @change=${this.handleInputChange}
              >
                <option value="Analytics">${i18nService.t('analytics')}</option>
                <option value="Tech">${i18nService.t('tech')}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="required">${i18nService.t('position')}</label>
              <select 
                name="position" 
                .value=${this.employee.position} 
                @change=${this.handleInputChange}
              >
                <option value="Junior">${i18nService.t('junior')}</option>
                <option value="Medior">${i18nService.t('medior')}</option>
                <option value="Senior">${i18nService.t('senior')}</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary" @click=${this.cancel}>${i18nService.t('cancel')}</button>
            <button type="submit" class="primary">${i18nService.t('save')}</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
