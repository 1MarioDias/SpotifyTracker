import { config } from '@vue/test-utils'

config.global.mocks = {
  $router: {
    push: () => {},
    replace: () => {},
    go: () => {},
    back: () => {}
  },
  $route: {
    path: '/',
    name: 'home',
    params: {},
    query: {}
  }
}

global.URL.createObjectURL = () => 'mock-url'