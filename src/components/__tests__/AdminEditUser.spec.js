import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AdminEditUser from '../AdminEditUser.vue';
import userService from '../../services/userService';

// Mock the userService module
vi.mock('../../services/userService', () => ({
  default: {
    updateUser: vi.fn()
  }
}));

describe('AdminEditUser.vue', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    lastfm_username: 'testfm',
    password: 'hashedpassword'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mount the component with required props
    wrapper = mount(AdminEditUser, {
      props: {
        visible: true,
        user: mockUser
      }
    });
  });

  describe('Component and Service Integration', () => {
    it('should call userService.updateUser when form is submitted with changes', async () => {
      // change username input
      const usernameInput = wrapper.find('input[type="text"]');
      await usernameInput.setValue('newusername');

      // submit the form
      await wrapper.find('form').trigger('submit');

      // verify the service was called with correct data
      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        username: 'newusername'
      });
    });

    it('should call userService.updateUser with password when password is changed', async () => {
      const passwordInput = wrapper.find('input[type="password"]');
      await passwordInput.setValue('newpassword123');

      await wrapper.find('form').trigger('submit');

      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        password: 'newpassword123'
      });
    });

    it('should call userService.updateUser with multiple fields when multiple inputs change', async () => {
      const inputs = wrapper.findAll('input');
      await inputs[0].setValue('newusername'); // username
      await inputs[1].setValue('newpass123'); // password
      await inputs[2].setValue('newfmuser'); // lastfm_username

      await wrapper.find('form').trigger('submit');

      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        username: 'newusername',
        password: 'newpass123',
        lastfm_username: 'newfmuser'
      });
    });

    it('should not call userService.updateUser if no fields are changed', async () => {
      // submit form without changing anything
      await wrapper.find('form').trigger('submit');

      // service should not be called
      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should emit "updated" event after successful user update', async () => {
      userService.updateUser.mockResolvedValueOnce({ data: {} });
      const usernameInput = wrapper.find('input[type="text"]');
      await usernameInput.setValue('newusername');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('updated')).toBeTruthy();
      expect(wrapper.emitted('updated')).toHaveLength(1);
    });

    it('should emit "close" event after successful update', async () => {
      userService.updateUser.mockResolvedValueOnce({ data: {} });
      const usernameInput = wrapper.find('input[type="text"]');
      await usernameInput.setValue('newusername');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should display error message when userService.updateUser fails', async () => {
      const errorMessage = 'Username already exists';
      userService.updateUser.mockRejectedValueOnce(new Error(errorMessage));
      const usernameInput = wrapper.find('input[type="text"]');
      await usernameInput.setValue('newusername');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      const errorElement = wrapper.find('p.text-red-500');
      expect(errorElement.exists()).toBe(true);
      expect(wrapper.vm.error).toBe(errorMessage);
    });

    it('should not emit events when service call fails', async () => {
      userService.updateUser.mockRejectedValueOnce(new Error('Update failed'));
      const usernameInput = wrapper.find('input[type="text"]');
      await usernameInput.setValue('newusername');

      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('updated')).toBeFalsy();
      expect(wrapper.emitted('close')).toBeFalsy();
    });
  });

  describe('Component State Management', () => {
    it('should reset form data when user prop changes', async () => {
      const inputs = wrapper.findAll('input');
      await inputs[0].setValue('changedusername');
      await inputs[1].setValue('changedpass');

      await wrapper.setProps({
        user: {
          id: '2',
          username: 'anotheruser',
          lastfm_username: 'anotherfm',
          password: 'hashedpass2'
        }
      });

      expect(wrapper.vm.username).toBe('anotheruser');
      expect(wrapper.vm.password).toBe('');
      expect(wrapper.vm.lastfm_username).toBe('anotherfm');
      expect(wrapper.vm.error).toBe(null);
    });

    it('should clear error when submitting form again after error', async () => {
      // first submission fails
      userService.updateUser.mockRejectedValueOnce(new Error('First error'));
      let inputs = wrapper.findAll('input');
      await inputs[0].setValue('username1');
      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.error).toBeTruthy();

      // second submission succeeds
      userService.updateUser.mockResolvedValueOnce({ data: {} });
      inputs = wrapper.findAll('input');
      await inputs[0].setValue('username2');
      await wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('Close Button Functionality', () => {
    it('should emit close event when close button is clicked', async () => {
      const closeButton = wrapper.find('button:first-child');
      await closeButton.trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });
  });
});
