// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.speed) {
    updateVideoSpeed(request.speed);
  }
});

// Function to update video speed
function updateVideoSpeed(speed) {
  const videos = document.getElementsByTagName('video');
  for (let video of videos) {
    video.playbackRate = speed;
  }
}

// Default shortcuts
let shortcuts = {
  'increase-speed': 'Alt++',
  'decrease-speed': 'Alt+-',
  'reset-speed': 'Alt+0'
};

// Load saved shortcuts
chrome.storage.sync.get(['shortcuts'], function(result) {
  if (result.shortcuts) {
    shortcuts = result.shortcuts;
    console.log('Loaded shortcuts:', shortcuts);
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.shortcuts) {
    shortcuts = changes.shortcuts.newValue;
    console.log('Shortcuts updated:', shortcuts);
  }
});

// Function to check if a shortcut matches
function isShortcutMatch(event, shortcut) {
  console.log('Checking shortcut:', shortcut, 'against event:', event.key, event.ctrlKey, event.altKey, event.shiftKey);
  
  // Special case for + and = keys (they are the same key)
  if (shortcut.includes('+') && (event.key === '+' || event.key === '=')) {
    return checkModifiers(event, shortcut);
  }
  
  // For other keys
  const parts = shortcut.split('+');
  const key = parts.pop().toLowerCase();
  
  // Special case for - key
  if (key === '-' && event.key === '-') {
    return checkModifiers(event, shortcut);
  }
  
  // Special case for 0 key
  if (key === '0' && event.key === '0') {
    return checkModifiers(event, shortcut);
  }
  
  // For other keys
  if (event.key.toLowerCase() === key) {
    return checkModifiers(event, shortcut);
  }
  
  return false;
}

// Function to check modifier keys
function checkModifiers(event, shortcut) {
  const parts = shortcut.split('+');
  const modifiers = parts.slice(0, -1).map(m => m.toLowerCase());
  
  if (modifiers.includes('ctrl') !== event.ctrlKey) {
    return false;
  }
  if (modifiers.includes('alt') !== event.altKey) {
    return false;
  }
  if (modifiers.includes('shift') !== event.shiftKey) {
    return false;
  }
  
  return true;
}

// Function to handle keyboard shortcuts
function handleKeyboardShortcut(event) {
  const videos = document.getElementsByTagName('video');
  if (videos.length === 0) return;

  const currentSpeed = videos[0].playbackRate;
  let newSpeed = currentSpeed;
  let shortcutPressed = false;

  // Check for increase speed shortcut
  if (isShortcutMatch(event, shortcuts['increase-speed'])) {
    newSpeed = Math.min(4.0, currentSpeed + 0.25);
    shortcutPressed = true;
  }
  // Check for decrease speed shortcut
  else if (isShortcutMatch(event, shortcuts['decrease-speed'])) {
    newSpeed = Math.max(0.25, currentSpeed - 0.25);
    shortcutPressed = true;
  }
  // Check for reset speed shortcut
  else if (isShortcutMatch(event, shortcuts['reset-speed'])) {
    newSpeed = 1.0;
    shortcutPressed = true;
  }

  if (shortcutPressed) {
    event.preventDefault();
    updateVideoSpeed(newSpeed);
    showSpeedNotification(newSpeed);
  }
}

// Remove any existing event listeners
document.removeEventListener('keydown', handleKeyboardShortcut);

// Add new event listener
document.addEventListener('keydown', handleKeyboardShortcut);

// Function to show speed notification
function showSpeedNotification(speed) {
  // Remove existing notification if any
  const existingNotification = document.getElementById('speed-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.id = 'speed-notification';
  
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    #speed-notification {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background-color: rgba(0, 0, 0, 0.8) !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 5px !important;
      font-family: Arial, sans-serif !important;
      font-size: 16px !important;
      z-index: 2147483647 !important; /* Maximum z-index value */
      pointer-events: none !important;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
  
  notification.textContent = `Speed: ${speed.toFixed(2)}x`;
  document.body.appendChild(notification);

  // Make sure notification is on top in fullscreen
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (fullscreenElement) {
    fullscreenElement.appendChild(notification);
  }

  // Remove notification after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 2000);
} 