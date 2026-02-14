export type AnalyticsEvent = {
    name: string;
    properties?: Record<string, any>;
};

export function trackEvent(name: string, properties?: Record<string, any>) {
    // Console log in development
    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${name}`, properties);
    }

    // Safety check for window availability (SSR)
    if (typeof window === "undefined") return;

    const win = window as any;

    // Generic support for GTM/GA (window.dataLayer)
    if (win.dataLayer) {
        win.dataLayer.push({ event: name, ...properties });
    }

    // Support for Plausible Analytics
    if (win.plausible) {
        win.plausible(name, { props: properties });
    }

    // Support for other common analytics (e.g., mixpanel) if they exist globally
    if (win.mixpanel && typeof win.mixpanel.track === "function") {
        win.mixpanel.track(name, properties);
    }
}
