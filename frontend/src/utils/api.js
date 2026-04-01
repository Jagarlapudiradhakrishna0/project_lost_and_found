const apiURL = 'http://localhost:5000/api';

export const register = (data) =>
  fetch(`${apiURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const login = (data) =>
  fetch(`${apiURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getProfile = (token) =>
  fetch(`${apiURL}/auth/profile`, {
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

  return fetch(`${apiURL}/lost-items`, {
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
  return fetch(`${apiURL}/lost-items?${params}`).then((res) => res.json());
};

export const getLostItemById = (id) =>
  fetch(`${apiURL}/lost-items/${id}`).then((res) => res.json());

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

  return fetch(`${apiURL}/found-items`, {
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
  return fetch(`${apiURL}/found-items?${params}`).then((res) => res.json());
};

export const getFoundItemById = (id) =>
  fetch(`${apiURL}/found-items/${id}`).then((res) => res.json());

// Matches
export const findMatches = (itemId, type, token) =>
  fetch(`${apiURL}/matches/find/${itemId}?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const createMatch = (data, token) =>
  fetch(`${apiURL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getMatches = (token) =>
  fetch(`${apiURL}/matches`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Messages
export const sendMessage = (data, token) =>
  fetch(`${apiURL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const getMessages = (matchId, token) =>
  fetch(`${apiURL}/messages/${matchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Notifications
export const getNotifications = (token) =>
  fetch(`${apiURL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const markNotificationsAsRead = (notificationIds, token) =>
  fetch(`${apiURL}/notifications/read-multiple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationIds }),
  }).then((res) => res.json());

// Direct Messages
export const sendDirectMessage = (data, token) =>
  fetch(`${apiURL}/direct-messages`, {
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
  fetch(`${apiURL}/direct-messages/conversation?otherUserId=${otherUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const getConversations = (token) =>
  fetch(`${apiURL}/direct-messages`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

// Mark items as received
export const markLostItemAsReceived = (itemId, token) =>
  fetch(`${apiURL}/lost-items/${itemId}/mark-received`, {
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
  fetch(`${apiURL}/found-items/${itemId}/mark-received`, {
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
  fetch(`${apiURL}/matches`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export const acceptMatch = (matchId, token) =>
  fetch(`${apiURL}/matches/${matchId}/accept`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

export const confirmReturn = (matchId, token) =>
  fetch(`${apiURL}/matches/${matchId}/confirm-return`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

export const rejectMatch = (matchId, token) =>
  fetch(`${apiURL}/matches/${matchId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());

// Update Profile
export const updateProfile = (data, token) =>
  fetch(`${apiURL}/auth/profile`, {
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


