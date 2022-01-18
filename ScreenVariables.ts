import Vue from 'vue'
import { Context } from '@nuxt/types'

export type Screen = {
  media: string[]
  sizes: string
  width: number
}

declare module 'vue/types/vue' {
  interface Vue {
    $screen: Screen
  }
}

const mediaSizes = ['sm', 'md', 'lg', 'xl']

function sizes(screen: number): string {
  if (screen >= 1366) return 'xl'
  else if (screen >= 1120) return 'lg'
  else if (screen >= 600) return 'md'
  else return 'sm'
}

export default (context: Context) => {
  if (process.client) {
    Vue.prototype.$screen = Vue.observable({
      sizes: sizes(window.innerWidth),
      width: window.innerWidth,
      get media() {
        return mediaSizes.slice(0, mediaSizes.indexOf(this.sizes) + 1)
      },
    })

    window.addEventListener('resize', () => {
      Vue.prototype.$screen.sizes = sizes(window.innerWidth)
      Vue.prototype.$screen.width = window.innerWidth
    })
  } else {
    let isMobile = false

    if (context.req) {
      const userAgent = context.req.headers['user-agent'] as string
      isMobile =
        /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
          userAgent
        )
    }

    Vue.prototype.$screen = {
      sizes: isMobile ? 'sm' : 'lg',
      media: isMobile ? ['sm', 'md'] : ['sm', 'md', 'lg', 'xl'],
      width: isMobile ? 599 : 1120,
    }
  }
}
