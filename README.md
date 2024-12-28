# Smart Email Saver - Chromium Browser Extension (v1.1.1)

A browser extension (based on Chromium) that automatically saves and manages email addresses you use across different websites, making form filling faster and more convenient.

Referred to docs from official chrome for developers regarding extensions and mdn.

## Key Features

- Automatically detects and saves email addresses when you submit forms
- Manual email address entry supported
- Dark/Light theme toggle
- Pagination system (5 emails per page)
- Hover to see full email addresses
- Apply saved emails to any email input field with one click
- Delete individual emails or clear all saved data
- Secure storage using browser's local storage
- Clean, modern interface with smooth animations
- Automated Outdated Notification when popup is triggered, to update check below


## Approximate Calculation of Storage Capacity

The extension uses Chrome's storage.local API which has a 5MB limit.

- Each email (average 25 characters) ≈ 50 bytes (approx.)
- 5MB = 5,242,880 bytes (known)
- Maximum email entries possible ≈ 104,857 emails (approx.)

Hence should be ample space for an individual user tbh. There could be an option to sync it across your chrome but I haven't implemented that.

## Installation & Usage

### Local Installation

1. Download/clone this repository (To clone you require **Git Bash**)
2. Open Chrome/Edge browser
3. Go to Extensions page (chrome://extensions/ or edge://extensions/ or brave://extensions/ or similar) - This can be accessed via your browser settings as well
4. Enable "Developer mode" (top right corner)
5. Click "Load unpacked"
6. Select the extension folder



### How to Update ( Using Git Bash )

1. Navigate to the extension folder 
2. Shift + Right-Click (if you are in Win 11) 
3. Select Open **Git Bash** Here
4. Execute the following command:
    ```bash
   git pull origin main

### How to Use

1. Click the extension icon in toolbar
2. Add emails manually using the input field
3. Emails from form submissions are saved automatically
4. Click "Apply" beside any email to fill it in a form
5. Use pagination dots to navigate through saved emails
6. Toggle theme using the button in header
7. Hover over long emails to see full address

## Technical Details

- Built using vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Content script monitors form submissions
- Background service worker handles installation
- Popup interface for user interaction
- Local storage for data persistence

## Known Issues (To Be Fixed)

- No export/import functionality for saved emails
- No search/filter functionality for saved emails

## Security Features

- Input sanitization for email addresses
- Secure message passing between components
- Sender verification for extension messages
- Content Security Policy implementation
- Limited permissions scope

## Browser Compatibility

- Google Chrome
- Other Chromium-based browsers should also work (even Microsoft Edge as it runs on Chromium now)

## Contributing

Feel free to submit issues and enhancement requests!

**Note:** Before making changes change the value of the version field in the manifest.json to an appropriate version number and then **reload** the extension from your Extension Settings Page to show the Dev Mode in the extension pop-up so that you dont get confused.

