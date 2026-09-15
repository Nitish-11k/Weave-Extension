chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabs') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      sendResponse({ tabs });
    });
    return true;
  }

  if (request.action === 'sendContext') {
    const { tabs, destination } = request;
    
    let contextText = "Here are my currently open tabs for context:\n\n";
    tabs.forEach((tab, index) => {
      contextText += `${index + 1}. ${tab.title}\n   ${tab.url}\n\n`;
    });
    
    const destURLs = {
      'claude': 'https://claude.ai/new',
      'chatgpt': 'https://chatgpt.com/',
      'gemini': 'https://gemini.google.com/app'
    };
    
    const targetUrl = destURLs[destination];
    
    chrome.storage.local.set({ pendingContext: contextText }, () => {
      chrome.tabs.create({ url: targetUrl });
      sendResponse({ success: true });
    });
    return true;
  }
});
