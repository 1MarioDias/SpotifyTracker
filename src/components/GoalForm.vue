<script>
import { mapActions, mapState } from 'pinia';
import { useGoalStore } from '../stores/goalStore';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'GoalForm',
  props: {
    id: { type: String, default: null }
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        deadline: '',
        templateId: null,
        targetOption: null,
        meta: {}
      },
      error: null,
      templates: [
        {
          id: 'listen_tracks',
          name: 'Listen to an Artist',
          description: 'Track your scrobbles for a specific artist.',
          metaFields: [{ name: 'artistName', label: 'Artist Name', type: 'text', required: true }],
          options: [
            { target: 100, xp: 10, label: '100 Plays (10 XP)' },
            { target: 250, xp: 25, label: '250 Plays (25 XP)' },
            { target: 500, xp: 60, label: '500 Plays (60 XP)' },
          ]
        },
        {
          id: 'earn_badges',
          name: 'Earn Crowns',
          description: 'Become the top listener for multiple artists.',
          metaFields: [],
          options: [
            { target: 5, xp: 20, label: '5 Crowns (20 XP)' },
            { target: 10, xp: 50, label: '10 Crowns (50 XP)' },
            { target: 20, xp: 120, label: '20 Crowns (120 XP)' },
          ]
        },
        {
          id: 'discover_artists',
          name: 'Discover New Artists',
          description: 'Manually track new artists you discover.',
          metaFields: [],
          options: [
            { target: 10, xp: 15, label: '10 Artists (15 XP)' },
            { target: 25, xp: 40, label: '25 Artists (40 XP)' },
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    isEditMode() {
      return !!this.id;
    },
    pageTitle() {
      return this.isEditMode ? 'Edit Goal' : 'Create New Goal';
    },
    selectedTemplate() {
      return this.templates.find(t => t.id === this.form.templateId);
    }
  },
  methods: {
    ...mapActions(useGoalStore, ['addGoal', 'editGoal']),
    async handleSubmit() {
      this.error = null;
      const selectedOption = this.selectedTemplate?.options.find(o => o.target === this.form.targetOption);

      if (!this.form.title || !this.form.deadline || !selectedOption) {
        this.error = 'Please fill in all required fields and select a target.';
        return;
      }

      const goalData = {
        title: this.form.title,
        description: this.form.description,
        deadline: this.form.deadline,
        type: this.selectedTemplate.id,
        target: selectedOption.target,
        xp: selectedOption.xp,
        meta: this.form.meta,
      };

      try {
        if (this.isEditMode) {
          await this.editGoal(this.id, goalData);
        } else {
          await this.addGoal({
            ...goalData,
            userId: this.user.id,
            progress: 0,
            status: 'active',
          });
        }
        this.$router.push({ name: 'goals', params: { action: 'list' } });
      } catch (err) {
        this.error = `Operation failed: ${err.message}`;
      }
    },
    async loadGoal() {
      if (this.isEditMode) {
        const goalStore = useGoalStore();
        await goalStore.fetchGoals(this.user.id);
        const goal = goalStore.goals.find(g => g.id === this.id);
        if (goal) {
          this.form.title = goal.title;
          this.form.description = goal.description;
          this.form.deadline = goal.deadline;
          this.form.templateId = goal.type;
          this.form.targetOption = goal.target;
          this.form.meta = goal.meta || {};
        } else {
          this.error = "Goal not found.";
        }
      }
    }
  },
  created() {
    this.loadGoal();
  }
};
</script>

<template>
  <div>
    <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">{{ pageTitle }}</h1>
    <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto bg-primary-light p-8 rounded-lg space-y-6">
      
      <div v-if="!isEditMode">
        <label class="block text-text-secondary text-sm font-bold mb-2">Goal Template</label>
        <select v-model="form.templateId" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple">
          <option :value="null" disabled>-- Select a template --</option>
          <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
        </select>
        <p v-if="selectedTemplate" class="text-xs text-text-secondary mt-2">{{ selectedTemplate.description }}</p>
      </div>

      <div v-if="selectedTemplate || isEditMode">
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-text-secondary text-sm font-bold mb-2">Title</label>
            <input v-model="form.title" type="text" id="title" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
          </div>

          <div v-if="selectedTemplate && selectedTemplate.metaFields.length > 0">
            <div v-for="field in selectedTemplate.metaFields" :key="field.name">
              <label :for="field.name" class="block text-text-secondary text-sm font-bold mb-2">{{ field.label }}</label>
              <input v-model="form.meta[field.name]" :type="field.type" :id="field.name" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" :required="field.required">
            </div>
          </div>

          <div>
            <label for="description" class="block text-text-secondary text-sm font-bold mb-2">Description (Optional)</label>
            <textarea v-model="form.description" id="description" rows="3" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="target" class="block text-text-secondary text-sm font-bold mb-2">Target</label>
              <select v-model.number="form.targetOption" id="target" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
                <option :value="null" disabled>-- Select a target --</option>
                <option v-for="opt in selectedTemplate.options" :key="opt.target" :value="opt.target">{{ opt.label }}</option>
              </select>
            </div>
            <div>
              <label for="deadline" class="block text-text-secondary text-sm font-bold mb-2">Deadline</label>
              <input v-model="form.deadline" type="date" id="deadline" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
            </div>
          </div>
        </div>

        <p v-if="error" class="text-red-500 text-xs mt-4">{{ error }}</p>

        <div class="flex items-center justify-end gap-4 mt-6 border-t border-gray-700 pt-6">
          <router-link :to="{ name: 'goals', params: { action: 'list' } }" class="text-text-secondary hover:text-white">Cancel</router-link>
          <button type="submit" class="bg-accent-pink text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors">
            {{ isEditMode ? 'Save Changes' : 'Create Goal' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>