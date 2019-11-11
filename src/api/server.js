import request from '@/utils/request'

/*
 * User APIs
 */

// Get user profile details.
export const getUserProfile = function() {
  return request({
    method: 'GET',
    url: '/dev/profile'
  })
}

// Update user profile details.
export const updateUserProfile = function(data) {
  return request({
    method: 'PUT',
    url: '/dev/profile',
    data
  })
}

// Login an existing user.
export const loginUser = function(data) {
  return request({
    method: 'POST',
    url: '/dev/login',
    data
  })
}

// Remove a user.
export const removeUser = function(userName) {
  return request({
    method: 'DELETE',
    url: `/dev/${userName}`
  })
}

// Update password with old password.
export const updateUserPasswordWithOldPassword = function(data) {
  return request({
    method: 'PUT',
    url: `/dev/password`,
    data
  })
}

export const updateUserPasswordWithOTP = function(data) {
  return request({
    method: 'PUT',
    url: `/dev/changePassword`,
    data
  })
}

// Send password reset email.
export const sendPasswordResetEmail = function(data) {
  return request({
    method: 'PUT',
    url: '/dev/forgotPassword',
    data
  })
}

/*
 * Organization APIs
 */

// Get org details.
export const getUserOrg = function() {
  return request({
    method: 'GET',
    url: '/api/org'
  })
}

// Update org details.
export const updateUserOrg = function(data) {
  return request({
    method: 'PUT',
    url: '/api/org',
    data
  })
}

export const getUserOrgMembers = function() {
  return request({
    method: 'GET',
    url: '/dev/list'
  })
}

// Register a new user.
export const addUserOrgMember = function(data) {
  return request({
    method: 'POST',
    url: '/dev/register',
    data
  })
}

// Change member role.
export const changeUserOrgMemberRole = function(data) {
  return request({
    method: 'PUT',
    url: '/dev/role',
    data
  })
}

/*
 * App APIs
 */

// Get all apps in user's org.
export const getApps = function() {
  return request({
    method: 'GET',
    url: '/api/app'
  })
}

// Add a new app.
export const addApp = function(data) {
  return request({
    method: 'POST',
    url: '/api/app',
    data
  })
}

// Delete an existing app.
export const deleteApp = function(appName) {
  return request({
    method: 'DELETE',
    url: `/api/app/${appName}`
  })
}

// Add balance to an app.
export const addCredits = function(data) {
  return request({
    method: 'POST',
    url: '/api/balance/add',
    data
  })
}

// Remove balance from an app.
export const subCredits = function(data) {
  return request({
    method: 'POST',
    url: '/api/balance/sub',
    data
  })
}

// Download app SDKs.
export const downloadSDK = function(appName, type) {
  return request({
    method: 'GET',
    url: `/api/app/download/${appName}/${type}`,
    responseType: 'arraybuffer',
    // SDK download may take a few seconds. Remove timeout to
    // prevent the request from cancelling on the frontend.
    timeout: 0 // Zero implies no timeout
  })
}

/*
 * Misc APIs
 */

// Buy credits.
export const buyCredits = function(data) {
  return request({
    method: 'POST',
    url: '/api/credits',
    data
  })
}

// Pay bills.
export const payBill = function(data) {
  return request({
    method: 'POST',
    url: '/api/bill',
    data
  })
}
