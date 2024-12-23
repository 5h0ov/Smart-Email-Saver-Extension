chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
      installedVersion: chrome.runtime.getManifest().version 
    });
    
    console.log("Smart Email Saver extension installed.");
  });
  