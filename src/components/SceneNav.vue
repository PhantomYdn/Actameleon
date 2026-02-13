<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  script: {
    type: Object,
    required: true
  }
});

const isOpen = ref(false);
const currentScene = ref(null);

// Flatten scenes from all acts
const allScenes = computed(() => {
  if (!props.script.acts) return [];
  return props.script.acts.flatMap(act => 
    act.scenes.map(scene => ({
      actNumber: act.actNumber,
      actTitle: act.actTitle,
      sceneNumber: scene.sceneNumber,
      sceneTitle: scene.sceneTitle,
      id: `scene-${act.actNumber}-${scene.sceneNumber}`
    }))
  );
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const scrollToScene = (scene) => {
  const sceneEl = document.querySelector(`[data-scene="${scene.sceneNumber}"]`);
  if (sceneEl) {
    sceneEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  closeDropdown();
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.scene-nav')) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="scene-nav" v-if="allScenes.length > 0">
    <button @click="toggleDropdown" class="scene-nav-trigger" :class="{ 'active': isOpen }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <span class="sr-only">Jump to scene</span>
    </button>
    
    <div v-if="isOpen" class="scene-nav-dropdown">
      <div class="scene-nav-header">Jump to Scene</div>
      <div class="scene-nav-list">
        <button 
          v-for="scene in allScenes" 
          :key="scene.id"
          @click="scrollToScene(scene)"
          class="scene-nav-item"
        >
          <span class="scene-nav-act">{{ scene.actTitle || `Act ${scene.actNumber}` }}</span>
          <span class="scene-nav-scene">{{ scene.sceneTitle || `Scene ${scene.sceneNumber}` }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene-nav {
  @apply relative;
}

.scene-nav-trigger {
  @apply w-12 h-12 rounded-full bg-gray-600 text-white shadow-lg;
  @apply flex items-center justify-center;
  @apply hover:bg-gray-700 transition-colors;
}

.scene-nav-trigger.active {
  @apply bg-gray-700;
}

.scene-nav-dropdown {
  @apply absolute bottom-full right-0 mb-2 w-64;
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700;
  @apply overflow-hidden;
}

.scene-nav-header {
  @apply px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700;
}

.scene-nav-list {
  @apply max-h-64 overflow-y-auto;
}

.scene-nav-item {
  @apply w-full px-4 py-2 text-left flex flex-col;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
  @apply border-none bg-transparent cursor-pointer;
}

.scene-nav-act {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.scene-nav-scene {
  @apply text-sm font-medium;
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}
</style>
