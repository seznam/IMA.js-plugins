export interface PluginAnalyticFBPixelSettings {
  fbPixel: {
    id: string | null;
  };
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PluginAnalyticSettings extends PluginAnalyticFBPixelSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}
