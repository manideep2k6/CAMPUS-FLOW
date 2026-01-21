// Authentication JavaScript

// Check if user is logged in
async function checkAuth() {
    try {
        const response = await fetch('api/auth.php?action=check');
        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Auth check failed:', error);
        return null;
    }
}

// Login function
async function login(username, password) {
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });
        
        const text = await response.text();
        
        // Check if it's an HTML error page (means PHP isn't running)
        if (text.includes('<!DOCTYPE') || text.includes('<html') || text.trim().startsWith('<')) {
            return { 
                error: '❌ PHP is NOT running! You are using the wrong server.\n\n✅ SOLUTION:\n1. Stop Live Server (port 5500)\n2. Use XAMPP Apache instead\n3. Access via: http://localhost/campusflow/\n4. Make sure Apache is running in XAMPP\n\nSee FIX_500_ERROR_NOW.txt for detailed instructions.' 
            };
        }
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Response text:', text);
            return { error: 'Invalid response: ' + text.substring(0, 200) };
        }
        
        // Handle error responses
        if (!response.ok) {
            if (data && data.error) {
                if (data.error.includes('Database connection failed')) {
                    return { error: 'Database Error: ' + data.error + '\n\nMake sure:\n1. MySQL is running in XAMPP\n2. Database "campus_flow" exists\n3. Import database.sql in phpMyAdmin' };
                }
                return { error: data.error };
            }
            return { error: 'Server error (HTTP ' + response.status + '). Check browser console for details.' };
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return { 
                error: '❌ Cannot connect to server!\n\n✅ SOLUTION:\n1. Use XAMPP Apache (not Live Server)\n2. Access via: http://localhost/campusflow/\n3. Start Apache in XAMPP Control Panel\n4. Check FIX_500_ERROR_NOW.txt' 
            };
        }
        
        return { error: 'Network error: ' + error.message };
    }
}

// Register function
async function register(formData) {
    formData.append('action', 'register');

    try {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });
        
        const text = await response.text();
        
        // Check if it's an HTML error page (means PHP isn't running)
        if (text.includes('<!DOCTYPE') || text.includes('<html') || text.trim().startsWith('<')) {
            return { 
                error: '❌ PHP is NOT running! You are using the wrong server.\n\n✅ SOLUTION:\n1. Stop Live Server (port 5500)\n2. Use XAMPP Apache instead\n3. Access via: http://localhost/campusflow/\n4. Make sure Apache is running in XAMPP\n\nSee FIX_500_ERROR_NOW.txt for detailed instructions.' 
            };
        }
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Response text:', text);
            return { error: 'Invalid response: ' + text.substring(0, 200) };
        }
        
        // Handle error responses
        if (!response.ok) {
            if (data && data.error) {
                if (data.error.includes('Database connection failed')) {
                    return { error: 'Database Error: ' + data.error + '\n\nMake sure:\n1. MySQL is running in XAMPP\n2. Database "campus_flow" exists\n3. Import database.sql in phpMyAdmin' };
                }
                return { error: data.error };
            }
            return { error: 'Server error (HTTP ' + response.status + '). Check browser console for details.' };
        }
        
        return data;
    } catch (error) {
        console.error('Register error:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return { 
                error: '❌ Cannot connect to server!\n\n✅ SOLUTION:\n1. Use XAMPP Apache (not Live Server)\n2. Access via: http://localhost/campusflow/\n3. Start Apache in XAMPP Control Panel\n4. Check FIX_500_ERROR_NOW.txt' 
            };
        }
        
        return { error: 'Network error: ' + error.message };
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('api/auth.php?action=logout');
        const data = await response.json();
        if (data.success) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Redirect if not logged in
async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Initialize auth on pages that need it
document.addEventListener('DOMContentLoaded', function() {
    // Login/Register form handling
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginFormDiv = document.getElementById('loginForm');
    const registerFormDiv = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            if (errorMessage) errorMessage.style.display = 'none';

            try {
                const result = await login(username, password);
                
                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = result.error || 'Login failed';
                        errorMessage.style.display = 'block';
                    }
                    console.error('Login error:', result);
                }
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = 'An unexpected error occurred. Please check the console.';
                    errorMessage.style.display = 'block';
                }
                console.error('Login exception:', error);
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            
            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;
            if (errorMessage) errorMessage.style.display = 'none';

            try {
                const result = await register(formData);
                
                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = result.error || 'Registration failed';
                        errorMessage.style.display = 'block';
                    }
                    console.error('Registration error:', result);
                }
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = 'An unexpected error occurred. Please check the console.';
                    errorMessage.style.display = 'block';
                }
                console.error('Registration exception:', error);
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormDiv.style.display = 'none';
            registerFormDiv.style.display = 'block';
            errorMessage.style.display = 'none';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerFormDiv.style.display = 'none';
            loginFormDiv.style.display = 'block';
            errorMessage.style.display = 'none';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
});

