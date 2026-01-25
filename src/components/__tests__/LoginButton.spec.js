import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginButton from '../LoginButton.vue'
import { useUserStore } from '../../stores/userStore'

const mockRouter = {
  push: vi.fn()
}

describe('LoginButton', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('renders login button when user is not logged in', () => {
    const userStore = useUserStore()
    userStore.isLoggedIn = false

    const wrapper = mount(LoginButton, {
      global: {
        plugins: [pinia],
        mocks: {
          $router: mockRouter
        }
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('LOGI N')
  })

  it('renders dashboard button when user is logged in', () => {
    const userStore = useUserStore()
    userStore.isLoggedIn = true

    const wrapper = mount(LoginButton, {
      global: {
        plugins: [pinia],
        mocks: {
          $router: mockRouter
        }
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('DASHBOARD')
  })

  it('navigates to login page when login button is clicked', async () => {
    const userStore = useUserStore()
    userStore.isLoggedIn = false

    const wrapper = mount(LoginButton, {
      global: {
        plugins: [pinia],
        mocks: {
          $router: mockRouter
        }
      }
    })

    await wrapper.find('button').trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('navigates to dashboard when dashboard button is clicked', async () => {
    const userStore = useUserStore()
    userStore.isLoggedIn = true

    const wrapper = mount(LoginButton, {
      global: {
        plugins: [pinia],
        mocks: {
          $router: mockRouter
        }
      }
    })

    await wrapper.find('button').trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
  })
})