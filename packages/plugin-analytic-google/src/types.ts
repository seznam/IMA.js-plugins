export interface PluginAnalyticGoogleSettings {
  google4: {
    consentSettings?: {
      ad_storage?: 'denied' | 'granted';
      analytics_storage?: 'denied' | 'granted';
      personalization_storage?: 'denied' | 'granted';
    };
    service: string;
    waitForUpdateTimeout?: number;
  };
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PluginAnalyticSettings extends PluginAnalyticGoogleSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}
