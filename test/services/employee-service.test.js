import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import employeeService from '../../src/services/employee-service.js';

describe('EmployeeService', () => {
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
  
  let localStorageGetItemStub;
  let localStorageSetItemStub;
  
  beforeEach(() => {
    // Stub localStorage methods
    localStorageGetItemStub = stub(localStorage, 'getItem');
    localStorageSetItemStub = stub(localStorage, 'setItem');
    
    // Setup default behavior
    localStorageGetItemStub.withArgs('employees').returns(JSON.stringify(mockEmployees));
  });
  
  afterEach(() => {
    // Restore stubs
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });
  
  it('gets all employees from localStorage', () => {
    const employees = employeeService.getAllEmployees();
    expect(employees).to.deep.equal(mockEmployees);
    expect(localStorageGetItemStub.calledWith('employees')).to.be.true;
  });
  
  it('gets employee by id', () => {
    const employee = employeeService.getEmployeeById('1');
    expect(employee).to.deep.equal(mockEmployees[0]);
  });
  
  it('returns null for non-existent employee id', () => {
    const employee = employeeService.getEmployeeById('999');
    expect(employee).to.be.null;
  });
  
  it('adds a new employee', () => {
    const newEmployee = {
      firstName: 'Mehmet',
      lastName: 'Kaya',
      dateOfEmployment: '2023-05-01',
      dateOfBirth: '1992-12-10',
      phone: '+90 555 111 2222',
      email: 'mehmet.kaya@example.com',
      department: 'Tech',
      position: 'Medior'
    };
    
    const addedEmployee = employeeService.addEmployee(newEmployee);
    
    // Verify the employee was added with an ID
    expect(addedEmployee.id).to.exist;
    expect(addedEmployee.firstName).to.equal(newEmployee.firstName);
    
    // Verify localStorage was updated
    expect(localStorageSetItemStub.calledOnce).to.be.true;
    expect(localStorageSetItemStub.firstCall.args[0]).to.equal('employees');
  });
  
  it('updates an existing employee', () => {
    const updatedData = {
      firstName: 'Ahmet Updated',
      lastName: 'Yılmaz',
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-20',
      phone: '+90 555 123 4567',
      email: 'ahmet.updated@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    
    const updatedEmployee = employeeService.updateEmployee('1', updatedData);
    
    // Verify the employee was updated
    expect(updatedEmployee.id).to.equal('1');
    expect(updatedEmployee.firstName).to.equal(updatedData.firstName);
    expect(updatedEmployee.email).to.equal(updatedData.email);
    
    // Verify localStorage was updated
    expect(localStorageSetItemStub.calledOnce).to.be.true;
    expect(localStorageSetItemStub.firstCall.args[0]).to.equal('employees');
  });
  
  it('returns null when updating non-existent employee', () => {
    const updatedData = { firstName: 'Test' };
    const result = employeeService.updateEmployee('999', updatedData);
    expect(result).to.be.null;
  });
  
  it('deletes an employee', () => {
    const result = employeeService.deleteEmployee('1');
    
    // Verify the employee was deleted
    expect(result).to.be.true;
    
    // Verify localStorage was updated
    expect(localStorageSetItemStub.calledOnce).to.be.true;
    expect(localStorageSetItemStub.firstCall.args[0]).to.equal('employees');
  });
  
  it('returns false when deleting non-existent employee', () => {
    const result = employeeService.deleteEmployee('999');
    expect(result).to.be.false;
  });
  
  it('searches employees correctly', () => {
    // Search by first name
    let results = employeeService.searchEmployees('Ahmet');
    expect(results.length).to.equal(1);
    expect(results[0].id).to.equal('1');
    
    // Search by last name
    results = employeeService.searchEmployees('Demir');
    expect(results.length).to.equal(1);
    expect(results[0].id).to.equal('2');
    
    // Search by department
    results = employeeService.searchEmployees('Tech');
    expect(results.length).to.equal(1);
    expect(results[0].id).to.equal('1');
    
    // Search with no results
    results = employeeService.searchEmployees('NonExistent');
    expect(results.length).to.equal(0);
  });
});
