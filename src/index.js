// Bileşenleri import et
import { AppRoot } from './components/app-root.js';
import './components/nav-bar.js';
import './components/employee/employee-list.js';
import './components/employee/employee-form.js';
import './components/shared/confirm-dialog.js';

// Ana bileşeni tanımla
customElements.define('app-root', AppRoot);

// Uygulama başlatıldığında localStorage'da veri yoksa örnek veri oluştur
const initializeData = () => {
  const STORAGE_KEY = 'employees';
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (!storedData) {
    // Örnek veri oluştur
    const dummyData = [
      {
        id: '1',
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        dateOfEmployment: '23/09/2022',
        dateOfBirth: '23/09/1990',
        phone: '+90 532 123 45 67',
        email: 'ahmet@sourtimes.org',
        department: 'Analytics',
        position: 'Junior'
      },
      {
        id: '2',
        firstName: 'Mehmet',
        lastName: 'Yılmaz',
        dateOfEmployment: '15/03/2021',
        dateOfBirth: '10/05/1988',
        phone: '+90 533 321 54 76',
        email: 'mehmet@example.com',
        department: 'Tech',
        position: 'Medior'
      },
      {
        id: '3',
        firstName: 'Ayşe',
        lastName: 'Demir',
        dateOfEmployment: '05/11/2020',
        dateOfBirth: '18/07/1985',
        phone: '+90 535 765 43 21',
        email: 'ayse@example.com',
        department: 'Analytics',
        position: 'Senior'
      },
      {
        id: '4',
        firstName: 'Fatma',
        lastName: 'Kaya',
        dateOfEmployment: '20/06/2019',
        dateOfBirth: '12/12/1992',
        phone: '+90 537 987 65 43',
        email: 'fatma@example.com',
        department: 'Tech',
        position: 'Junior'
      },
      {
        id: '5',
        firstName: 'Ali',
        lastName: 'Yıldız',
        dateOfEmployment: '10/01/2022',
        dateOfBirth: '25/03/1991',
        phone: '+90 538 456 78 90',
        email: 'ali@example.com',
        department: 'Tech',
        position: 'Medior'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
  }
};

// Uygulamayı başlat
initializeData();
