import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import ProfileEdit from '../../views/ProfileEdit.vue';
import userService from '../../services/userService';

// mock service
vi.mock('../../services/userService', () => ({
  default: {
    updateUser: vi.fn()
  }
}));

describe('ProfileEdit.vue', () => {
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

  const mountComponent = () =>
    mount(ProfileEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                user
              }
            }
          })
        ],
        mocks: {
          $router: mockRouter
        },
        stubs: {
          Navigation: true
        }
      }
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders edit profile form', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Edit Profile');
  });

  it('initializes selected vinyl color from store', async () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.selectedColor).toBe('black');
  });

  it('updates profile and redirects', async () => {
    userService.updateUser.mockResolvedValueOnce({});

    const wrapper = mountComponent();

    await wrapper.find('input[type="text"]').setValue('newusername');
    await wrapper.find('form').trigger('submit.prevent');

    expect(userService.updateUser).toHaveBeenCalledWith(1, {
      username: 'newusername',
      vinyl_color: 'black'
    });

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'profile' });
  });

  it('shows error message on failure', async () => {
    userService.updateUser.mockRejectedValueOnce(new Error('error'));

    const wrapper = mountComponent();

    await wrapper.find('input[type="text"]').setValue('newusername');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.text()).toContain(
      'Failed to update profile. Please try again.'
    );
  });

  it('allows selecting an unlocked vinyl color', async () => {
    const wrapper = mountComponent();

    const buttons = wrapper.findAll('button').filter(b =>
      b.classes().some(c => c.startsWith('bg-'))
    );

    await buttons[1].trigger('click');

    expect(wrapper.vm.selectedColor).toBeTruthy();
  });
});
