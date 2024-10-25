import type { AnalyticGoogleSettings } from './GoogleAnalytics4';

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    dataLayer: unknown[];
  }
}

export interface PluginAnalyticGoogleSettings {
  google4: AnalyticGoogleSettings;
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PluginAnalyticSettings extends PluginAnalyticGoogleSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}
