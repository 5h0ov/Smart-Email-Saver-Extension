document.addEventListener('DOMContentLoaded', function() {

    // call version check 
    checkVersion();

    const themeToggle = document.getElementById('themeToggle');
    
    // checking saved theme preference
    chrome.storage.local.get('darkTheme', function(result) {
        if (result.darkTheme) {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = 'Toggle Light';
        }
    });

    // toggling the theme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        // saving the theme preference
        chrome.storage.local.set({ darkTheme: isDark });
        
        // updating toggle button text
        themeToggle.textContent = isDark ? 'Toggle Light' : 'Toggle Dark';
    });

    
    const githubLink = document.getElementById('githubLink');
    githubLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: "https://github.com/5h0ov/Smart-Email-Saver-Extension" });
    });

    
    // fetching the latest version from the manifest file on GitHub for version check
    function checkVersion() {
        const GITHUB_MANIFEST_RAW_URL = "https://raw.githubusercontent.com/5h0ov/Smart-Email-Saver-Extension/main/manifest.json";

        fetch(GITHUB_MANIFEST_RAW_URL)
            .then(response => response.json())
            .then(data => {
                const latestVersion = data.version;
                
                chrome.storage.local.get('installedVersion', function(result) {
                    const currentVersion = result.installedVersion;

                    if(!currentVersion) {
                        chrome.storage.local.set({ 
                            installedVersion: chrome.runtime.getManifest().version 
                        });
                    }
                    
                    else if (currentVersion < latestVersion) {
                    
                        // updating elements based on version check result to notify the user
                        githubLink.classList.add('outdated');
                        githubLink.title = 'New version available!';
                        
                        const notification = document.createElement('div');
                        notification.className = 'version-notification';
                        notification.textContent = 'Update Available!';
                        document.querySelector('.header').appendChild(notification);
                    }

                    else if (currentVersion > latestVersion) {
                        githubLink.classList.add('dev-mode');
                        githubLink.title = 'Running in dev mode with new changes!';
                        
                        const notification = document.createElement('div');
                        notification.className = 'version-notification';
                        notification.textContent = 'In Dev Mode';
                        document.querySelector('.header').appendChild(notification);
                    }

                    else throw new Error('Up-to Date!');
                });
            })
            .catch(error => {
                console.log('Error fetching version:', error);
            });
    }


    const newEmailInput = document.getElementById('newEmail');
    const addEmailButton = document.getElementById('addEmail');

    addEmailButton.addEventListener('click', function() {
        const email = newEmailInput.value.trim();
        
        // simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('please enter a valid email address');
            return;
        }

        // saving email to storage
        chrome.storage.local.get({ savedEmails: [] }, function(result) {
            let savedEmails = result.savedEmails;
            if (!savedEmails.includes(email)) {
                savedEmails.push(email);
                chrome.storage.local.set({ savedEmails: savedEmails }, function() {
                    // clearing the input field
                    newEmailInput.value = '';
                    // reloading the popup to show the new email
                    refreshEmailList(currentPageNumber);
                    // window.location.reload();
                });
            } else {
                alert('this email is already saved');
            }
        });
    });

    // let users add an email with the enter key
    newEmailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addEmailButton.click();
        }
    });
});

let currentPageNumber = 0;
const ITEMS_PER_PAGE = 5;

// a new custom function to refresh the email list after performing an action
function refreshEmailList(targetPage = 0) {
    chrome.storage.local.get({ savedEmails: [] }, function (result) {
        const emailList = document.getElementById("emailList");
        
        if (result.savedEmails.length === 0) {
            emailList.innerText = "no emails saved yet.";
            return;
        }

        emailList.innerHTML = '';
        const totalPages = Math.ceil(result.savedEmails.length / ITEMS_PER_PAGE);
        currentPageNumber = Math.min(targetPage, totalPages - 1);

        const pagesContainer = document.createElement('div');
        pagesContainer.className = 'pages-container';

        for (let i = 0; i < totalPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = `page ${i === currentPageNumber ? 'active' : ''}`;

            const startIdx = i * ITEMS_PER_PAGE;
            const pageEmails = result.savedEmails.slice(startIdx, startIdx + ITEMS_PER_PAGE);

            pageEmails.forEach((email) => {
                const emailItem = document.createElement("div");
                emailItem.className = `email-item-${email.replace(/[@.]/g, '-')}`;

                const emailText = document.createElement("span");
                emailText.innerText = email;
                emailText.title = email; // shows full email on hover
                
                const buttonGroup = document.createElement("div");
                buttonGroup.className = "button-group";

                const applyButton = document.createElement("button");
                applyButton.innerText = "Apply";
                applyButton.onclick = () => {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "fillEmail",
                            email: email
                        }, response => {
                            if (response?.success === false)  
                                alert(response?.message);
                            else if(chrome.runtime.lastError) 
                                alert("An error occurred while trying to fill the email field: " + chrome.runtime.lastError);
                        });
                    });
                };

                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = () => {
                    chrome.storage.local.get({ savedEmails: [] }, function(result) {
                        const updatedEmails = result.savedEmails.filter(e => e !== email);
                        const totalPages = Math.ceil(updatedEmails.length / ITEMS_PER_PAGE);
                        
                        const itemsInCurrentPage = result.savedEmails.filter((_, index) => 
                            Math.floor(index / ITEMS_PER_PAGE) === currentPageNumber
                        ).length;
                        
                        let newPage = currentPageNumber;
                        if (itemsInCurrentPage === 1 && currentPageNumber > 0) {
                            newPage = currentPageNumber - 1;
                        } else if (currentPageNumber >= totalPages) {
                            newPage = Math.max(0, totalPages - 1);
                        }
                        
                        chrome.storage.local.set({ savedEmails: updatedEmails }, function() {
                            refreshEmailList(newPage);
                        });
                    });
                };

                buttonGroup.appendChild(applyButton);
                buttonGroup.appendChild(deleteButton);
                emailItem.appendChild(emailText);
                emailItem.appendChild(buttonGroup);
                pageDiv.appendChild(emailItem);
            });

            pagesContainer.appendChild(pageDiv);
        }

        emailList.appendChild(pagesContainer);

        if (totalPages > 1) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'pagination-dots';

            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.className = `dot ${i === currentPageNumber ? 'active' : ''}`;
                dot.onclick = () => {
                    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
                    document.querySelectorAll('.page')[i].classList.add('active');
                    dot.classList.add('active');
                    currentPageNumber = i;
                };
                dotsContainer.appendChild(dot);
            }

            emailList.appendChild(dotsContainer);
        }
    });
}

// initial load of email list
refreshEmailList(0);

// clear functiionality
document.getElementById('clearEmails').addEventListener('click', function() {
    if (confirm('are you sure you want to delete all saved emails?')) {
        chrome.storage.local.set({ savedEmails: [] }, function() {
            window.location.reload();
        });
    }
});

