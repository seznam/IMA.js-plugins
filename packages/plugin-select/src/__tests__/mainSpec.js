import * as plugin from '../main';

describe('plugin', () => {
  it('should is exported', () => {
    expect(plugin).not.toEqual(null);
    expect(plugin).not.toEqual(undefined);
  });

  it('should exported select', () => {
    expect(plugin.select).not.toEqual(null);
    expect(plugin.select).not.toEqual(undefined);
  });

  it('should exported usuSelect', () => {
    expect(plugin.useSelect).not.toEqual(null);
    expect(plugin.useSelect).not.toEqual(undefined);
  });

  it('should exported $registerImaPlugin', () => {
    expect(plugin.$registerImaPlugin).not.toEqual(null);
    expect(plugin.$registerImaPlugin).not.toEqual(undefined);
  });

  it('should exported setCreatorOfStateSelector', () => {
    expect(plugin.setCreatorOfStateSelector).not.toEqual(null);
    expect(plugin.setCreatorOfStateSelector).not.toEqual(undefined);
  });

  it('should exported createStateSelector', () => {
    expect(plugin.createStateSelector).not.toEqual(null);
    expect(plugin.createStateSelector).not.toEqual(undefined);
  });

  it('should exported setHoistStaticMethod', () => {
    expect(plugin.setHoistStaticMethod).not.toEqual(null);
    expect(plugin.setHoistStaticMethod).not.toEqual(undefined);
  });

  it('should exported hoistNonReactStatic', () => {
    expect(plugin.hoistNonReactStatic).not.toEqual(null);
    expect(plugin.hoistNonReactStatic).not.toEqual(undefined);
  });
});
