chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabs') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (groups) => {
        sendResponse({ tabs, groups });
      });
    });
    return true; // Keep the message channel open for async response
  }

  if (request.action === 'sendContext') {
    const { tabs, destination, mode } = request;
    
    // Format tabs into text
    let contextText = "";
    
    if (mode === 'report') {
      contextText = "Act as an expert tutor. I have been researching the following topics across these tabs. Please generate a comprehensive Study Progress Report. Summarize the key concepts from these links, assess my preparation level, and format the output cleanly with markdown (so I can save it as a PDF later).\n\nTabs:\n";
    } else {
      contextText = "Here are my currently open tabs for context:\n\n";
    }

    tabs.forEach((tab, index) => {
      contextText += `${index + 1}. ${tab.title}\n   ${tab.url}\n\n`;
    });
    
    // Define the URLs for the selected AI
    const destURLs = {
      'claude': 'https://claude.ai/new',
      'chatgpt': 'https://chatgpt.com/',
      'gemini': 'https://gemini.google.com/app'
    };
    
    const targetUrl = destURLs[destination];
    
    // Save to storage then open tab
    chrome.storage.local.set({ pendingContext: contextText }, () => {
      chrome.tabs.create({ url: targetUrl });
      sendResponse({ success: true });
    });
    return true;
  }
});
