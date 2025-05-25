import { LitElement, html, css } from 'lit';
import { navigate } from '../../utils/router.js';
import employeeService from '../../services/employee-service.js';
import i18nService from '../../i18n/i18n-service.js';
import '../shared/confirm-dialog.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    filteredEmployees: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchQuery: { type: String },
    viewMode: { type: String },
    selectedEmployee: { type: Object },
    showDeleteConfirm: { type: Boolean },
    language: { type: String }, // Dil değişikliğini izlemek için eklendi
    selectedEmployees: { type: Array } // Seçili çalışanları tutmak için
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.currentPage = 1;
    this.itemsPerPage = 8; // Sayfa başına gösterilen öğe sayısını azalttım
    this.totalPages = 1;
    this.searchQuery = '';
    this.viewMode = 'table'; // 'table' veya 'list'
    this.showDeleteConfirm = false;
    this.selectedEmployee = null;
    this.selectedEmployees = [];
    
    this.language = i18nService.language;
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    
    // Verileri yükle
    this.loadEmployees();
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
    
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
  
  loadEmployees() {
    this.employees = employeeService.getAllEmployees();
    this.applyFilters();
  }

  applyFilters() {
    if (this.searchQuery) {
      this.filteredEmployees = employeeService.searchEmployees(this.searchQuery);
    } else {
      this.filteredEmployees = [...this.employees];
    }
    
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getCurrentPageEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  setPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'list' : 'table';
  }
  
  toggleEmployeeSelection(employee) {
    const index = this.selectedEmployees.findIndex(e => e.id === employee.id);
    if (index === -1) {
      this.selectedEmployees = [...this.selectedEmployees, employee];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== employee.id);
    }
  }
  
  isEmployeeSelected(employee) {
    return this.selectedEmployees.some(e => e.id === employee.id);
  }
  
  toggleAllEmployees() {
    const currentEmployees = this.getCurrentPageEmployees();
    const allSelected = currentEmployees.every(employee => this.isEmployeeSelected(employee));
    
    if (allSelected) {
      // Tüm seçimleri kaldır
      this.selectedEmployees = this.selectedEmployees.filter(selected => 
        !currentEmployees.some(current => current.id === selected.id)
      );
    } else {
      // Tümünü seç
      const newSelectedEmployees = [...this.selectedEmployees];
      
      currentEmployees.forEach(employee => {
        if (!this.isEmployeeSelected(employee)) {
          newSelectedEmployees.push(employee);
        }
      });
      
      this.selectedEmployees = newSelectedEmployees;
    }
  }

  editEmployee(employee) {
    navigate('/edit/' + employee.id);
  }

  confirmDelete(employee) {
    this.selectedEmployee = employee;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.selectedEmployee = null;
  }

  deleteEmployee() {
    if (this.selectedEmployee) {
      employeeService.deleteEmployee(this.selectedEmployee.id);
      this.showDeleteConfirm = false;
      this.selectedEmployee = null;
      this.loadEmployees();
    }
  }
  
  // Tarih formatını dönüştür (YYYY-MM-DD -> DD/MM/YYYY)
  formatDate(dateString) {
    if (!dateString) return '';
    
    // YYYY-MM-DD formatını kontrol et
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [_, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
    
    return dateString; // Eğer format uygun değilse olduğu gibi döndür
  }

  renderPagination() {
    if (this.totalPages <= 1) return html``;
    
    const pages = [];
    
    // Önceki sayfa oku
    pages.push(html`
      <div class="pagination-arrow" @click=${() => this.setPage(this.currentPage - 1)}>
        <span>❮</span>
      </div>
    `);
    
    // Sayfa numaraları
    if (this.totalPages <= 7) {
      // 7 veya daha az sayfa varsa hepsini göster
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(html`
          <div class="pagination-item ${i === this.currentPage ? 'active' : ''}" 
               @click=${() => this.setPage(i)}>
            ${i}
          </div>
        `);
      }
    } else {
      // Çok sayfa varsa akıllı sayfalama göster
      // İlk sayfa her zaman görünür
      pages.push(html`
        <div class="pagination-item ${1 === this.currentPage ? 'active' : ''}" 
             @click=${() => this.setPage(1)}>
          1
        </div>
      `);
      
      // Eğer mevcut sayfa 3'ten büyükse, ellipsis göster
      if (this.currentPage > 3) {
        pages.push(html`<div class="pagination-ellipsis">...</div>`);
      }
      
      // Mevcut sayfanın etrafındaki sayfaları göster
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(html`
          <div class="pagination-item ${i === this.currentPage ? 'active' : ''}" 
               @click=${() => this.setPage(i)}>
            ${i}
          </div>
        `);
      }
      
      // Eğer mevcut sayfa son sayfadan 2 sayfa öncesinden küçükse, ellipsis göster
      if (this.currentPage < this.totalPages - 2) {
        pages.push(html`<div class="pagination-ellipsis">...</div>`);
      }
      
      // Son sayfa her zaman görünür
      pages.push(html`
        <div class="pagination-item ${this.totalPages === this.currentPage ? 'active' : ''}" 
             @click=${() => this.setPage(this.totalPages)}>
          ${this.totalPages}
        </div>
      `);
    }
    
    // Sonraki sayfa oku
    pages.push(html`
      <div class="pagination-arrow" @click=${() => this.setPage(this.currentPage + 1)}>
        <span>❯</span>
      </div>
    `);
    
    return html`
      <div class="pagination">
        ${pages}
      </div>
    `;
  }

  renderTableView() {
    const currentEmployees = this.getCurrentPageEmployees();
    
    if (currentEmployees.length === 0) {
      return html`<div class="no-records">${i18nService.t('noRecords')}</div>`;
    }
    
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  @change=${this.toggleAllEmployees}
                  .checked=${this.getCurrentPageEmployees().length > 0 && this.getCurrentPageEmployees().every(employee => this.isEmployeeSelected(employee))}
                />
              </th>
              <th>${i18nService.t('firstName')}</th>
              <th>${i18nService.t('lastName')}</th>
              <th>${i18nService.t('dateOfEmployment')}</th>
              <th>${i18nService.t('dateOfBirth')}</th>
              <th>${i18nService.t('phone')}</th>
              <th>${i18nService.t('email')}</th>
              <th>${i18nService.t('department')}</th>
              <th>${i18nService.t('position')}</th>
              <th>${i18nService.t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${currentEmployees.map((employee, index) => {
              const startIndex = (this.currentPage - 1) * this.itemsPerPage;
              return html`
                <tr>
                  <td>
                    <input 
                      type="checkbox" 
                      .checked=${this.isEmployeeSelected(employee)}
                      @change=${() => this.toggleEmployeeSelection(employee)}
                    />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${this.formatDate(employee.dateOfEmployment)}</td>
                  <td>${this.formatDate(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${i18nService.t(employee.department.toLowerCase())}</td>
                  <td>${i18nService.t(employee.position.toLowerCase())}</td>
                  <td class="actions-column">
                    <span class="action-icon edit-icon" title="${i18nService.t('edit')}" @click=${() => this.editEmployee(employee)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </span>
                    <span class="action-icon delete-icon" title="${i18nService.t('delete')}" @click=${() => this.confirmDelete(employee)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </span>
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListView() {
    const currentEmployees = this.getCurrentPageEmployees();
    
    if (currentEmployees.length === 0) {
      return html`<div class="no-records">${i18nService.t('noRecords')}</div>`;
    }
    
    return html`
      <div class="employee-list">
        ${currentEmployees.map(employee => html`
          <div class="employee-card">
            <div class="employee-info">
              <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
              <div class="employee-details">
                <div>${i18nService.t(employee.department.toLowerCase())} - ${i18nService.t(employee.position.toLowerCase())}</div>
                <div>${employee.email}</div>
                <div>${employee.phone}</div>
              </div>
            </div>
            <div class="employee-actions">
              <span class="action-icon edit-icon" title="${i18nService.t('edit')}" @click=${() => this.editEmployee(employee)}>
                ✏️
              </span>
              <span class="action-icon delete-icon" title="${i18nService.t('delete')}" @click=${() => this.confirmDelete(employee)}>
                🗑️
              </span>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderDeleteConfirmDialog() {
    if (!this.showDeleteConfirm || !this.selectedEmployee) return html``;
    
    return html`
      <div class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${i18nService.t('deleteConfirmation')}</div>
            <div class="modal-close" @click=${this.cancelDelete}>×</div>
          </div>
          <div class="modal-body">
            <p>${i18nService.t('deleteConfirmationMessage')}</p>
            <p>${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}</p>
          </div>
          <div class="modal-footer">
            <button class="secondary" @click=${this.cancelDelete}>${i18nService.t('cancel')}</button>
            <button class="primary" @click=${this.deleteEmployee}>${i18nService.t('proceed')}</button>
          </div>
        </div>
      </div>
    `;
  }
  
  render() {
    return html`
      <div class="employee-list-container">
        <div class="list-header">
          <h1 class="list-title">${i18nService.t('employeeList')}</h1>
          
          <div class="list-actions">
            <div class="search-box">
              <div class="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="${i18nService.t('search')}..." 
                .value=${this.searchQuery}
                @input=${this.handleSearch}
              />
            </div>
            
            <div class="view-toggle">
              <span class="${this.viewMode === 'table' ? 'active' : ''}" @click=${() => this.viewMode = 'table'} title="${i18nService.t('tableView')}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
              </span>
              <span class="${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this.viewMode = 'list'} title="${i18nService.t('listView')}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ing-orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </span>
            </div>
          </div>
        </div>
        
        <div class="employee-data-container card">
          ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}
        </div>
        
        ${this.renderPagination()}
        ${this.renderDeleteConfirmDialog()}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    
    .employee-list-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .employee-data-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      margin-top: 16px;
      overflow: hidden;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 16px 0;
    }
    
    .list-title {
      color: var(--ing-orange);
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    
    .list-actions {
      display: flex;
      align-items: center;
    }
    
    .search-box {
      margin-right: 15px;
    }
    
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    
    .search-box input {
      padding: 8px 12px 8px 36px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      width: 200px;
      font-size: 14px;
    }
    
    .view-toggle {
      display: flex;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-left: 12px;
    }
    
    .view-toggle span {
      padding: 8px;
      cursor: pointer;
      background-color: white;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
    
    .view-toggle i {
      font-size: 14px;
      transition: transform 0.2s ease;
    }
    
    .view-toggle span.active {
      background-color: rgba(255, 102, 0, 0.1);
    }
    
    .view-toggle span.active svg {
      stroke: var(--ing-orange);
      stroke-width: 2.5;
    }
    
    .view-toggle span:hover:not(.active) {
      background-color: rgba(255, 102, 0, 0.05);
    }
    
    .view-toggle span:hover .view-icon {
      transform: scale(1.1);
    }
    
    .table-container {
      width: 100%;
      padding: 0;
    }
    
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
    }
    
    th {
      text-align: left;
      padding: 16px 10px;
      font-weight: 600;
      color: var(--ing-orange);
      border-bottom: 1px solid var(--border-color);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    th:first-child, td:first-child {
      width: 40px;
      padding-left: 16px;
    }
    
    th:nth-child(2), td:nth-child(2),
    th:nth-child(3), td:nth-child(3) {
      width: 10%;
    }
    
    th:nth-child(4), td:nth-child(4),
    th:nth-child(5), td:nth-child(5) {
      width: 10%;
    }
    
    th:nth-child(6), td:nth-child(6) {
      width: 15%;
    }
    
    th:nth-child(7), td:nth-child(7) {
      width: 15%;
    }
    
    th:nth-child(8), td:nth-child(8),
    th:nth-child(9), td:nth-child(9) {
      width: 10%;
    }
    
    th:last-child, td:last-child {
      width: 10%;
      text-align: center;
    }
    
    td {
      padding: 16px 10px;
      border-bottom: 1px solid var(--border-color);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    td:nth-child(2), td:nth-child(3) {
      font-weight: 600;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    .actions-column {
      width: 100px;
      text-align: center;
    }
    
    .action-icon {
      cursor: pointer;
      margin: 0 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .action-icon i {
      font-size: 14px;
    }
    
    .action-icon:hover {
      background-color: rgba(255, 102, 0, 0.1);
    }
    
    .action-icon svg {
      stroke: var(--ing-orange);
    }
    
    .no-records {
      text-align: center;
      padding: 20px;
      color: var(--light-text-color);
    }
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--primary-color);
      border: 1px solid #ccc;
      border-radius: 4px;
      appearance: none;
      -webkit-appearance: none;
      position: relative;
      background-color: white;
    }
    
    input[type="checkbox"]:checked {
      background-color: var(--ing-orange);
      border-color: var(--ing-orange);
    }
    
    input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
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
      overflow: hidden;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background-color: var(--primary-color);
      color: white;
    }
    
    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }
    
    .modal-close {
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-close i {
      font-size: 16px;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px;
      border-top: 1px solid var(--border-color);
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px 0;
      gap: 8px;
    }
    
    .pagination-item {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      color: #333;
    }
    
    .pagination-item.active {
      background-color: var(--ing-orange);
      color: white;
    }
    
    .pagination-item:hover:not(.active) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .pagination-ellipsis {
      color: #999;
      font-size: 14px;
      padding: 0 5px;
    }
    
    .pagination-arrow {
      cursor: pointer;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      transition: all 0.2s ease;
    }
    
    .pagination-arrow span {
      font-size: 18px;
    }
    
    .pagination-arrow:hover {
      color: var(--ing-orange);
    }
    
    .pagination-arrow:hover {
      color: var(--primary-color);
    }
    
    .pagination-ellipsis {
      color: var(--light-text-color);
      padding: 0 5px;
    }
    
    .employee-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .employee-card:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    .employee-info {
      flex: 1;
    }
    
    .employee-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 5px;
      color: var(--primary-color);
    }
    
    .employee-details {
      color: var(--text-color);
      font-size: 14px;
    }
    
    .employee-details > div {
      margin-bottom: 3px;
    }
    
    .employee-actions {
      display: flex;
      gap: 10px;
    }
    
    button.primary {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button.secondary {
      background-color: white;
      color: var(--text-color);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .list-title {
        margin-bottom: 15px;
      }
      
      .list-actions {
        width: 100%;
      }
      
      .search-box {
        flex: 1;
      }
      
      .search-box input {
        width: 100%;
      }
    }
  `;
}

customElements.define('employee-list', EmployeeList);
