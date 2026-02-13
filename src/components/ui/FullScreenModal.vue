<script setup>
import { watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

// Prevent body scroll when modal is open
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="open" class="fullscreen-modal">
        <div class="fullscreen-modal-header">
          <button @click="close" class="back-button" aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 class="text-lg font-semibold">{{ title }}</h1>
        </div>
        <div class="fullscreen-modal-body">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fullscreen-modal {
  @apply fixed inset-0 z-50;
  @apply bg-white dark:bg-gray-900;
  @apply flex flex-col;
}

.fullscreen-modal-header {
  @apply flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700;
  @apply flex-shrink-0;
}

.back-button {
  @apply p-2 -ml-2 rounded-full;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply transition-colors;
}

.fullscreen-modal-body {
  @apply flex-1 overflow-y-auto;
}

/* Slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
