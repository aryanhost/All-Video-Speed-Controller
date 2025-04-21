// Default shortcuts
const defaultShortcuts = {
  'increase-speed': 'Alt++',
  'decrease-speed': 'Alt+-',
  'reset-speed': 'Alt+0'
};

// Load saved shortcuts or use defaults
document.addEventListener('DOMContentLoaded', function() {
  // Load saved shortcuts
  chrome.storage.sync.get(['shortcuts'], function(result) {
    const shortcuts = result.shortcuts || defaultShortcuts;
    for (const [id, shortcut] of Object.entries(shortcuts)) {
      document.getElementById(id).value = shortcut;
    }
  });

  // Add event listeners
  document.getElementById('record-increase').addEventListener('click', () => recordShortcut('increase-speed'));
  document.getElementById('record-decrease').addEventListener('click', () => recordShortcut('decrease-speed'));
  document.getElementById('record-reset').addEventListener('click', () => recordShortcut('reset-speed'));
  document.getElementById('save-settings').addEventListener('click', saveShortcuts);
});

// Record new shortcut
function recordShortcut(inputId) {
  const input = document.getElementById(inputId);
  input.value = 'Recording...';
  
  function handleKeyDown(e) {
    e.preventDefault();
    
    // Don't record modifier keys alone
    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
      return;
    }
    
    // Build the shortcut string
    let shortcut = '';
    if (e.ctrlKey) shortcut += 'Ctrl+';
    if (e.altKey) shortcut += 'Alt+';
    if (e.shiftKey) shortcut += 'Shift+';
    
    // Add the main key
    shortcut += e.key.toLowerCase();
    
    // Update the input
    input.value = shortcut;
    
    // Remove the event listener
    document.removeEventListener('keydown', handleKeyDown);
  }
  
  document.addEventListener('keydown', handleKeyDown);
}

// Save shortcuts
function saveShortcuts() {
  const shortcuts = {
    'increase-speed': document.getElementById('increase-speed').value,
    'decrease-speed': document.getElementById('decrease-speed').value,
    'reset-speed': document.getElementById('reset-speed').value
  };
  
  // Validate shortcuts
  for (const [id, shortcut] of Object.entries(shortcuts)) {
    if (!shortcut || shortcut === 'Recording...') {
      alert('Please set all shortcuts before saving');
      return;
    }
  }
  
  chrome.storage.sync.set({ shortcuts: shortcuts }, function() {
    const status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  });
} 