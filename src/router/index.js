import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/ViewLogin'),
    hidden: true
  },

  {
    path: '/updatePassword',
    component: () => import('@/views/ViewUpdatePassword'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/View404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/ViewDashboard'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/apps',
    component: Layout,
    redirect: '/apps',
    children: [{
      path: '',
      name: 'Applications',
      component: () => import('@/views/ViewApps'),
      meta: { title: 'Applications', icon: 'apps' }
    }]
  },

  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Settings',
        component: () => import('@/views/ViewSettings'),
        meta: { title: 'Settings', icon: 'user' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/org',
    component: Layout,
    redirect: '/org',
    meta: { roles: ['admin'] },
    children: [{
      path: '',
      name: 'Organisation',
      component: () => import('@/views/ViewOrganisation'),
      meta: {
        title: 'Organisation',
        icon: 'peoples'
      }
    }]
  },

  {
    path: '/billing',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: '',
        name: 'Billing',
        component: () => import('@/views/ViewBilling'),
        meta: {
          title: 'Billing',
          icon: 'dollar'
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
