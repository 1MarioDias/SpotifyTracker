<script>
import GoalsList from '../components/GoalsList.vue';
import GoalForm from '../components/GoalForm.vue';

export default {
  name: 'GoalsView',
  components: {
    GoalsList,
    GoalForm
  },
  props: {
    action: {
      type: String,
      default: 'list'
    },
    id: {
      type: String,
      default: null
    }
  },
  computed: {
    isListView() {
      return !this.action || this.action === 'list';
    },
    isCreateView() {
      return this.action === 'create';
    },
    isEditView() {
      return this.action === 'edit' && this.id;
    }
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-7xl mx-auto">
      <GoalsList v-if="isListView" />
      <GoalForm v-else-if="isCreateView" />
      <GoalForm v-else-if="isEditView" :id="id" />
    </div>
  </div>
</template>