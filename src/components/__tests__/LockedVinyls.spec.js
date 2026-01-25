import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import ProfileEdit from '../../views/ProfileEdit.vue';

describe('lockedVinyls computed property', () => {
  const mockRouter = {
    push: vi.fn()
  };

  const user = {
    id: 1,
    username: 'testuser',
    lastfm_username: 'lastfm',
    vinyl_color: 'black',
    level: 2
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should unlock all vinyls up to user level', async () => {
    const wrapper = mount(ProfileEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user: { ...user, level: 2 }
              }
            }
          })
        ],
        mocks: { $router: mockRouter },
        stubs: { Navigation: true }
      }
    });

    expect(wrapper.vm.lockedVinyls).toHaveLength(5);
    expect(wrapper.vm.lockedVinyls[0].unlocked).toBe(true); // black (level 0)
    expect(wrapper.vm.lockedVinyls[1].unlocked).toBe(true); // purple (level 1)
    expect(wrapper.vm.lockedVinyls[2].unlocked).toBe(true); // blue (level 2)
    expect(wrapper.vm.lockedVinyls[3].unlocked).toBe(false); // red (level 3)
    expect(wrapper.vm.lockedVinyls[4].unlocked).toBe(false); // gold (level 4)
  });

  it('should have all vinyls locked at level 0 except black', async () => {
    const wrapper = mount(ProfileEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user: { ...user, level: 0 }
              }
            }
          })
        ],
        mocks: { $router: mockRouter },
        stubs: { Navigation: true }
      }
    });

    expect(wrapper.vm.lockedVinyls[0].unlocked).toBe(true); // black
    expect(wrapper.vm.lockedVinyls.slice(1).every(v => !v.unlocked)).toBe(true);
  });

  it('should unlock all vinyls at max level', async () => {
    const wrapper = mount(ProfileEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user: { ...user, level: 10 }
              }
            }
          })
        ],
        mocks: { $router: mockRouter },
        stubs: { Navigation: true }
      }
    });

    expect(wrapper.vm.lockedVinyls.every(v => v.unlocked)).toBe(true);
  });

  it('should preserve vinyl color data in lockedVinyls', async () => {
    const wrapper = mount(ProfileEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user: { ...user, level: 5 }
              }
            }
          })
        ],
        mocks: { $router: mockRouter },
        stubs: { Navigation: true }
      }
    });

    wrapper.vm.lockedVinyls.forEach((vinyl, index) => {
      expect(vinyl.color).toBeDefined();
      expect(vinyl.level).toBeDefined();
      expect(vinyl.unlocked).toBeDefined();
    });
  });
});