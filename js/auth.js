// js/auth.js

// Appends suffix to phone number to generate synthetic email
function phoneToEmail(phone) {
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    return `${cleanPhone}@craftifyy.com`;
}

/**
 * Sign up a new customer.
 * @param {string} name 
 * @param {string} phone 
 * @param {string} password 
 * @returns {Promise<{user: any, error: any}>}
 */
async function signUpCustomer(name, phone, password) {
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    
    if (!isSupabaseReady()) {
        // Mock Register
        const mockProfile = {
            id: 'mock-user-id-' + cleanPhone,
            name: name,
            phone: cleanPhone,
            role: 'customer',
            created_at: new Date().toISOString()
        };
        localStorage.setItem('llc_mock_user', JSON.stringify(mockProfile));
        localStorage.setItem('llc_user_profile', JSON.stringify(mockProfile));
        return { user: { id: mockProfile.id }, error: null };
    }

    const email = phoneToEmail(phone);
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                phone: cleanPhone
            }
        }
    });

    if (error) return { user: null, error };
    return { user: data.user, error: null };
}

/**
 * Sign in a user (customer or admin).
 * @param {string} phone 
 * @param {string} password 
 * @returns {Promise<{user: any, error: any}>}
 */
async function signInUser(phone, password) {
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    
    if (!isSupabaseReady()) {
        // Mock Login
        let role = 'customer';
        let name = 'Customer (Mock)';
        
        // If logging in from an admin page or with the admin query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminQuery = urlParams.get('admin') === 'true';
        const path = window.location.pathname;
        const isAdminPath = path.includes('/admin/') || path.endsWith('/admin') || path.includes('/admin/index.html');
        
        if (isAdminQuery || isAdminPath) {
            // Secure mock owner credentials check
            if (cleanPhone === '9999999999' && password === 'password') {
                role = 'admin';
                name = 'Owner (Demo Mode)';
                
                const mockProfile = {
                    id: 'mock-admin-id',
                    name: name,
                    phone: cleanPhone,
                    role: role,
                    is_mock_session: true,
                    created_at: new Date().toISOString()
                };

                localStorage.setItem('llc_mock_user', JSON.stringify(mockProfile));
                localStorage.setItem('llc_user_profile', JSON.stringify(mockProfile));
                return { user: { id: mockProfile.id }, error: null };
            } else {
                return { user: null, error: { message: "Access Denied: Invalid administrator credentials for offline mode." } };
            }
        } else {
            // Customer Login
            const mockProfile = {
                id: 'mock-user-id-' + cleanPhone,
                name: name,
                phone: cleanPhone,
                role: role,
                created_at: new Date().toISOString()
            };

            localStorage.setItem('llc_mock_user', JSON.stringify(mockProfile));
            localStorage.setItem('llc_user_profile', JSON.stringify(mockProfile));
            return { user: { id: mockProfile.id }, error: null };
        }
    }

    const email = phoneToEmail(phone);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) return { user: null, error };
    return { user: data.user, error: null };
}

/**
 * Sign out the current user.
 */
async function signOutUser() {
    if (isSupabaseReady()) {
        await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('llc_mock_user');
    localStorage.removeItem('llc_user_profile');
    
    window.location.href = 'login.html';
}

/**
 * Get current session.
 */
async function getSession() {
    if (!isSupabaseReady()) {
        const mockUser = localStorage.getItem('llc_mock_user');
        return mockUser ? { user: JSON.parse(mockUser) } : null;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

/**
 * Fetch profiles record for current user.
 */
async function getCurrentUserProfile() {
    // Check cached profile first
    const cached = localStorage.getItem('llc_user_profile');
    if (cached) {
        try { return JSON.parse(cached); } catch(e) {}
    }

    if (!isSupabaseReady()) {
        const mockUser = localStorage.getItem('llc_mock_user');
        if (mockUser) {
            try {
                const user = JSON.parse(mockUser);
                localStorage.setItem('llc_user_profile', JSON.stringify(user));
                return user;
            } catch(e) {}
        }
        return null;
    }

    const session = await getSession();
    if (!session) {
        localStorage.removeItem('llc_user_profile');
        return null;
    }

    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

    if (error || !data) {
        return null;
    }

    // Cache the profile
    localStorage.setItem('llc_user_profile', JSON.stringify(data));
    return data;
}

/**
 * Verifies if the logged-in user is an admin.
 * Redirects to login page if they are not.
 */
async function checkAdminAccess() {
    const profile = await getCurrentUserProfile();
    const path = window.location.pathname;
    const isAdminPath = path.includes('/admin/') || path.endsWith('/admin') || path.includes('/admin/index.html');
    const basePath = isAdminPath ? '' : 'admin/';

    if (isSupabaseReady()) {
        if (!profile || profile.role !== 'admin') {
            alert("Access Denied: Admin authorization required.");
            window.location.href = `${basePath}login.html`;
            return;
        }
    } else {
        // Offline/Mock mode: Require designated mock admin session
        if (!profile || profile.role !== 'admin' || !profile.is_mock_session || profile.phone !== '9999999999') {
            alert("Access Denied: Offline Demo Admin authorization required.");
            window.location.href = `${basePath}login.html`;
            return;
        }
    }
}
