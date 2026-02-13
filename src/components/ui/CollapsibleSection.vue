<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultExpanded: {
    type: Boolean,
    default: false
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-all']);

const isExpanded = ref(props.defaultExpanded);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleAll = (event) => {
  event.stopPropagation();
  emit('toggle-all', props.selectedCount < props.totalCount);
};

const statusText = () => {
  if (props.selectedCount === 0) return '';
  if (props.selectedCount === props.totalCount) return 'all';
  return `${props.selectedCount}/${props.totalCount}`;
};
</script>

<template>
  <div class="collapsible-section">
    <button @click="toggleExpand" class="collapsible-header">
      <div class="header-left">
        <input 
          type="checkbox"
          :checked="selectedCount === totalCount && totalCount > 0"
          :indeterminate="indeterminate || (selectedCount > 0 && selectedCount < totalCount)"
          @click="toggleAll"
          class="section-checkbox"
        />
        <span class="section-title">{{ title }}</span>
        <span v-if="selectedCount > 0" class="section-badge">{{ statusText() }}</span>
      </div>
      <svg 
        :class="['chevron', { 'chevron-expanded': isExpanded }]"
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    
    <Transition name="collapse">
      <div v-show="isExpanded" class="collapsible-content">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.collapsible-section {
  @apply border-b dark:border-gray-800;
}

.collapsible-header {
  @apply w-full flex items-center justify-between p-4;
  @apply cursor-pointer bg-transparent border-none text-left;
  @apply hover:bg-gray-50 dark:hover:bg-gray-800/50;
}

.header-left {
  @apply flex items-center gap-3;
}

.section-checkbox {
  @apply w-5 h-5 rounded border-gray-300 dark:border-gray-600;
  @apply text-blue-500 focus:ring-blue-500;
}

.section-title {
  @apply font-medium;
}

.section-badge {
  @apply text-sm text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded;
}

.chevron {
  @apply text-gray-400 transition-transform duration-200;
}

.chevron-expanded {
  @apply rotate-180;
}

.collapsible-content {
  @apply pl-12 pb-2;
}

/* Collapse animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
