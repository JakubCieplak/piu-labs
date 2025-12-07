class Ajax {
    constructor(options = {}) {
        this.defaults = {
            baseURL: '',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };
    }

    async request(url, options = {}) {
        const config = {
            ...this.defaults,
            ...options,
            headers: {
                ...this.defaults.headers,
                ...options.headers
            }
        };

        const fullURL = config.baseURL + url;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        try {
            const res = await fetch(fullURL, {
                method: config.method || 'GET',
                headers: config.headers,
                body: config.body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}
