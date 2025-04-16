// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.speed) {
    // Find all video elements on the page
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
      video.playbackRate = request.speed;
    }
  }
}); 