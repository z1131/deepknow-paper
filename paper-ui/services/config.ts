// Get config from window.__CONFIG__ (injected at runtime by docker-entrypoint.sh)
// or fallback to environment variables / defaults
const getRuntimeConfig = () => {
    return (window as any).__CONFIG__ || {
        API_BASE: 'https://portal.deepknow.online',
        WS_BASE: 'wss://portal.deepknow.online'
    };
};

export const API_CONFIG = {
    // We point directly to the portal (via ALB)
    BASE_URL: getRuntimeConfig().API_BASE,
    TIMEOUT: 10000,
};

export const getApiUrl = (service: string) => {
    // We point directly to the portal (via ALB)
    return `${API_CONFIG.BASE_URL}/${service}`;
};
