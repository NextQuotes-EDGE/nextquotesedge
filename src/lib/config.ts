import React from 'react';

export interface SiteConfig {
  brandName: string;
  role: string;
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtext: string;
    ctaText: string;
  };
  about: {
    title: string;
    philosophy: Array<{ title: string; text: string }>;
    portraitUrl: string;
    presence: string;
  };
  services: Array<{
    title: string;
    description: string;
    iconType: string;
  }>;
  whatsappNumber: string;
}

// Full-stack: Fetch from API, fallback to static JSON if needed
import defaultConfig from '../content/site-config.json';

export function useSiteConfig() {
  const [config, setConfig] = React.useState<SiteConfig>(defaultConfig as SiteConfig);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setConfig(data);
        }
      })
      .catch(err => console.error("CMS Config Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
