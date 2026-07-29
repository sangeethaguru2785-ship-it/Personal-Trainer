document.addEventListener('DOMContentLoaded', function() {

    // ===== GSAP Entrance Animations =====
    if (typeof gsap !== 'undefined') {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.auth-left-content > *', {
            opacity: 0, x: -40, duration: 0.6, stagger: 0.12
        })
        .from('.auth-form-wrapper > :not(.auth-go-home)', {
            opacity: 0, y: 25, duration: 0.5, stagger: 0.08
        }, '-=0.4');

        // Floating animation for left panel features
        gsap.to('.auth-left-features', {
            y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
    }

    // ===== Role Toggle =====
    var roleBtns = document.querySelectorAll('.auth-role-btn');
    var roleInput = document.getElementById('loginRole') || document.getElementById('signupRole');

    roleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            roleBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            if (roleInput) roleInput.value = this.getAttribute('data-role');

            // Animate role switch
            if (typeof gsap !== 'undefined') {
                gsap.from('.auth-form-group', {
                    opacity: 0, y: 10, duration: 0.3, stagger: 0.05, ease: 'power2.out'
                });
            }
        });
    });

    // ===== Show/Hide Password =====
    document.querySelectorAll('.auth-toggle-pass').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            var icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }

            // Micro animation
            if (typeof gsap !== 'undefined') {
                gsap.from(icon, { scale: 0.5, duration: 0.25, ease: 'back.out(2)' });
            }
        });
    });

    // ===== Validation Helpers =====
    function showError(groupId, errorId, message) {
        var group = document.getElementById(groupId);
        var error = document.getElementById(errorId);
        if (group) group.classList.add('auth-error-state');
        if (error) { error.textContent = message; error.style.display = 'block'; }
    }

    function clearError(groupId, errorId) {
        var group = document.getElementById(groupId);
        var error = document.getElementById(errorId);
        if (group) group.classList.remove('auth-error-state');
        if (error) { error.textContent = ''; error.style.display = 'none'; }
    }

    function setValid(groupId) {
        var group = document.getElementById(groupId);
        if (group) { group.classList.remove('auth-error-state'); group.classList.add('auth-valid-state'); }
    }

    function validateEmail(email) {
        return /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(email);
    }

    function validatePassword(pw) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(pw);
    }

    // ===== Real-time Validation =====
    // Login Email
    var loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showError('loginEmailGroup', 'loginEmailError', 'Email is required');
            } else if (!validateEmail(this.value)) {
                showError('loginEmailGroup', 'loginEmailError', 'Please enter a valid email');
            } else {
                clearError('loginEmailGroup', 'loginEmailError');
                setValid('loginEmailGroup');
            }
        });
        loginEmail.addEventListener('input', function() {
            if (this.value.trim()) clearError('loginEmailGroup', 'loginEmailError');
        });
    }

    // Login Password
    var loginPass = document.getElementById('loginPassword');
    if (loginPass) {
        loginPass.addEventListener('blur', function() {
            if (!this.value) {
                showError('loginPasswordGroup', 'loginPasswordError', 'Password is required');
            } else if (!validatePassword(this.value)) {
                showError('loginPasswordGroup', 'loginPasswordError', 'Must include uppercase, lowercase, number & special character');
            } else {
                clearError('loginPasswordGroup', 'loginPasswordError');
                setValid('loginPasswordGroup');
            }
        });
        loginPass.addEventListener('input', function() {
            if (this.value) clearError('loginPasswordGroup', 'loginPasswordError');
        });
    }

    // Signup fields real-time
    var signupFields = [
        { id: 'signupFirstName', group: 'signupFirstNameGroup', error: 'signupFirstNameError', label: 'First name' },
        { id: 'signupLastName', group: 'signupLastNameGroup', error: 'signupLastNameError', label: 'Last name' }
    ];

    signupFields.forEach(function(f) {
        var el = document.getElementById(f.id);
        if (el) {
            el.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    showError(f.group, f.error, f.label + ' is required');
                } else if (!/^[A-Za-z]+$/.test(this.value.trim())) {
                    showError(f.group, f.error, f.label + ' must contain only letters');
                } else {
                    clearError(f.group, f.error);
                    setValid(f.group);
                }
            });
            el.addEventListener('input', function() {
                if (this.value.trim()) clearError(f.group, f.error);
            });
        }
    });

    // Signup Email
    var signupEmail = document.getElementById('signupEmail');
    if (signupEmail) {
        signupEmail.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showError('signupEmailGroup', 'signupEmailError', 'Email is required');
            } else if (!validateEmail(this.value)) {
                showError('signupEmailGroup', 'signupEmailError', 'Please enter a valid email');
            } else {
                clearError('signupEmailGroup', 'signupEmailError');
                setValid('signupEmailGroup');
            }
        });
        signupEmail.addEventListener('input', function() {
            if (this.value.trim()) clearError('signupEmailGroup', 'signupEmailError');
        });
    }

    // Signup Password with strength meter
    var signupPass = document.getElementById('signupPassword');
    var passFill = document.getElementById('passFill');
    var passText = document.getElementById('passText');

    if (signupPass) {
        signupPass.addEventListener('input', function() {
            var val = this.value;
            var strength = 0;
            if (val.length >= 6) strength++;
            if (val.length >= 10) strength++;
            if (/[a-z]/.test(val)) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            var levels = [
                { width: '0%', color: 'transparent', text: '' },
                { width: '16%', color: '#C41E3A', text: 'Very Weak' },
                { width: '33%', color: '#E8572A', text: 'Weak' },
                { width: '50%', color: '#E9C46A', text: 'Fair' },
                { width: '66%', color: '#2A9D8F', text: 'Good' },
                { width: '83%', color: '#2A9D8F', text: 'Strong' },
                { width: '100%', color: '#00c896', text: 'Very Strong' }
            ];

            var level = levels[strength] || levels[0];
            if (passFill) { passFill.style.width = level.width; passFill.style.background = level.color; }
            if (passText) { passText.textContent = level.text; passText.style.color = level.color; }

            if (val) clearError('signupPasswordGroup', 'signupPasswordError');
        });

        signupPass.addEventListener('blur', function() {
            if (!this.value) {
                showError('signupPasswordGroup', 'signupPasswordError', 'Password is required');
            } else if (!validatePassword(this.value)) {
                showError('signupPasswordGroup', 'signupPasswordError', 'Must include uppercase, lowercase, number & special character');
            } else {
                clearError('signupPasswordGroup', 'signupPasswordError');
                setValid('signupPasswordGroup');
            }
        });
    }

    // Signup Confirm Password
    var signupConfirm = document.getElementById('signupConfirm');
    if (signupConfirm) {
        signupConfirm.addEventListener('blur', function() {
            var pass = document.getElementById('signupPassword');
            if (!this.value) {
                showError('signupConfirmGroup', 'signupConfirmError', 'Please confirm your password');
            } else if (pass && this.value !== pass.value) {
                showError('signupConfirmGroup', 'signupConfirmError', 'Passwords do not match');
            } else {
                clearError('signupConfirmGroup', 'signupConfirmError');
                setValid('signupConfirmGroup');
            }
        });
        signupConfirm.addEventListener('input', function() {
            if (this.value) clearError('signupConfirmGroup', 'signupConfirmError');
        });
    }

    // ===== Remember Me Checkbox =====
    var rememberMe = document.getElementById('rememberMe');
    if (rememberMe) {
        rememberMe.addEventListener('change', function() {
            if (this.checked) clearError('loginRememberGroup', 'loginRememberError');
        });
    }

    // ===== Login Form Submit =====
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var valid = true;

            var email = document.getElementById('loginEmail');
            var pass = document.getElementById('loginPassword');
            var remember = document.getElementById('rememberMe');

            if (!remember.checked) {
                showError('loginRememberGroup', 'loginRememberError', 'Please select the Remember Me checkbox');
                valid = false;
            }

            if (!email.value.trim()) {
                showError('loginEmailGroup', 'loginEmailError', 'Email is required');
                valid = false;
            } else if (!validateEmail(email.value)) {
                showError('loginEmailGroup', 'loginEmailError', 'Please enter a valid email');
                valid = false;
            }

            if (!pass.value) {
                showError('loginPasswordGroup', 'loginPasswordError', 'Password is required');
                valid = false;
            } else if (!validatePassword(pass.value)) {
                showError('loginPasswordGroup', 'loginPasswordError', 'Must include uppercase, lowercase, number & special character');
                valid = false;
            }

            if (valid) {
                var btn = this.querySelector('.auth-submit-btn');
                var btnText = btn.querySelector('.auth-btn-text');
                var btnLoader = btn.querySelector('.auth-btn-loader');
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline';
                btn.disabled = true;

                // Simulate login
                var role = document.getElementById('loginRole').value;
                var userName = email.value.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                localStorage.setItem('dashUserName', userName);
                localStorage.setItem('dashUserEmail', email.value.trim());
                localStorage.setItem('dashUserRole', role);
                setTimeout(function() {
                    window.location.href = role === 'trainer' ? 'trainer-dashboard.html' : 'member-dashboard.html';
                }, 1500);
            } else {
                // Shake animation on error
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo('.auth-error-state', { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
                }
            }
        });
    }

    // ===== Signup Form Submit =====
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var valid = true;

            var firstName = document.getElementById('signupFirstName');
            var lastName = document.getElementById('signupLastName');
            var email = document.getElementById('signupEmail');
            var pass = document.getElementById('signupPassword');
            var confirm = document.getElementById('signupConfirm');
            var terms = document.getElementById('agreeTerms');

            if (!firstName.value.trim()) {
                showError('signupFirstNameGroup', 'signupFirstNameError', 'First name is required');
                valid = false;
            } else if (!/^[A-Za-z]+$/.test(firstName.value.trim())) {
                showError('signupFirstNameGroup', 'signupFirstNameError', 'First name must contain only letters');
                valid = false;
            }
            if (!lastName.value.trim()) {
                showError('signupLastNameGroup', 'signupLastNameError', 'Last name is required');
                valid = false;
            } else if (!/^[A-Za-z]+$/.test(lastName.value.trim())) {
                showError('signupLastNameGroup', 'signupLastNameError', 'Last name must contain only letters');
                valid = false;
            }
            if (!email.value.trim()) {
                showError('signupEmailGroup', 'signupEmailError', 'Email is required');
                valid = false;
            } else if (!validateEmail(email.value)) {
                showError('signupEmailGroup', 'signupEmailError', 'Please enter a valid email');
                valid = false;
            }
            if (!pass.value) {
                showError('signupPasswordGroup', 'signupPasswordError', 'Password is required');
                valid = false;
            } else if (!validatePassword(pass.value)) {
                showError('signupPasswordGroup', 'signupPasswordError', 'Must include uppercase, lowercase, number & special character');
                valid = false;
            }
            if (!confirm.value) {
                showError('signupConfirmGroup', 'signupConfirmError', 'Please confirm your password');
                valid = false;
            } else if (confirm.value !== pass.value) {
                showError('signupConfirmGroup', 'signupConfirmError', 'Passwords do not match');
                valid = false;
            }
            if (!terms.checked) {
                showError('agreeTermsGroup', 'agreeTermsError', 'You must agree to the terms');
                valid = false;
            }

            var phone = document.getElementById('signupPhone');
            if (phone && phone.value.trim() && !/^[0-9]*$/.test(phone.value.trim())) {
                showError('signupPhoneGroup', 'signupPhoneError', 'Phone must contain only numbers');
                valid = false;
            }

            if (valid) {
                var btn = this.querySelector('.auth-submit-btn');
                var btnText = btn.querySelector('.auth-btn-text');
                var btnLoader = btn.querySelector('.auth-btn-loader');
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline';
                btn.disabled = true;

                // Simulate signup
                var firstName = document.getElementById('signupFirstName').value.trim();
                var lastName = document.getElementById('signupLastName').value.trim();
                var fullName = firstName + ' ' + lastName;
                localStorage.setItem('dashUserName', fullName);
                localStorage.setItem('dashUserEmail', document.getElementById('signupEmail').value.trim());
                localStorage.setItem('dashUserRole', document.getElementById('signupRole').value);
                setTimeout(function() {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo('.auth-error-state', { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
                }
            }
        });
    }

    // ===== Forgot Password Form =====
    var forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('forgotEmail');
            if (email && email.value.trim() && validateEmail(email.value)) {
                var btn = this.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Link Sent!';
                btn.classList.remove('btn-accent');
                btn.classList.add('btn-outline-accent');
                setTimeout(function() {
                    var modal = bootstrap.Modal.getInstance(document.getElementById('forgotModal'));
                    if (modal) modal.hide();
                    btn.innerHTML = 'Send Reset Link';
                    btn.classList.add('btn-accent');
                    btn.classList.remove('btn-outline-accent');
                }, 2500);
            }
        });
    }

});
