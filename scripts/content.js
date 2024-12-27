chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log('Message from:', {
      sender: sender,
      isExtension: sender.id === chrome.runtime.id // security check to verify message came from our extension
  });

  // Validate message source
  if (!sender.id || sender.id !== chrome.runtime.id) {
      sendResponse({ 
          success: false, 
          message: "Unauthorized sender" 
      });
      return true;
  }

  if (request.action === "fillEmail") {
    // finding  the active/visible email input on the page
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const visibleInput = Array.from(emailInputs).find(input => {
      const style = window.getComputedStyle(input);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    console.log('emailInputs:', emailInputs);
    console.log('visibleInput:', visibleInput);

    if (visibleInput) {
      visibleInput.value = request.email;
      visibleInput.dispatchEvent(new Event('input', { bubbles: true }));
      sendResponse({ success: true, message: "email field successfully filled" });
    } else {
        sendResponse({ success: false, message: "no email input field found on this page"  });
    }
    return true; // keeps the message channel open for async responses as saving email or field finding may take time
  }
});

// form submission monitoring function
document.addEventListener("submit", function (event) {
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    
    if (emailInput && emailInput.value) {
      const email = emailInput.value;
      chrome.storage.local.get({ savedEmails: [] }, result => {
          let savedEmails = result.savedEmails;
          if (!savedEmails.includes(email)) {
              savedEmails.push(email);
              chrome.storage.local.set({ savedEmails: savedEmails });
          }
      });
  }
});