// Çalışan verilerini yönetmek için servis
class EmployeeService {
  constructor() {
    this.STORAGE_KEY = 'employees';
    
    // LocalStorage'dan verileri temizle ve yeni veriler oluştur
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Örnek veri oluştur
    const dummyData = this.generateDummyData();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dummyData));
  }

  // Örnek veri oluştur
  generateDummyData() {
    // Daha fazla örnek veri oluşturmak için kullanılacak diziler
    const firstNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Emine', 'Hüseyin', 'Hatice', 'İbrahim', 'Elif', 'Hasan', 'Merve', 'Ömer', 'Esra', 'Yusuf', 'Büşra', 'Murat', 'Derya'];
    const lastNames = ['Sourtimes', 'Yılmaz', 'Demir', 'Kaya', 'Yıldız', 'Çelik', 'Şahin', 'Koç', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Şimşek', 'Yıldırım', 'Özkan', 'Polat', 'Öztürk'];
    const departments = ['Analytics', 'Tech'];
    const positions = ['Junior', 'Medior', 'Senior'];
    
    // 50 adet örnek çalışan oluştur
    const dummyEmployees = [];
    
    for (let i = 1; i <= 50; i++) {
      // Rastgele indeksler oluştur
      const firstNameIndex = Math.floor(Math.random() * firstNames.length);
      const lastNameIndex = Math.floor(Math.random() * lastNames.length);
      const departmentIndex = Math.floor(Math.random() * departments.length);
      const positionIndex = Math.floor(Math.random() * positions.length);
      
      // Rastgele tarihler oluştur
      const employmentYear = 2018 + Math.floor(Math.random() * 5);
      const employmentMonth = 1 + Math.floor(Math.random() * 12);
      const employmentDay = 1 + Math.floor(Math.random() * 28);
      const dateOfEmployment = `${employmentYear}-${employmentMonth < 10 ? '0' + employmentMonth : employmentMonth}-${employmentDay < 10 ? '0' + employmentDay : employmentDay}`;
      
      const birthYear = 1980 + Math.floor(Math.random() * 20);
      const birthMonth = 1 + Math.floor(Math.random() * 12);
      const birthDay = 1 + Math.floor(Math.random() * 28);
      const dateOfBirth = `${birthYear}-${birthMonth < 10 ? '0' + birthMonth : birthMonth}-${birthDay < 10 ? '0' + birthDay : birthDay}`;
      
      // Rastgele telefon numarası oluştur
      // Türkiye'deki GSM operatörlerinin kod aralıkları
      const operatorGroups = {
        'Turkcell': ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539'],
        'Vodafone': ['540', '541', '542', '543', '544', '545', '546', '547', '548', '549'],
        'Türk Telekom': ['550', '551', '552', '553', '554', '555', '556', '557', '558', '559']
      };
      
      // Rastgele bir operatör seç
      const operators = Object.keys(operatorGroups);
      const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
      
      // Seçilen operatöre ait kodlardan birini rastgele seç
      const operatorCodes = operatorGroups[selectedOperator];
      const operatorCode = operatorCodes[Math.floor(Math.random() * operatorCodes.length)];
      const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const part2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const part3 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const phone = `+(90) ${operatorCode} ${part1} ${part2} ${part3}`;
      
      // Çalışan nesnesini oluştur
      dummyEmployees.push({
        id: i.toString(),
        firstName: firstNames[firstNameIndex],
        lastName: lastNames[lastNameIndex],
        dateOfEmployment,
        dateOfBirth,
        phone,
        email: `${firstNames[firstNameIndex].toLowerCase().replace(/[üöçşğı]/g, function(match) {
          const replacements = {
            'ü': 'u', 'ö': 'o', 'ç': 'c', 'ş': 's', 'ğ': 'g', 'ı': 'i'
          };
          return replacements[match] || match;
        })}@${lastNames[lastNameIndex].toLowerCase().replace(/[üöçşğı]/g, function(match) {
          const replacements = {
            'ü': 'u', 'ö': 'o', 'ç': 'c', 'ş': 's', 'ğ': 'g', 'ı': 'i'
          };
          return replacements[match] || match;
        })}.com`,
        department: departments[departmentIndex],
        position: positions[positionIndex]
      });
    }
    
    return dummyEmployees;
  }

  // Tüm çalışanları getir
  getAllEmployees() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ID'ye göre çalışan getir
  getEmployeeById(id) {
    const employees = this.getAllEmployees();
    return employees.find(employee => employee.id === id) || null;
  }

  // Yeni çalışan ekle
  addEmployee(employee) {
    const employees = this.getAllEmployees();
    // Yeni ID oluştur
    const newId = Date.now().toString();
    const newEmployee = { ...employee, id: newId };
    employees.push(newEmployee);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
    return newEmployee;
  }

  // Çalışan güncelle
  updateEmployee(id, updatedEmployee) {
    const employees = this.getAllEmployees();
    const index = employees.findIndex(employee => employee.id === id);
    
    if (index !== -1) {
      employees[index] = { ...updatedEmployee, id };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
      return employees[index];
    }
    
    return null;
  }

  // Çalışan sil
  deleteEmployee(id) {
    const employees = this.getAllEmployees();
    const filteredEmployees = employees.filter(employee => employee.id !== id);
    
    if (filteredEmployees.length !== employees.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEmployees));
      return true;
    }
    
    return false;
  }

  // Arama yap
  searchEmployees(query) {
    if (!query) return this.getAllEmployees();
    
    const employees = this.getAllEmployees();
    const lowerQuery = query.toLowerCase();
    
    return employees.filter(employee => 
      employee.firstName.toLowerCase().includes(lowerQuery) ||
      employee.lastName.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery) ||
      employee.department.toLowerCase().includes(lowerQuery) ||
      employee.position.toLowerCase().includes(lowerQuery)
    );
  }
}

// Singleton instance
const employeeService = new EmployeeService();
export default employeeService;
