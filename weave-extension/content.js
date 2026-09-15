// Configuration for different AI chat input selectors
const SELECTORS = {
  // Claude uses ProseMirror, usually a contenteditable div inside a specific container
  'claude.ai': [
    'div[contenteditable="true"].ProseMirror',
    'fieldset div[contenteditable="true"]'
  ],
  // ChatGPT uses a textarea or contenteditable div with id prompt-textarea
  'chatgpt.com': [
    '#prompt-textarea',
    'textarea#prompt-textarea',
    'textarea[data-id="root"]'
  ],
  // Gemini uses a rich text editor inside a custom element
  'gemini.google.com': [
    'rich-textarea div[contenteditable="true"]',
    '.ql-editor[contenteditable="true"]'
  ]
};

// Simple function to get the current platform's selectors
function getSelectors() {
  const hostname = window.location.hostname;
  for (const [domain, domainSelectors] of Object.entries(SELECTORS)) {
    if (hostname.includes(domain)) {
      return domainSelectors;
    }
  }
  return [];
}

function findInputBox() {
  const selectors = getSelectors();
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function insertText(element, text) {
  if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
    // For standard inputs/textareas
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(element, text);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (element.isContentEditable) {
    // For contenteditable divs
    element.focus();
    // Use execCommand to insert text and maintain undo history if possible
    const success = document.execCommand('insertText', false, text);
    if (!success) {
      // Fallback
      element.innerText = text;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  }
}

// Function to handle the injection
function attemptInjection(text) {
  let attempts = 0;
  const maxAttempts = 20; // 10 seconds total (500ms * 20)
  
  const interval = setInterval(() => {
    attempts++;
    const inputBox = findInputBox();
    
    if (inputBox) {
      clearInterval(interval);
      insertText(inputBox, text);
      console.log("[Weave] Successfully injected context!");
      // Clear the storage so we don't inject again on refresh
      chrome.storage.local.remove('pendingContext');
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.error("[Weave] Failed to find the chat input box after 10 seconds.");
    }
  }, 500);
}

// Check storage on page load
chrome.storage.local.get(['pendingContext'], (result) => {
  if (result.pendingContext) {
    console.log("[Weave] Found pending context, attempting to inject...");
    attemptInjection(result.pendingContext);
  }
});
