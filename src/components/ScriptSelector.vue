<script setup>
import FullScreenModal from './ui/FullScreenModal.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  scripts: {
    type: Array,
    required: true
    // [{ name, title, url, metadata? }]
  },
  selected: {
    type: String,
    default: ''
  },
  scriptMetadata: {
    type: Object,
    default: () => ({})
    // { scriptName: { actCount, sceneCount, actorCount } }
  }
});

const emit = defineEmits(['select', 'close']);

const selectScript = (scriptName) => {
  emit('select', scriptName);
  emit('close');
};

const getMetadata = (scriptName) => {
  return props.scriptMetadata[scriptName] || null;
};
</script>

<template>
  <FullScreenModal :open="open" title="Select Script" @close="$emit('close')">
    <div class="script-list">
      <button
        v-for="script in scripts"
        :key="script.name"
        @click="selectScript(script.name)"
        :class="['script-card', { 'script-card-selected': script.name === selected }]"
      >
        <div class="script-card-content">
          <div class="script-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div class="script-info">
            <span class="script-title">{{ script.title }}</span>
            <span v-if="getMetadata(script.name)" class="script-meta">
              {{ getMetadata(script.name).actCount }} acts
              <span class="meta-dot"></span>
              {{ getMetadata(script.name).sceneCount }} scenes
              <span class="meta-dot"></span>
              {{ getMetadata(script.name).actorCount }} actors
            </span>
          </div>
        </div>
        <div v-if="script.name === selected" class="script-check">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </button>
    </div>
  </FullScreenModal>
</template>

<style scoped>
.script-list {
  @apply p-4 space-y-3;
}

.script-card {
  @apply w-full flex items-center justify-between p-4;
  @apply bg-white dark:bg-gray-800 rounded-xl;
  @apply border-2 border-gray-200 dark:border-gray-700;
  @apply hover:border-blue-300 dark:hover:border-blue-600;
  @apply transition-all cursor-pointer text-left;
}

.script-card-selected {
  @apply border-blue-500 dark:border-blue-500;
  @apply bg-blue-50 dark:bg-blue-900/20;
}

.script-card-content {
  @apply flex items-center gap-4;
}

.script-icon {
  @apply w-12 h-12 rounded-full;
  @apply bg-gray-100 dark:bg-gray-700;
  @apply flex items-center justify-center;
  @apply text-gray-500 dark:text-gray-400;
}

.script-card-selected .script-icon {
  @apply bg-blue-100 dark:bg-blue-900/50 text-blue-500;
}

.script-info {
  @apply flex flex-col;
}

.script-title {
  @apply text-lg font-medium;
}

.script-meta {
  @apply text-sm text-gray-500 dark:text-gray-400;
  @apply flex items-center gap-1;
}

.meta-dot {
  @apply inline-block w-1 h-1 rounded-full bg-gray-400 mx-1;
}

.script-check {
  @apply text-blue-500;
}
</style>
