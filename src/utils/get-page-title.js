import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Newfang Developer Portal'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
