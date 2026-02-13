<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet';
import '@webzlodimir/vue-bottom-sheet/dist/style.css';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  maxHeight: {
    type: String,
    default: '90%'
  }
});

const emit = defineEmits(['close']);

const sheetRef = ref(null);

watch(() => props.open, (isOpen) => {
  nextTick(() => {
    if (isOpen) {
      sheetRef.value?.open();
    } else {
      sheetRef.value?.close();
    }
  });
}, { immediate: true });

const onClose = () => {
  emit('close');
};
</script>

<template>
  <VueBottomSheet 
    ref="sheetRef"
    :max-height="maxHeight"
    :overlay="true"
    :overlay-click-close="true"
    :can-swipe="true"
    @closed="onClose"
  >
    <div class="bottom-sheet-content">
      <div class="bottom-sheet-handle"></div>
      <div v-if="title" class="bottom-sheet-header">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
      </div>
      <div class="bottom-sheet-body">
        <slot></slot>
      </div>
    </div>
  </VueBottomSheet>
</template>

<style scoped>
.bottom-sheet-content {
  @apply bg-white dark:bg-gray-900 rounded-t-2xl;
  @apply max-h-[90vh] overflow-hidden flex flex-col;
}

.bottom-sheet-handle {
  @apply w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full;
  @apply mx-auto mt-3 mb-2 flex-shrink-0;
}

.bottom-sheet-header {
  @apply px-4 pb-3 border-b dark:border-gray-700 flex-shrink-0;
}

.bottom-sheet-body {
  @apply flex-1 overflow-y-auto;
}
</style>
