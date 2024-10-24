import type { AnalyticFBPixelSettings } from './FacebookPixelAnalytic';

declare global {
  interface Window {
    fbq: facebook.Pixel.Event;
    _fbq: facebook.Pixel.Event;
  }
}

export interface PluginAnalyticFBPixelSettings {
  fbPixel: AnalyticFBPixelSettings;
}

declare module '@ima/core' {
  interface PluginAnalyticSettings extends PluginAnalyticFBPixelSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}
