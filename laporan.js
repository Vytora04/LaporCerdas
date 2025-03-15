document.addEventListener('DOMContentLoaded', function() {
   
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
    
   
    function highlightButton(selectedBtn, otherBtn) {
     
        selectedBtn.classList.add('selected');
        otherBtn.classList.remove('selected');
        
        
        const result = selectedBtn === yesBtn ? 'yes' : 'no';
        sessionStorage.setItem('verificationResult', result);
        
       
        logVerificationAction(result);
    }
    
    
    function showThankYouMessage(message) {
        const verificationContainer = document.querySelector('.verification-container');
        const thankYouContainer = document.querySelector('.thank-you-container');
        const thankYouMessage = document.querySelector('.thank-you-message');
        
        if (verificationContainer && thankYouContainer && thankYouMessage) {
            
            thankYouMessage.textContent = message;
            
            
            verificationContainer.style.display = 'none';
            thankYouContainer.style.display = 'block';
            
            thankYouContainer.classList.add('fade-in');
            
            sessionStorage.setItem('verificationTimestamp', new Date().toISOString());
        }
    }
    
    function logVerificationAction(result) {
        const incidentId = getIncidentIdFromUrl();
        
        if (incidentId) {
            const verificationData = {
                incidentId: incidentId,
                result: result,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
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
                storeFailedSubmission(verificationData);
            });
        }
    }
    
    // Helper function to extract incident ID from URL
    function getIncidentIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        let incidentId = urlParams.get('id');
        
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
        let failedSubmissions = JSON.parse(localStorage.getItem('failedVerifications') || '[]');
        
        failedSubmissions.push({
            data: data,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('failedVerifications', JSON.stringify(failedSubmissions));
        
        setupRetryMechanism();
    }
    
    function setupRetryMechanism() {
        if (!window.verificationRetryInterval) {
            window.verificationRetryInterval = setInterval(retryFailedSubmissions, 5 * 60 * 1000);
            
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    retryFailedSubmissions();
                }
            });
        }
    }
    
    // Function to retry sending failed submissions
    function retryFailedSubmissions() {
        let failedSubmissions = JSON.parse(localStorage.getItem('failedVerifications') || '[]');
        
        if (failedSubmissions.length === 0) {
            if (window.verificationRetryInterval) {
                clearInterval(window.verificationRetryInterval);
                window.verificationRetryInterval = null;
            }
            return;
        }
        
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
                remainingSubmissions.push(submission);
            });
        });
        
        localStorage.setItem('failedVerifications', JSON.stringify(remainingSubmissions));
    }
    
    function initializePageState() {
        const previousResult = sessionStorage.getItem('verificationResult');
        
        if (previousResult) {
            if (previousResult === 'yes') {
                highlightButton(yesBtn, noBtn);
            } else {
                highlightButton(noBtn, yesBtn);
            }
            
            showThankYouMessage('Terima kasih atas verifikasi Anda!');
        }
    }
    
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
