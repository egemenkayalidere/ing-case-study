import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { Router } from '@vaadin/router';
import { initRouter, navigate } from '../../src/utils/router.js';

describe('Router', () => {
  let outletElement;

  beforeEach(() => {
    // Router.go metodunu stub'layalım
    stub(Router, 'go');
    
    // Outlet elementi oluşturalım
    outletElement = document.createElement('div');
  });

  afterEach(() => {
    // Stub'ları temizleyelim
    if (Router.go.restore) Router.go.restore();
  });

  it('initRouter should configure routes correctly', () => {
    const router = initRouter(outletElement);
    
    // Router'ın doğru şekilde yapılandırıldığını kontrol edelim
    expect(router).to.exist;
    
    // Router'ın route'larını kontrol edelim
    const routes = router.getRoutes();
    expect(routes).to.have.lengthOf(4);
    
    // Ana sayfa route'u
    expect(routes[0].path).to.equal('/');
    expect(routes[0].component).to.equal('employee-list');
    
    // Ekleme sayfası route'u
    expect(routes[1].path).to.equal('/add');
    expect(routes[1].component).to.equal('employee-form');
    
    // Düzenleme sayfası route'u
    expect(routes[2].path).to.equal('/edit/:id');
    expect(routes[2].component).to.equal('employee-form');
    
    // Yönlendirme route'u
    expect(routes[3].path).to.equal('(.*)');
    expect(routes[3].redirect).to.equal('/');
  });

  it('navigate should call Router.go with correct path', () => {
    const path = '/test-path';
    navigate(path);
    
    // Router.go'nun doğru path ile çağrıldığını kontrol edelim
    expect(Router.go.calledOnce).to.be.true;
    expect(Router.go.firstCall.args[0]).to.equal(path);
  });
});
