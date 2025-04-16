document.addEventListener('DOMContentLoaded', function() {
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');
  const currentSpeed = document.getElementById('current-speed');
  const slowBtn = document.getElementById('slow');
  const normalBtn = document.getElementById('normal');
  const fastBtn = document.getElementById('fast');
  const fasterBtn = document.getElementById('faster');
  const fastestBtn = document.getElementById('fastest');
  const aboutBtn = document.getElementById('about-btn');
  const modal = document.getElementById('about-modal');
  const closeBtn = document.getElementsByClassName('close')[0];

  let speed = 1.0;

  function updateSpeed(newSpeed) {
    speed = Math.max(0.25, Math.min(4.0, newSpeed));
    currentSpeed.textContent = speed.toFixed(2) + 'x';
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {speed: speed});
    });
  }

  decreaseBtn.addEventListener('click', () => updateSpeed(speed - 0.25));
  increaseBtn.addEventListener('click', () => updateSpeed(speed + 0.25));
  slowBtn.addEventListener('click', () => updateSpeed(0.25));
  normalBtn.addEventListener('click', () => updateSpeed(1.0));
  fastBtn.addEventListener('click', () => updateSpeed(2.0));
  fasterBtn.addEventListener('click', () => updateSpeed(3.0));
  fastestBtn.addEventListener('click', () => updateSpeed(4.0));

  aboutBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
}); 