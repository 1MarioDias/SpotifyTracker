<script>
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import AdminEditUser from '../components/AdminEditUser.vue';

export default {
  name: 'AdminDashboard',
    components: {
        AdminEditUser,
    },
  data() {
    return {
        users: [],
        loading: false,
        error: null,
        page: 1,
        perPage: 5,
        totalUsers: 0,
        showEditModal: false,
        selectedUser: null,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalUsers / this.perPage);
    },
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const allUsers = await userService.getAllUsers();
        this.totalUsers = allUsers.length;
        const start = (this.page - 1) * this.perPage;
        this.users = allUsers.slice(start, start + this.perPage);
      } catch (error) {
        this.error = 'Failed to load users. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(user) {
        if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;

        try {
            await userService.deleteUser(user.id);
            this.fetchUsers();
        } catch (error) {
            this.error = 'Failed to delete user. Please try again later.';
        }
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchUsers();
      }
    },

    openEditModal(user) {
        if (!user) return;
        this.selectedUser = user;
        this.showEditModal = true;
    },
    refreshUsers() {
        this.fetchUsers();
    }
  },

  async mounted() {
    const store = useUserStore(); 

    if (!store.user || !store.user.isAdmin) {
      this.$router.push({ name: 'login' });
      return;
    }

    await this.fetchUsers();
  },
};
</script>


<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">
        Admin · Users
      </h1>

      <div
        v-if="error"
        class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-6"
      >
        {{ error }}
      </div>

      <div class="bg-background-secondary rounded-lg shadow overflow-hidden">
        <div
          v-if="loading"
          class="p-6 text-center text-text-secondary"
        >
          Loading users…
        </div>

        <table v-else class="w-full text-sm">
          <thead class="border-b border-border">
            <tr class="text-left text-text-secondary">
              <th class="p-4">ID</th>
              <th class="p-4">Username</th>
              <th class="p-4">Email</th>
              <th class="p-4">Role</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-border hover:bg-background-hover"
            >
              <td class="p-4">{{ user.id }}</td>
              <td class="p-4 font-medium">{{ user.username }}</td>
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="
                    user.isAdmin
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-gray-500/20 text-gray-300'
                  "
                >
                  {{ user.isAdmin ? 'Admin' : 'User' }}
                </span>
              </td>


              <td class="p-4 flex gap-2">

                <button
                    @click="openEditModal(user)"
                    class="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors duration-200"
                    >
                    Edit
                </button>

                  <button
                        @click="deleteUser(user)"
                        class="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-colors duration-200"
                    >
                        Delete
                </button>
              </td>
            </tr>

            <tr v-if="!users.length && !loading">
              <td colspan="5" class="p-6 text-center text-text-secondary">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex items-center justify-between p-4">
          <p class="text-text-secondary text-sm">
            Page {{ page }} of {{ totalPages }}
          </p>

          <div class="flex gap-2">
            <button
              class="px-3 py-1 rounded bg-background-hover disabled:opacity-50"
              :disabled="page <= 1"
              @click="changePage(page - 1)"
            >
              Prev
            </button>

            <button
              class="px-3 py-1 rounded bg-background-hover disabled:opacity-50"
              :disabled="page >= totalPages"
              @click="changePage(page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AdminEditUser
  v-if="selectedUser"
  :visible="showEditModal"
  :user="selectedUser"
  @close="showEditModal = false"
  @updated="refreshUsers"
/>
</template>
