import { PERMISSIONS } from './permissions';

describe('PERMISSIONS', () => {
  it('gives admins access to the dashboard and product management', () => {
    expect(PERMISSIONS.ADMIN).toContain('VIEW_DASHBOARD');
    expect(PERMISSIONS.ADMIN).toContain('MANAGE_PRODUCTS');
  });

  it('keeps regular users focused on storefront actions', () => {
    expect(PERMISSIONS.USER).toContain('VIEW_PRODUCTS');
    expect(PERMISSIONS.USER).not.toContain('MANAGE_USERS');
  });
});
