document.querySelector(".add-report").addEventListener("click", function() {
  alert("Tambah laporan clicked!");
});

document.addEventListener('DOMContentLoaded', function() {
 
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
          const passwordInput = this.previousElementSibling;
          
          if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              this.textContent = '👁️‍🗨️'; 
          } else {
              passwordInput.type = 'password';
              this.textContent = '👁️';
          }
      });
  });
  
  
  const closeBtn = document.querySelector('.close-btn');
  
  if (closeBtn) {
      closeBtn.addEventListener('click', function() {
     
          alert('Close button clicked');
      });
  }
  
  // Form submission
  const form = document.querySelector('.submit-btn');
  
  if (form) {
      form.addEventListener('click', function(e) {
          e.preventDefault();
          
         
          const emailInput = document.getElementById('email');
          const passwordInput = document.getElementById('password');
          const namaLengkap = document.querySelector('input[placeholder="Masukkan nama"]');  
          const agreeCheckbox = document.getElementById('agree');

          let isValid = true;
          
          if (!emailInput.value) {
              isValid = false;
              highlightError(emailInput);
          }
          
          if (!passwordInput.value) {
              isValid = false;
              highlightError(passwordInput);
          }
          
          if (!namaLengkap.value.trim()) {
            highlightError(namaLengkap, "Nama Lengkap tidak boleh kosong!");
            isValid = false;
          }

          if (!agreeCheckbox.checked) {
            isValid = false;
            highlightError(agreeCheckbox, "Anda harus menyetujui pernyataan!");
        }

  
          const fullnameInput = document.getElementById('fullname');
          const birthdateInput = document.getElementById('birthdate');
          const termsCheckbox = document.getElementById('terms');
          
          if (fullnameInput) {
              if (!fullnameInput.value) {
                  isValid = false;
                  highlightError(fullnameInput);
              }
              
              if (!birthdateInput.value) {
                  isValid = false;
                  highlightError(birthdateInput);
              }
              
              if (!agreeCheckbox.checked) {
                isValid = false;
                highlightError(agreeCheckbox, "Anda harus menyetujui pernyataan!");
            }
          }
          
          
          if (isValid) {
              const isSignup = fullnameInput !== null;
              const message = isSignup ? 'Sign up successful!' : 'Login successful!';
              alert(message);
            
          }
      });
  }
  
  function highlightError(input) {
      input.style.borderColor = '#ff5252';
      
      input.addEventListener('input', function() {
          this.style.borderColor = '';
      }, { once: true });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    
    toggleBtn.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('expanded');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });
  
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('expanded');
        } else {
            sidebar.classList.remove('collapsed');
        }
    });
});

const sidebar = document.querySelector('logo', 'bio', 'sidebar-content');


document.getElementById('hamburger-menu').addEventListener('click', function() {
    let sidebar = document.querySelector('.sidebar');
    
    // Toggle class 'active' pada sidebar
    sidebar.classList.toggle('active');
});
