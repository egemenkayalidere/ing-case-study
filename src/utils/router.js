import { Router } from '@vaadin/router';

// Router yapılandırması
let router;

export const initRouter = (outlet) => {
  router = new Router(outlet);
  
  router.setRoutes([
    {
      path: '/',
      component: 'employee-list'
    },
    {
      path: '/add',
      component: 'employee-form'
    },
    {
      path: '/edit/:id',
      component: 'employee-form'
    },
    {
      path: '(.*)',
      redirect: '/'
    }
  ]);
  
  return router;
};

export const navigate = (path) => {
  // Debug için konsola yaz
  console.log(`Navigating to: ${path}`);
  
  // Vaadin Router'da doğru yöntem Router.go()
  Router.go(path);
};
