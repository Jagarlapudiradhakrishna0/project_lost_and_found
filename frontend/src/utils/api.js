// Centralized API configuration - Use relative paths for all environments
const API_URL = '/api';

export const register = (data) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const login = (data) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getProfile = (token) =>
  fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Lost Items
export const reportLostItem = (data, token) => {
  const formData = new FormData();
  formData.append('itemName', data.itemName);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('color', data.color);
  formData.append('lostDate', data.lostDate);
  formData.append('lostTime', data.lostTime);
  formData.append('lostLocation', data.lostLocation);
  if (data.images) {
    for (let image of data.images) {
      formData.append('images', image);
    }
  }
  
  console.log('Sending report lost item:', {
    itemName: data.itemName,
    hasImages: data.images?.length || 0,
    token: token ? 'present' : 'missing',
  });

  return fetch(`${API_URL}/lost-items`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    // Note: DON'T set Content-Type for FormData - let the browser handle it
  }).then((res) => {
    console.log('Response status:', res.status);
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  }).catch(error => {
    console.error('Report lost item error:', error);
    throw error;
  });
};

export const getLostItems = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return fetch(`${API_URL}/lost-items?${params}`).then((res) => res.json());
};

export const getLostItemById = (id) =>
  fetch(`${API_URL}/lost-items/${id}`).then((res) => res.json());

// Found Items
export const reportFoundItem = (data, token) => {
  const formData = new FormData();
  formData.append('itemName', data.itemName);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('color', data.color);
  formData.append('foundDate', data.foundDate);
  formData.append('foundTime', data.foundTime);
  formData.append('foundLocation', data.foundLocation);
  formData.append('isSafeWithMe', data.isSafeWithMe);
  if (data.images) {
    for (let image of data.images) {
      formData.append('images', image);
    }
  }

  console.log('Sending report found item:', {
    itemName: data.itemName,
    hasImages: data.images?.length || 0,
    token: token ? 'present' : 'missing',
  });

  return fetch(`${API_URL}/found-items`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then((res) => {
    console.log('Response status:', res.status);
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  }).catch(error => {
    console.error('Report found item error:', error);
    throw error;
  });
};

export const getFoundItems = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return fetch(`${API_URL}/found-items?${params}`).then((res) => res.json());
};

export const getFoundItemById = (id) =>
  fetch(`${API_URL}/found-items/${id}`).then((res) => res.json());

// Matches
export const findMatches = (itemId, type, token) =>
  fetch(`${API_URL}/matches/find/${itemId}?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const createMatch = (data, token) =>
  fetch(`${API_URL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getMatches = (token) =>
  fetch(`${API_URL}/matches`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Messages
export const sendMessage = (data, token) =>
  fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getMessages = (matchId, token) =>
  fetch(`${API_URL}/messages/${matchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Notifications
export const getNotifications = (token) =>
  fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const markNotificationsAsRead = (notificationIds, token) =>
  fetch(`${API_URL}/notifications/read-multiple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationIds }),
  }).then((res) => res.json());

// Direct Messages
export const sendDirectMessage = (data, token) =>
  fetch(`${API_URL}/direct-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  });

export const getConversation = (otherUserId, token) =>
  fetch(`${API_URL}/direct-messages/conversation?otherUserId=${otherUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const getConversations = (token) =>
  fetch(`${API_URL}/direct-messages`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Mark items as received
export const markLostItemAsReceived = (itemId, token) =>
  fetch(`${API_URL}/lost-items/${itemId}/mark-received`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  });

export const markFoundItemAsReceived = (itemId, token) =>
  fetch(`${API_URL}/found-items/${itemId}/mark-received`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  });

// Match Management
export const getMyMatches = (token) =>
  fetch(`${API_URL}/matches`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const acceptMatch = (matchId, token) =>
  fetch(`${API_URL}/matches/${matchId}/accept`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

export const confirmReturn = (matchId, token) =>
  fetch(`${API_URL}/matches/${matchId}/confirm-return`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

export const rejectMatch = (matchId, token) =>
  fetch(`${API_URL}/matches/${matchId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

// Update Profile
export const updateProfile = (data, token) =>
  fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      });
    }
    return res.json();
  });


