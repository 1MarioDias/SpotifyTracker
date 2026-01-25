import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GoalForm from '../GoalForm.vue'
import { useUserStore } from '../../stores/userStore'
import { useGoalStore } from '../../stores/goalStore'

const mockRouter = {
  push: vi.fn()
}

const mockAddGoal = vi.fn()
const mockEditGoal = vi.fn()
const mockFetchGoals = vi.fn()

vi.mock('../../stores/goalStore', () => ({
  useGoalStore: vi.fn(() => ({
    addGoal: mockAddGoal,
    editGoal: mockEditGoal,
    fetchGoals: mockFetchGoals,
    goals: []
  }))
}))

describe('GoalForm', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
    
    const userStore = useUserStore()
    userStore.user = {
      id: '1',
      username: 'testuser'
    }
  })

  const createWrapper = (props = {}) => {
    return mount(GoalForm, {
      props,
      global: {
        plugins: [pinia],
        mocks: {
          $router: mockRouter
        },
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    })
  }

  it('shows form fields when template is selected', async () => {
    const wrapper = createWrapper()
    
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        templateId: 'listen_tracks'
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input#title').exists()).toBe(true)
    expect(wrapper.find('textarea#description').exists()).toBe(true)
    expect(wrapper.find('input#deadline').exists()).toBe(true)
  })

  it('testa o submit quando os valores do form são inválidos', async () => {
    const wrapper = createWrapper()
    
    await wrapper.setData({
      form: {
        ...wrapper.vm.form,
        templateId: 'listen_tracks',
        title: '',
        deadline: '',
        targetOption: null
      }
    })

    await wrapper.vm.handleSubmit()

    expect(wrapper.vm.error).toBeTruthy()
    expect(wrapper.vm.error).toContain('required fields')
  })

  it('testa o submit quando os valores do form são válidos', async () => {
    const wrapper = createWrapper()
    
    await wrapper.setData({
      form: {
        title: 'Test Goal',
        description: 'Test Description',
        deadline: '2025-12-31',
        templateId: 'listen_tracks',
        targetOption: 100,
        meta: { artistName: 'Test Artist' }
      }
    })

    await wrapper.vm.handleSubmit()

    expect(wrapper.vm.error).toBeNull()
    expect(mockAddGoal).toHaveBeenCalled()
    expect(mockAddGoal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Goal',
        description: 'Test Description',
        deadline: '2025-12-31',
        type: 'listen_tracks',
        target: 100,
        xp: 10,
        userId: '1',
        progress: 0,
        status: 'active'
      })
    )
  })
})