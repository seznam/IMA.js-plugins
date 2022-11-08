import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toBeNull();
    expect(plugin).toBeDefined();
  });

  it('should exported select', () => {
    expect(plugin.select).not.toBeNull();
    expect(plugin.select).toBeDefined();
  });

  it('should exported usuSelect', () => {
    expect(plugin.useSelect).not.toBeNull();
    expect(plugin.useSelect).toBeDefined();
  });

  it('should exported setCreatorOfStateSelector', () => {
    expect(plugin.setCreatorOfStateSelector).not.toBeNull();
    expect(plugin.setCreatorOfStateSelector).toBeDefined();
  });

  it('should exported createStateSelector', () => {
    expect(plugin.createStateSelector).not.toBeNull();
    expect(plugin.createStateSelector).toBeDefined();
  });

  it('should exported setHoistStaticMethod', () => {
    expect(plugin.setHoistStaticMethod).not.toBeNull();
    expect(plugin.setHoistStaticMethod).toBeDefined();
  });

  it('should exported hoistNonReactStatic', () => {
    expect(plugin.hoistNonReactStatic).not.toBeNull();
    expect(plugin.hoistNonReactStatic).toBeDefined();
  });
});
