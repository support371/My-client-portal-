const USERS = {
    'superadmin@gem.com': { password: 'super123', role: 'superadmin', name: 'Super Admin' },
    'admin@gem.com': { password: 'admin123', role: 'admin', name: 'Organization Admin' },
    'team@gem.com': { password: 'team123', role: 'team', name: 'Team Member' },
    'client@gem.com': { password: 'client123', role: 'client', name: 'Platform Client' }
};

const Auth = {
    login: (email, password) => {
        const user = USERS[email];
        if (user && user.password === password) {
            const session = {
                email,
                role: user.role,
                name: user.name,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('gem_session', JSON.stringify(session));
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('gem_session');
        window.location.href = 'login.html';
    },

    getSession: () => {
        const session = localStorage.getItem('gem_session');
        return session ? JSON.parse(session) : null;
    },

    isAuthenticated: () => {
        return !!Auth.getSession();
    },

    checkAccess: (requiredRole) => {
        const session = Auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return false;
        }
        if (requiredRole && session.role !== requiredRole && session.role !== 'superadmin') {
            alert('Access Denied: You do not have permission to view this page.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    init: () => {
        const session = Auth.getSession();
        const path = window.location.pathname;
        const page = path.split('/').pop();

        // Redirect to login if not authenticated and not on login page
        if (!session && page !== 'login.html' && page !== '' && page !== 'index.html') {
            window.location.href = 'login.html';
        }

        // Update UI with user info if it exists
        if (session) {
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => el.textContent = session.name);

            const userRoleElements = document.querySelectorAll('.user-role');
            userRoleElements.forEach(el => el.textContent = session.role.toUpperCase());
        }
    }
};

window.Auth = Auth;
document.addEventListener('DOMContentLoaded', Auth.init);
