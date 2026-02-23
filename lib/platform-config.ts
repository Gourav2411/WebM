export type FieldType = "text" | "password" | "url";

export type PlatformField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
};

export type PlatformConfig = {
  key: string;
  name: string;
  category: "analytics" | "ads";
  description: string;
  fields: PlatformField[];
};

export const analyticsPlatforms: PlatformConfig[] = [
  {
    key: "ga4",
    name: "Google Analytics 4",
    category: "analytics",
    description: "Connect using GA4 property + service credentials.",
    fields: [
      { key: "propertyId", label: "Property ID", type: "text", required: true, placeholder: "123456789" },
      { key: "clientEmail", label: "Client Email", type: "text", required: true },
      { key: "privateKey", label: "Private Key", type: "password", required: true }
    ]
  },
  {
    key: "amplitude",
    name: "Amplitude",
    category: "analytics",
    description: "Connect with project API credentials.",
    fields: [
      { key: "projectId", label: "Project ID", type: "text", required: true },
      { key: "apiKey", label: "API Key", type: "password", required: true },
      { key: "secretKey", label: "Secret Key", type: "password", required: true }
    ]
  },
  {
    key: "mixpanel",
    name: "Mixpanel",
    category: "analytics",
    description: "Connect with project token and service account.",
    fields: [
      { key: "projectId", label: "Project ID", type: "text", required: true },
      { key: "projectToken", label: "Project Token", type: "password", required: true },
      { key: "serviceAccountUser", label: "Service Account User", type: "text" }
    ]
  },
  {
    key: "segment",
    name: "Segment",
    category: "analytics",
    description: "Connect with source write key and workspace token.",
    fields: [
      { key: "workspaceSlug", label: "Workspace Slug", type: "text", required: true },
      { key: "sourceWriteKey", label: "Source Write Key", type: "password", required: true },
      { key: "apiToken", label: "API Token", type: "password" }
    ]
  },
  {
    key: "posthog",
    name: "PostHog",
    category: "analytics",
    description: "Connect with project API key and host URL.",
    fields: [
      { key: "projectId", label: "Project ID", type: "text", required: true },
      { key: "apiKey", label: "Project API Key", type: "password", required: true },
      { key: "host", label: "Host URL", type: "url", required: true, placeholder: "https://app.posthog.com" }
    ]
  }
];

export const adPlatforms: PlatformConfig[] = [
  {
    key: "google_ads",
    name: "Google Ads",
    category: "ads",
    description: "Connect with customer account and OAuth app credentials.",
    fields: [
      { key: "customerId", label: "Customer ID", type: "text", required: true, placeholder: "123-456-7890" },
      { key: "developerToken", label: "Developer Token", type: "password", required: true },
      { key: "refreshToken", label: "Refresh Token", type: "password", required: true }
    ]
  },
  {
    key: "meta_ads",
    name: "Meta Ads",
    category: "ads",
    description: "Connect with ad account and system user token.",
    fields: [
      { key: "adAccountId", label: "Ad Account ID", type: "text", required: true, placeholder: "act_123456789" },
      { key: "appId", label: "App ID", type: "text", required: true },
      { key: "accessToken", label: "Access Token", type: "password", required: true }
    ]
  },
  {
    key: "linkedin_ads",
    name: "LinkedIn Ads",
    category: "ads",
    description: "Connect with account and OAuth credentials.",
    fields: [
      { key: "accountId", label: "Account ID", type: "text", required: true },
      { key: "clientId", label: "Client ID", type: "text", required: true },
      { key: "clientSecret", label: "Client Secret", type: "password", required: true }
    ]
  },
  {
    key: "tiktok_ads",
    name: "TikTok Ads",
    category: "ads",
    description: "Connect with advertiser account + API credentials.",
    fields: [
      { key: "advertiserId", label: "Advertiser ID", type: "text", required: true },
      { key: "appId", label: "App ID", type: "text", required: true },
      { key: "secret", label: "Secret", type: "password", required: true }
    ]
  },
  {
    key: "pinterest_ads",
    name: "Pinterest Ads",
    category: "ads",
    description: "Connect with ad account and access token.",
    fields: [
      { key: "adAccountId", label: "Ad Account ID", type: "text", required: true },
      { key: "accessToken", label: "Access Token", type: "password", required: true }
    ]
  }
];

export const allPlatforms = [...analyticsPlatforms, ...adPlatforms];
