const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token,
  role: state => state.user.role,

  // User profile
  firstName: state => state.user.profile.firstName,
  lastName: state => state.user.profile.lastName,
  userName: state => state.user.profile.userName,
  isDemo: state => state.user.profile.isDemo,

  // User org
  orgId: state => state.user.org.id,
  orgName: state => state.user.org.organizationName,
  orgDesc: state => state.user.org.organizationDescription,
  orgMaxDevCount: state => state.user.org.maxDevCount,

  // User org members
  orgMembers: state => {
    const userEmail = state.user.profile.email
    return state.user.orgMembers.filter(member => member.email !== userEmail)
  },

  // Apps in user's org
  orgApps: state => state.user.orgApps,

  // All permitted routes
  routes: state => state.permission.routes
}

export default getters
