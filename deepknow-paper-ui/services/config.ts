
const isDev = import.meta.env.DEV;

export const API_CONFIG = {
    // Use absolute URL for dev to hit portal directly, or relative for prod/docker
    BASE_URL: isDev
        ? 'https://portal.deepknow.online/api'
        : '/api', // In prod, nginx handles /api -> https://portal.deepknow.online/api
    TIMEOUT: 10000,
};

export const getApiUrl = (service: string, version: string = 'v1') => {
    return `${API_CONFIG.BASE_URL}/${service}/${version}`;
};
