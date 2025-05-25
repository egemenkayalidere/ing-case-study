import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../../src/components/employee/employee-list.js';
import employeeService from '../../../src/services/employee-service.js';

describe('EmployeeList', () => {
  let element;
  const mockEmployees = [
    {
      id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-20',
      phone: '+90 555 123 4567',
      email: 'ahmet.yilmaz@example.com',
      department: 'Tech',
      position: 'Senior'
    },
    {
      id: '2',
      firstName: 'Ayşe',
      lastName: 'Demir',
      dateOfEmployment: '2022-03-10',
      dateOfBirth: '1995-08-15',
      phone: '+90 555 987 6543',
      email: 'ayse.demir@example.com',
      department: 'Analytics',
      position: 'Junior'
    }
  ];

  beforeEach(async () => {
    // Mock employeeService.getAllEmployees
    stub(employeeService, 'getAllEmployees').returns(mockEmployees);
    
    element = await fixture(html`<employee-list></employee-list>`);
  });

  afterEach(() => {
    // Restore the stub
    employeeService.getAllEmployees.restore();
  });

  it('renders with default properties', () => {
    expect(element.employees).to.exist;
    expect(element.filteredEmployees).to.exist;
    expect(element.currentPage).to.equal(1);
    expect(element.itemsPerPage).to.equal(8);
    expect(element.viewMode).to.equal('table');
  });

  it('loads employees on connected callback', () => {
    expect(element.employees).to.deep.equal(mockEmployees);
    expect(element.filteredEmployees).to.deep.equal(mockEmployees);
  });

  it('renders employee list in table view', () => {
    const table = element.shadowRoot.querySelector('table');
    expect(table).to.exist;
    
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(2);
    
    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[1].textContent).to.equal('Ahmet');
    expect(firstRowCells[2].textContent).to.equal('Yılmaz');
  });

  it('toggles view mode', async () => {
    expect(element.viewMode).to.equal('table');
    
    const viewToggle = element.shadowRoot.querySelector('.view-toggle span:nth-child(2)');
    viewToggle.click();
    
    await element.updateComplete;
    
    expect(element.viewMode).to.equal('list');
    
    const listView = element.shadowRoot.querySelector('.employee-list');
    expect(listView).to.exist;
    
    const cards = listView.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(2);
  });

  it('filters employees based on search query', async () => {
    // Mock searchEmployees
    stub(employeeService, 'searchEmployees').returns([mockEmployees[0]]);
    
    const searchInput = element.shadowRoot.querySelector('.search-box input');
    searchInput.value = 'Ahmet';
    searchInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    
    expect(element.searchQuery).to.equal('Ahmet');
    expect(element.filteredEmployees).to.deep.equal([mockEmployees[0]]);
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    
    // Restore the stub
    employeeService.searchEmployees.restore();
  });
});
