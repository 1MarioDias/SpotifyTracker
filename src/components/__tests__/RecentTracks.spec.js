import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RecentTracks from '../RecentTracks.vue'
import externalAPIs from '../../services/externalAPIs'

vi.mock('../../services/externalAPIs', () => ({
  default: {
    getRecentTracks: vi.fn()
  }
}))

describe('RecentTracks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(RecentTracks, {
      props: {
        lastfmUsername: 'testuser',
        ...props
      }
    })
  }

  it('testa o display das recent tracks e a chamada à API do last.fm', async () => {
    const mockTracks = [
      {
        name: 'Test Song 1',
        artist: { '#text': 'Test Artist 1' },
        album: { '#text': 'Test Album 1' },
        image: [{ '#text': '' }, { '#text': 'test-image-1.jpg' }],
        date: { '#text': '01 Jan 2025, 12:00' }
      },
      {
        name: 'Test Song 2',
        artist: { '#text': 'Test Artist 2' },
        album: { '#text': 'Test Album 2' },
        image: [{ '#text': '' }, { '#text': 'test-image-2.jpg' }],
        date: { '#text': '01 Jan 2025, 11:00' }
      }
    ]

    externalAPIs.getRecentTracks.mockResolvedValue(mockTracks)

    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(externalAPIs.getRecentTracks).toHaveBeenCalledWith('testuser')
    expect(externalAPIs.getRecentTracks).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.tracks).toEqual(mockTracks)
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.error).toBeNull()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Song 1')
    expect(wrapper.text()).toContain('Test Artist 1')
  })

  it('mostra error message quando a chamada à API falha', async () => {
    const errorMessage = 'Failed to fetch tracks from Last.fm'
    externalAPIs.getRecentTracks.mockRejectedValue(new Error(errorMessage))

    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(externalAPIs.getRecentTracks).toHaveBeenCalledWith('testuser')
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.error).toContain('Failed to fetch recent tracks')
    expect(wrapper.vm.tracks).toEqual([])

    await wrapper.vm.$nextTick()

    const errorElement = wrapper.find('.bg-red-900\\/50')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toContain('Error')
  })

  it('retorna empty quando não há tracks a ser chamadas', async () => {
    externalAPIs.getRecentTracks.mockResolvedValue([])

    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(externalAPIs.getRecentTracks).toHaveBeenCalledWith('testuser')
    expect(wrapper.vm.tracks).toEqual([])
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.error).toBeNull()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('No recent tracks found')
  })
})