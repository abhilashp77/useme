const API_BASE = '/api';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('useme_token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (error.error === 'needs_role') throw new Error('needs_role');
        throw new Error(error.error || 'Request failed');
    }

    const data = await response.json();
    return data;
}

const api = {
    // Auth
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
    firebaseAuth: (data) => request('/auth/firebase', { method: 'POST', body: data }),
    getMe: () => request('/auth/me'),

    // Drivers
    searchDrivers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/drivers/search?${query}`);
    },
    getDriver: (id) => request(`/drivers/${id}`),
    updateDriverProfile: (data) => request('/drivers/profile', { method: 'PUT', body: data }),
    uploadDocument: (data) => request('/drivers/documents', { method: 'POST', body: data }),
    getDriverDashboard: () => request('/drivers/dashboard/stats'),

    // Bookings
    createBooking: (data) => request('/bookings', { method: 'POST', body: data }),
    getBookings: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/bookings?${query}`);
    },
    updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: { status } }),
    completeBooking: (id) => request(`/bookings/${id}/complete`, { method: 'POST' }),

    // Payments
    processPayment: (data) => request('/payments/process', { method: 'POST', body: data }),
    getPaymentHistory: () => request('/payments/history'),

    // Ratings
    submitRating: (data) => request('/ratings', { method: 'POST', body: data }),
    getDriverRatings: (id) => request(`/ratings/driver/${id}`),

    // Admin
    getAdminDashboard: () => request('/admin/dashboard'),
    getAdminDrivers: (status) => {
        const query = status ? `?status=${status}` : '';
        return request(`/admin/drivers${query}`);
    },
    validateDriver: (id, action) => request(`/admin/drivers/${id}/validate`, { method: 'PUT', body: { action } }),
    getAdminUsers: () => request('/admin/users'),
    toggleBlockUser: (id) => request(`/admin/users/${id}/block`, { method: 'PUT' }),
    getAdminPayments: () => request('/admin/payments'),
};

export default api;
