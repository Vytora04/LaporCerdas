document.addEventListener('DOMContentLoaded', function() {
    // Verification buttons
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
   
    if (yesBtn && noBtn) {
        yesBtn.addEventListener('click', function() {
            highlightButton(this, noBtn);
            showThankYouMessage('Terima kasih atas verifikasi Anda!');
        });
       
        noBtn.addEventListener('click', function() {
            highlightButton(this, yesBtn);
            showThankYouMessage('Terima kasih atas verifikasi Anda!');
        });
    }
    
    // Function to highlight the selected button and unhighlight the other
    function highlightButton(selectedBtn, otherBtn) {
        // Add "selected" class to the clicked button
        selectedBtn.classList.add('selected');
        // Remove "selected" class from the other button
        otherBtn.classList.remove('selected');
        
        // Store the verification result in session storage
        const result = selectedBtn === yesBtn ? 'yes' : 'no';
        sessionStorage.setItem('verificationResult', result);
        
        // Log verification for analytics
        logVerificationAction(result);
    }
    
    // Function to show thank you message after verification
    function showThankYouMessage(message) {
        const verificationContainer = document.querySelector('.verification-container');
        const thankYouContainer = document.querySelector('.thank-you-container');
        const thankYouMessage = document.querySelector('.thank-you-message');
        
        if (verificationContainer && thankYouContainer && thankYouMessage) {
            // Update the thank you message text
            thankYouMessage.textContent = message;
            
            // Hide verification buttons and show thank you message
            verificationContainer.style.display = 'none';
            thankYouContainer.style.display = 'block';
            
            // Animate the thank you message
            thankYouContainer.classList.add('fade-in');
            
            // Record verification timestamp
            sessionStorage.setItem('verificationTimestamp', new Date().toISOString());
        }
    }
    
    // Function to log verification action to backend (if needed)
    function logVerificationAction(result) {
        // Get incident ID from the URL or data attribute
        const incidentId = getIncidentIdFromUrl();
        
        if (incidentId) {
            // Prepare data to send to server
            const verificationData = {
                incidentId: incidentId,
                result: result,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            // Send verification data to server asynchronously
            fetch('/api/verify-incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(verificationData)
            })
            .then(response => {
                if (!response.ok) {
                    console.error('Verification submission failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Verification recorded successfully:', data);
            })
            .catch(error => {
                console.error('Error submitting verification:', error);
                // Store failed submissions to retry later
                storeFailedSubmission(verificationData);
            });
        }
    }
    
    // Helper function to extract incident ID from URL
    function getIncidentIdFromUrl() {
        // Try to get ID from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        let incidentId = urlParams.get('id');
        
        // If not found in URL, try data attribute on the container
        if (!incidentId) {
            const container = document.querySelector('.incident-container');
            if (container && container.dataset.incidentId) {
                incidentId = container.dataset.incidentId;
            }
        }
        
        return incidentId;
    }
    
    // Function to store failed submissions for retry
    function storeFailedSubmission(data) {
        // Get existing failed submissions from local storage
        let failedSubmissions = JSON.parse(localStorage.getItem('failedVerifications') || '[]');
        
        // Add new failed submission
        failedSubmissions.push({
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Save updated list back to local storage
        localStorage.setItem('failedVerifications', JSON.stringify(failedSubmissions));
        
        // Set up retry mechanism
        setupRetryMechanism();
    }
    
    // Function to retry failed submissions
    function setupRetryMechanism() {
        // Check if retry interval is already set
        if (!window.verificationRetryInterval) {
            // Set up interval to retry every 5 minutes
            window.verificationRetryInterval = setInterval(retryFailedSubmissions, 5 * 60 * 1000);
            
            // Also try to retry when page visibility changes (user returns to tab)
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    retryFailedSubmissions();
                }
            });
        }
    }
    
    // Function to retry sending failed submissions
    function retryFailedSubmissions() {
        // Get failed submissions from local storage
        let failedSubmissions = JSON.parse(localStorage.getItem('failedVerifications') || '[]');
        
        if (failedSubmissions.length === 0) {
            // Clear interval if no failed submissions left
            if (window.verificationRetryInterval) {
                clearInterval(window.verificationRetryInterval);
                window.verificationRetryInterval = null;
            }
            return;
        }
        
        // Process each failed submission
        const remainingSubmissions = [];
        
        failedSubmissions.forEach(submission => {
            fetch('/api/verify-incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission.data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Retry failed');
                }
                return response.json();
            })
            .then(() => {
                console.log('Successfully retried verification submission');
            })
            .catch(() => {
                // Keep in the list if retry fails
                remainingSubmissions.push(submission);
            });
        });
        
        // Update local storage with remaining failed submissions
        localStorage.setItem('failedVerifications', JSON.stringify(remainingSubmissions));
    }
    
    // Initialize page state based on any previous verification
    function initializePageState() {
        const previousResult = sessionStorage.getItem('verificationResult');
        
        if (previousResult) {
            // User has already verified this incident
            if (previousResult === 'yes') {
                highlightButton(yesBtn, noBtn);
            } else {
                highlightButton(noBtn, yesBtn);
            }
            
            // Show thank you message
            showThankYouMessage('Terima kasih atas verifikasi Anda!');
        }
    }
    
    // Check for any previously failed submissions and retry them
    function checkForFailedSubmissions() {
        const failedSubmissions = JSON.parse(localStorage.getItem('failedVerifications') || '[]');
        if (failedSubmissions.length > 0) {
            setupRetryMechanism();
        }
    }
    
    // Initialize the page
    initializePageState();
    checkForFailedSubmissions();
});
