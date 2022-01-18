import Vue from 'vue'
import { createLocalVue } from '@vue/test-utils'
import ScreenVariables from './ScreenVariables'

function windowResize(width: number) {
  const resizeEvent = document.createEvent('Event')
  resizeEvent.initEvent('resize', true, true)
  global.window = Object.assign(window, { innerWidth: width })
  global.window.dispatchEvent(resizeEvent)
}

describe('ScreenVariables', () => {
  expect(Vue.prototype.$screen).toBeUndefined()

  test('init', () => {
    process.client = false
    const localVue = createLocalVue()
    localVue.use(ScreenVariables as any)
    expect(typeof localVue.prototype.$screen).toBe('object')
    expect(localVue.prototype.$screen.sizes).toBe('lg')
    expect(
      Array.isArray(localVue.prototype.$screen.media) &&
        localVue.prototype.$screen.media.length === 4
    ).toBeTruthy()
    expect(localVue.prototype.$screen.width === 1120).toBeTruthy()
  })

  test('device mobile', () => {
    process.client = true
    const localVue = createLocalVue()
    windowResize(599)
    localVue.use(ScreenVariables as any)
    expect(localVue.prototype.$screen.sizes).toBe('sm')
    expect(localVue.prototype.$screen.width).toBe(599)
    expect(
      localVue.prototype.$screen.media.every((el: string) =>
        ['sm'].includes(el)
      )
    ).toBeTruthy()
  })

  test('device tablet', () => {
    process.client = true
    const localVue = createLocalVue()
    windowResize(1119)
    expect(localVue.prototype.$screen.sizes).toBe('md')
    expect(localVue.prototype.$screen.width).toBe(1119)
    expect(
      localVue.prototype.$screen.media.every((el: string) =>
        ['sm', 'md'].includes(el)
      )
    ).toBeTruthy()
  })

  test('device laptop', () => {
    process.client = true
    const localVue = createLocalVue()
    windowResize(1365)
    expect(localVue.prototype.$screen.sizes).toBe('lg')
    expect(localVue.prototype.$screen.width).toBe(1365)
    expect(
      localVue.prototype.$screen.media.every((el: string) =>
        ['sm', 'md', 'lg'].includes(el)
      )
    ).toBeTruthy()
  })

  test('device desktop', () => {
    process.client = true
    const localVue = createLocalVue()
    windowResize(1366)
    expect(localVue.prototype.$screen.sizes).toBe('xl')
    expect(localVue.prototype.$screen.width).toBe(1366)
    expect(
      localVue.prototype.$screen.media.every((el: string) =>
        ['sm', 'md', 'lg', 'xl'].includes(el)
      )
    ).toBeTruthy()
  })
})
