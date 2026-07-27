<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  // Any CSS length. Applied directly as max-height on the sheet.
  maxHeight: {
    type: String,
    default: '90dvh'
  }
});

const emit = defineEmits(['close']);

const sheetEl = ref(null);
const dragY = ref(0);
const dragging = ref(false);

// Gesture state (plain vars: not needed for rendering)
let startX = 0;
let startY = 0;
let mode = null;      // null = undecided, 'drag' or 'scroll' once locked
let scroller = null;  // nearest scrollable ancestor of the touch target
let lastY = 0;        // last sampled position, for instantaneous velocity
let lastTime = 0;
let velocity = 0;     // px per ms, positive = moving down

const DECISION_THRESHOLD = 8;   // px before we commit to drag or scroll
const CLOSE_RATIO = 0.25;       // fraction of sheet height
const CLOSE_VELOCITY = 0.5;     // px per ms

const close = () => emit('close');

// Walk up from the touch target looking for something that can actually scroll.
const findScroller = (target) => {
  let el = target instanceof Element ? target : null;
  while (el && el !== sheetEl.value) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};

// Track the last move sample so a flick is measured on its final speed,
// not averaged over the whole gesture.
const trackVelocity = (y) => {
  const now = Date.now();
  const dt = now - lastTime;
  if (dt > 0) velocity = (y - lastY) / dt;
  lastY = y;
  lastTime = now;
};

const beginGesture = (x, y) => {
  startX = x;
  startY = y;
  lastY = y;
  lastTime = Date.now();
  velocity = 0;
};

const finishDrag = () => {
  const height = sheetEl.value?.offsetHeight || 0;

  // A flick back up cancels the close no matter how far down we got.
  const flickedUp = velocity < -CLOSE_VELOCITY;
  const flickedDown = velocity > CLOSE_VELOCITY;

  if (!flickedUp && (flickedDown || dragY.value > height * CLOSE_RATIO)) {
    // Keep dragY as-is so the leave transition continues from where the
    // finger left off instead of snapping back up first.
    close();
  } else {
    dragY.value = 0;
  }
};

const resetGesture = () => {
  dragging.value = false;
  mode = null;
  scroller = null;
  velocity = 0;
};

// --- Touch ---------------------------------------------------------------

const onTouchStart = (e) => {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  beginGesture(touch.clientX, touch.clientY);
  // Handle and title are always a drag zone; elsewhere we decide on move.
  mode = e.target.closest?.('[data-sheet-drag]') ? 'drag' : null;
  scroller = mode === 'drag' ? null : findScroller(e.target);
};

const onTouchMove = (e) => {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  const dy = touch.clientY - startY;
  const dx = touch.clientX - startX;
  trackVelocity(touch.clientY);

  if (mode === null) {
    if (Math.abs(dx) < DECISION_THRESHOLD && Math.abs(dy) < DECISION_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      mode = 'scroll';
    } else if (dy > 0 && (!scroller || scroller.scrollTop <= 0)) {
      mode = 'drag';
    } else {
      mode = 'scroll';
    }
  }

  if (mode !== 'drag') return;

  if (e.cancelable) e.preventDefault();
  dragging.value = true;
  // The sheet has no expanded state, so it never lifts off the bottom edge.
  dragY.value = Math.max(0, dy);
};

const onTouchEnd = () => {
  if (mode === 'drag') finishDrag();
  resetGesture();
};

// The browser or the OS took the gesture over: snap back, never close.
const onTouchCancel = () => {
  dragY.value = 0;
  resetGesture();
};

// --- Mouse (handle / title only) ----------------------------------------

const onMouseMove = (e) => {
  trackVelocity(e.clientY);
  dragging.value = true;
  dragY.value = Math.max(0, e.clientY - startY);
};

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  finishDrag();
  resetGesture();
};

const onMouseDown = (e) => {
  if (e.button !== 0) return;
  beginGesture(e.clientX, e.clientY);
  mode = 'drag';
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

// --- Lifecycle -----------------------------------------------------------

const onKeyup = (e) => {
  if (e.key !== 'Escape') return;
  // Let Escape reach a focused field inside the sheet (e.g. the search input)
  const target = e.target;
  const typing = target instanceof Element
    && document.activeElement === target
    && sheetEl.value?.contains(target);
  if (typing) return;
  close();
};

let ownsScrollLock = false;

const unlock = () => {
  // Only release the body lock if this sheet is the one holding it,
  // so we never unlock a modal that happens to be open underneath.
  if (ownsScrollLock) {
    document.body.style.overflow = '';
    ownsScrollLock = false;
  }
  window.removeEventListener('keyup', onKeyup);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    dragY.value = 0;
    resetGesture();
    document.body.style.overflow = 'hidden';
    ownsScrollLock = true;
    window.addEventListener('keyup', onKeyup);
  } else {
    unlock();
  }
}, { immediate: true });

onBeforeUnmount(unlock);
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet-fade">
      <div v-if="open" class="sheet-overlay" @click="close"></div>
    </Transition>

    <Transition name="sheet">
      <div
        v-if="open"
        ref="sheetEl"
        :class="['sheet', { 'sheet-dragging': dragging }]"
        :style="{ '--drag-y': dragY + 'px', '--sheet-max-height': maxHeight }"
        role="dialog"
        aria-modal="true"
        @touchstart.passive="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <div class="sheet-grab" data-sheet-drag @mousedown="onMouseDown">
          <div class="sheet-handle"></div>
          <div v-if="title" class="sheet-title">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
          </div>
        </div>

        <div class="sheet-body">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-overlay {
  @apply fixed inset-0 z-[60] bg-black/40;
}

.sheet {
  @apply fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-[640px];
  @apply bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl;
  @apply flex flex-col;
  max-height: 90vh;
  max-height: var(--sheet-max-height, 90dvh);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  transform: translateY(var(--drag-y, 0px));
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

/* No transition while the finger is down so the sheet tracks 1:1 */
.sheet.sheet-dragging {
  transition: none;
}

.sheet-grab {
  @apply flex-shrink-0 cursor-grab select-none;
  touch-action: none;
}

.sheet-grab:active {
  @apply cursor-grabbing;
}

.sheet-handle {
  @apply w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full;
  @apply mx-auto mt-3 mb-2;
}

.sheet-title {
  @apply px-4 pb-3 border-b dark:border-gray-700;
}

.sheet-body {
  @apply flex-1 overflow-y-auto overscroll-contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

/* Transitions. Declared after .sheet so they win on equal specificity:
   the transform lives in a class, not inline, precisely for this. */
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}
</style>
