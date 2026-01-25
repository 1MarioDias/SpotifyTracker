<script>
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import AdminEditUser from '../components/AdminEditUser.vue';
import {
  Users,
  Shield,
  User,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-vue-next';

export default {
  name: 'AdminDashboard',
  components: {
    AdminEditUser,
    Users,
    Shield,
    User,
    Edit,
    Trash2,
    AlertCircle
  },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      page: 1,
      perPage: 6,
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
      } catch {
        this.error = 'Failed to load users.';
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(user) {
      if (!confirm(`Delete ${user.username}?`)) return;
      try {
        await userService.deleteUser(user.id);
        this.fetchUsers();
      } catch {
        this.error = 'Failed to delete user.';
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchUsers();
      }
    },
    openEditModal(user) {
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

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold flex items-center gap-2">
        <Users :size="32" />
        Admin · Users
      </h1>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-900/50 text-red-300 p-4 rounded-md mb-6 flex items-center gap-2"
    >
      <AlertCircle :size="20" />
      {{ error }}
    </div>

    <!-- Table Card -->
    <div class="bg-primary-light rounded-lg shadow overflow-hidden">
      <!-- Loading -->
      <div
        v-if="loading"
        class="p-6 text-center text-text-secondary animate-pulse"
      >
        Loading users…
      </div>

      <!-- Table -->
      
      <table v-else class="w-full text-sm">
        <thead class="border-b border-primary-dark text-text-secondary">
          <tr>
            <th class="p-4 text-left">ID</th>
            <th class="p-4 text-left">User</th>
            <th class="p-4 text-left">Email</th>
            <th class="p-4 text-left">Role</th>
            <th class="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-primary-dark hover:bg-primary-dark/40 transition-colors"
          >
            <td class="p-4 text-text-secondary">
              {{ user.id }}
            </td>

            <td class="p-4 font-medium text-text-primary">
              {{ user.username }}
            </td>

            <td class="p-4 text-text-secondary">
              {{ user.email }}
            </td>

            <td class="p-4">
              <span
                class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                :class="user.isAdmin
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : 'bg-gray-500/20 text-gray-300'"
              >
                <Shield v-if="user.isAdmin" :size="12" />
                <User v-else :size="12" />
                {{ user.isAdmin ? 'Admin' : 'User' }}
              </span>
            </td>

            <td class="p-4">
              <div class="flex gap-4 items-center">
                <button
                  @click="openEditModal(user)"
                  class="text-sm text-accent-purple hover:underline flex items-center gap-1"
                >
                  <Edit :size="14" />
                  Edit
                </button>

                <button
                  @click="deleteUser(user)"
                  class="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 :size="14" />
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="!users.length">
            <td colspan="5" class="p-8 text-center text-text-secondary">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center p-4 border-t border-primary-dark">
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

    <!-- Edit Modal -->
    <AdminEditUser
      v-if="selectedUser"
      :visible="showEditModal"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="refreshUsers"
    />
    </div>
  </div>
</template>
