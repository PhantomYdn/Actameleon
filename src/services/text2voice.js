import { ref } from "vue";

const available = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let wakeLock = null;

let speaking = ref(false);
let autoScrollEnabled = ref(true);

let linesToSpeak = [];
let language = 'ru';

// Auto-scroll state
let currentLineElement = null;
let lineObserver = null;
let isScrollingProgrammatically = false;
let scrollTimeout = null;

// Scroll padding from top of viewport (in pixels)
const SCROLL_PADDING_TOP = 100;

// Find line element by checking which element has line-selected class
const findCurrentLineElement = () => {
    return document.querySelector('.line-selected');
};

// Scroll to element with padding from top
const scrollToLine = (element) => {
    if (!element || !autoScrollEnabled.value) return;
    
    isScrollingProgrammatically = true;
    
    const elementRect = element.getBoundingClientRect();
    const targetScrollY = window.scrollY + elementRect.top - SCROLL_PADDING_TOP;
    
    window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
    });
    
    // Reset programmatic scroll flag after animation completes
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrollingProgrammatically = false;
    }, 500); // Smooth scroll typically takes ~300-500ms
};

// Handle manual scroll - disable auto-scroll
const handleScroll = () => {
    if (isScrollingProgrammatically || !speaking.value) return;
    autoScrollEnabled.value = false;
};

// Setup IntersectionObserver for current line
const setupLineObserver = (element) => {
    // Clean up previous observer
    if (lineObserver) {
        lineObserver.disconnect();
    }
    
    if (!element) return;
    
    currentLineElement = element;
    
    lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If line becomes visible and auto-scroll was disabled, re-enable it
            if (entry.isIntersecting && !autoScrollEnabled.value && speaking.value) {
                autoScrollEnabled.value = true;
            }
        });
    }, {
        threshold: 0.5, // Consider visible when 50% in view
        rootMargin: '0px'
    });
    
    lineObserver.observe(element);
};

// Start listening to scroll events
const startScrollListener = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
};

// Stop listening to scroll events
const stopScrollListener = () => {
    window.removeEventListener('scroll', handleScroll);
};

// Cleanup all auto-scroll resources
const cleanupAutoScroll = () => {
    if (lineObserver) {
        lineObserver.disconnect();
        lineObserver = null;
    }
    currentLineElement = null;
    stopScrollListener();
    clearTimeout(scrollTimeout);
    isScrollingProgrammatically = false;
};

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
        console.log('Wake lock was released');
        });
        console.log('Wake lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};
  
const releaseWakeLock = () => {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
    }
};

const toggleReading = (script) => {
    if(!available) return;
    if(speaking.value) {
        cancel();
    } else {
        read(script);
    }
}


const speakNext = () => {
    const line = linesToSpeak.shift();
    if(typeof line === 'undefined' || !speaking.value) {
        releaseWakeLock();
        speaking.value = false;
        cleanupAutoScroll();
    } else {
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.lang = language;
        utterance.onstart = () => {
            line.selected = true;
            // Use requestAnimationFrame to ensure DOM is updated before finding element
            requestAnimationFrame(() => {
                const lineElement = findCurrentLineElement();
                if (lineElement) {
                    setupLineObserver(lineElement);
                    scrollToLine(lineElement);
                }
            });
        }
        utterance.onend = () => {
            line.selected = false;
            speakNext();
        }
        utterance.onerror = () => {
            line.selected = false;
        }
        speechSynthesis.speak(utterance);
        if(!speaking.value) speaking.value = true;
    }
}

const read = (script) => {
    if(available) {
        linesToSpeak = script.acts
        .filter(act => act.active)
        .flatMap(act => act.scenes)
        .filter(scene => scene.active)
        .flatMap(scene => scene.lines)
        .filter(line => line.state === 'show' || line.state === 'clue');
        language = script.language ? script.language : 'ru';
        
        // Initialize auto-scroll
        autoScrollEnabled.value = true;
        startScrollListener();
        
        speaking.value = true;
        requestWakeLock();
        speakNext();
    }
};

const cancel = () => {
    if(available) {
        speechSynthesis.cancel();
        speaking.value = false;
        releaseWakeLock();
        cleanupAutoScroll();
    }
};


export default {
    available,
    speaking,
    autoScrollEnabled,
    toggleReading,
    read,
    cancel
}