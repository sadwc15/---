import Cookies from 'js-cookie'

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
        hide: false
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default'
    }),
  })

export default useAppStore
