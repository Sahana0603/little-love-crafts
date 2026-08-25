// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    // 0. Enforce page authentication checks
    await enforcePageAuthentication();

    // 1. Inject Header & Footer
    injectHeader();
    injectFooter();
    injectSupabaseWarningModal();

    // 2. Track Active Navigation Link
    highlightActiveLink();

    // 3. Update Cart Count Indicator
    updateCartCountIndicator();
    window.addEventListener('cart-updated', updateCartCountIndicator);

    // 4. Update Navigation Session state (Login/Register/Logout)
    await updateNavSessionState();

    // 5. Setup Mobile Menu
    setupMobileMenu();
});

/**
 * Injects a global elegant header navbar onto all pages.
 */
function injectHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;

    // Check if we are inside the admin subfolder
    const isAdminPath = window.location.pathname.includes('/admin/');
    const basePath = isAdminPath ? '../' : '';

    headerEl.className = ''; // Reset class
    
    if (isAdminPath) {
        headerEl.innerHTML = `
            <div class="nav-container">
                <a href="${basePath}admin/index.html" class="logo-link">
                    <img src="${basePath}images/logo.jpeg" alt="Craftifyy Logo">
                    <h2>Craftifyy Owner Portal 🛠️</h2>
                </a>
                <nav id="navbar-links">
                    <!-- Sidebar is used for admin navigation -->
                </nav>
            </div>
        `;
        return;
    }

    headerEl.innerHTML = `
        <div class="nav-container">
            <a href="${basePath}index.html" class="logo-link">
                <img src="${basePath}images/logo.jpeg" alt="Craftifyy Logo">
                <h2>Craftifyy</h2>
            </a>
            
            <nav id="navbar-links">
                <a href="${basePath}index.html" id="nav-home">Home</a>
                <a href="${basePath}shop.html" id="nav-shop">Shop</a>
                <a href="${basePath}about.html" id="nav-about">About Us</a>
                <a href="${basePath}reviews.html" id="nav-reviews">Reviews</a>
                <a href="${basePath}contact.html" id="nav-contact">Contact</a>
                <a href="${basePath}login.html" id="nav-login" class="auth-required-nav">Login / Register</a>
                <a href="#" id="nav-logout" class="auth-required-nav" style="display:none;" onclick="signOutUser(); return false;">Logout</a>
            </nav>

            <div class="nav-icons">
                <a href="${basePath}cart.html" class="cart-icon-btn" aria-label="Shopping Cart">
                    🛒 <span class="cart-count" id="cart-indicator">0</span>
                </a>
                <button class="mobile-menu-toggle" id="menu-toggle" aria-label="Toggle Menu">☰</button>
            </div>
        </div>
    `;

    // Inject Demo / Offline Mode banner for admin pages
    if (isAdminPath && !isSupabaseReady()) {
        if (!document.getElementById('demo-mode-alert-banner')) {
            const demoBanner = document.createElement('div');
            demoBanner.id = 'demo-mode-alert-banner';
            demoBanner.style.backgroundColor = '#b37d82';
            demoBanner.style.color = '#fff';
            demoBanner.style.textAlign = 'center';
            demoBanner.style.padding = '8px 12px';
            demoBanner.style.fontSize = '13px';
            demoBanner.style.fontWeight = '700';
            demoBanner.style.letterSpacing = '0.5px';
            demoBanner.style.position = 'relative';
            demoBanner.style.zIndex = '99999';
            demoBanner.innerHTML = '⚡ DEMO / OFFLINE MODE: Storefront changes persist in localStorage. Database is disconnected.';
            document.body.prepend(demoBanner);
        }
    }
}

/**
 * Injects a global elegant footer on all pages.
 */
function injectFooter() {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;

    const isAdminPath = window.location.pathname.includes('/admin/');
    const basePath = isAdminPath ? '../' : '';

    footerEl.className = ''; // Reset class
    
    if (isAdminPath) {
        footerEl.innerHTML = `
            <div class="container" style="text-align: center; padding: 20px 0; border-top: 1px solid var(--border-color);">
                <p>&copy; Craftifyy 💕 Owner Dashboard. All rights reserved.</p>
            </div>
        `;
        return;
    }

    footerEl.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>Craftifyy</h3>
                    <p>We create beautiful customized handmade gifts designed to celebrate your special moments. Crafted with love, care, and premium-quality materials.</p>
                    <p>🇮🇳 Pan-India Delivery | Advance Payment Only</p>
                </div>
                <div class="footer-col">
                    <h3>Our Shop</h3>
                    <ul class="footer-links">
                        <li><a href="${basePath}shop.html?category=Hampers">Gift Hampers</a></li>
                        <li><a href="${basePath}shop.html?category=Bouquets">Flower Bouquets</a></li>
                        <li><a href="${basePath}shop.html?category=Resin%20Arts">Resin Arts</a></li>
                        <li><a href="${basePath}shop.html?category=Photo%20Frames">Photo Frames</a></li>
                        <li><a href="${basePath}shop.html?category=Photo%20Bouquets">Photo Bouquets</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Important Links</h3>
                    <ul class="footer-links">
                        <li><a href="${basePath}about.html">About Us</a></li>
                        <li><a href="${basePath}reviews.html">Customer Reviews</a></li>
                        <li><a href="${basePath}contact.html">Contact Support</a></li>
                        
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Connect With Us</h3>
                    <p><strong>WhatsApp:</strong> 7892510154</p>
                    <p><strong>Instagram:</strong> craftifyy.in</p>
                    <p><strong>Email:</strong> craftifyy27@gmail.com</p>
                    <div class="footer-socials">
                        <a href="https://wa.me/917892510154" target="_blank" class="social-icon-btn" aria-label="WhatsApp">💬</a>
                        <a href="https://instagram.com/craftifyy.in" target="_blank" class="social-icon-btn" aria-label="Instagram">📸</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; Craftifyy 💕 Handmade with Love. All rights reserved.</p>
            </div>
        </div>
        
        <!-- Floating WhatsApp Widget -->
        <a href="https://wa.me/917892510154" target="_blank" class="floating-whatsapp" aria-label="Chat on WhatsApp">💬</a>
    `;
}

/**
 * Active link highlight based on window path name.
 */
function highlightActiveLink() {
    const path = window.location.pathname;
    
    // De-activate all first
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    
    if (path.includes('index.html') || path.endsWith('/')) {
        setActive('nav-home');
    } else if (path.includes('shop.html') || path.includes('product-details.html')) {
        setActive('nav-shop');
    } else if (path.includes('about.html')) {
        setActive('nav-about');
    } else if (path.includes('reviews.html')) {
        setActive('nav-reviews');
    } else if (path.includes('contact.html')) {
        setActive('nav-contact');
    } else if (path.includes('login.html')) {
        setActive('nav-login');
    }

    function setActive(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }
}

/**
 * Updates cart count number inside cart indicator badge.
 */
function updateCartCountIndicator() {
    const indicator = document.getElementById('cart-indicator');
    if (!indicator) return;

    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    indicator.textContent = count;
}

/**
 * Toggles session-dependent login/logout buttons in nav and updates dashboard link
 */
async function updateNavSessionState() {
    const isAdminPath = window.location.pathname.includes('/admin/');
    if (isAdminPath) return; // Skip updating storefront session labels on admin pages
    
    const profile = await getCurrentUserProfile();
    const loginLink = document.getElementById('nav-login');
    const logoutLink = document.getElementById('nav-logout');
    const footerAdminLink = document.getElementById('footer-admin-link');
    
    const basePath = '';

    if (profile) {
        if (loginLink) {
            // Change text of login link to customer name or profile
            loginLink.textContent = profile.name.split(' ')[0];
            loginLink.href = '#';
            loginLink.style.pointerEvents = 'none'; // Logged in, no need to navigate to login
        }
        if (logoutLink) {
            logoutLink.style.display = 'inline-block';
        }
        if (footerAdminLink) {
            footerAdminLink.style.display = 'none'; // Hide owner dashboard link
        }
    } else {
        if (loginLink) {
            loginLink.textContent = "Login / Register";
            loginLink.href = `${basePath}login.html`;
            loginLink.style.pointerEvents = 'auto';
        }
        if (logoutLink) {
            logoutLink.style.display = 'none';
        }
        if (footerAdminLink) {
            footerAdminLink.style.display = 'none'; // Hide owner dashboard link
        }
    }
}

/**
 * Mobile sidebar nav drawer toggle
 */
function setupMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('navbar-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.textContent = nav.classList.contains('active') ? '✖' : '☰';
    });
}

/**
 * Injects a visual banner if Supabase is still unconfigured, with configuration utilities.
 */
function injectSupabaseWarningModal() {
    if (isSupabaseReady()) return;

    // We only display the warning configuration overlay on the frontend if they haven't connected yet.
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = '#6D5959';
    container.style.color = '#fff';
    container.style.padding = '12px 18px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
    container.style.fontFamily = 'sans-serif';
    container.style.fontSize = '12px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '10px';

    container.innerHTML = `
        <span>⚠️ Supabase is not connected yet.</span>
        <button id="open-config-btn" style="background-color: #E8C5C8; color: #2C2525; padding: 4px 8px; border-radius: 4px; font-weight:bold;">Connect Database</button>
    `;

    document.body.appendChild(container);

    const openBtn = document.getElementById('open-config-btn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            openConfigurationModal();
        });
    }
}

function openConfigurationModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';

    modal.innerHTML = `
        <div style="background-color:#FCFAF7; padding:30px; border-radius:12px; max-width:450px; width:100%; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-family:'Inter', sans-serif;">
            <h3 style="margin-bottom:15px; font-family:'Outfit',sans-serif; font-size:20px; color:#2C2525;">Connect Your Supabase Project</h3>
            <p style="font-size:13px; color:#5A4E4E; margin-bottom:20px; line-height:1.4;">
                Please input your Supabase project API credentials. You can find these in your Supabase dashboard under <strong>Project Settings -> API</strong>.
            </p>
            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">SUPABASE_URL</label>
                <input type="text" id="db-url" placeholder="https://xxxxxx.supabase.co" style="width:100%; padding:10px; font-size:13px; border:1px solid #ECE3D7; border-radius:6px; outline:none;" value="${localStorage.getItem('LLC_SUPABASE_URL') || ''}">
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">SUPABASE_ANON_KEY</label>
                <input type="password" id="db-key" placeholder="eyJhbGciOiJIUzI1Ni..." style="width:100%; padding:10px; font-size:13px; border:1px solid #ECE3D7; border-radius:6px; outline:none;" value="${localStorage.getItem('LLC_SUPABASE_ANON_KEY') || ''}">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button id="close-config-btn" style="background:none; border:none; padding:10px 15px; font-size:13px; font-weight:600; color:#5A4E4E; cursor:pointer;">Cancel</button>
                <button id="save-config-btn" style="background-color:#B37D82; color:#fff; padding:10px 20px; font-size:13px; font-weight:600; border-radius:6px; border:none; cursor:pointer;">Save Credentials</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-config-btn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('save-config-btn').addEventListener('click', () => {
        const url = document.getElementById('db-url').value;
        const key = document.getElementById('db-key').value;
        if (url && key) {
            saveSupabaseCredentials(url, key);
            alert("Credentials saved! Page will reload to establish connection.");
            window.location.reload();
        } else {
            alert("Please fill in both fields.");
        }
    });
}

/**
 * Enforces authentication redirects on protected client routes.
 */
async function enforcePageAuthentication() {
    const path = window.location.pathname;
    const profile = await getCurrentUserProfile();
    
    // Handle admin directory pages
    if (path.includes('/admin/')) {
        if (path.includes('login.html')) {
            // Admin visiting /admin/login.html -> redirect to /admin/index.html
            if (profile && profile.role === 'admin') {
                if (isSupabaseReady() || (profile.is_mock_session && profile.phone === '9999999999')) {
                    window.location.href = 'index.html';
                }
            }
            return;
        }
        
        // Protected Admin Pages (e.g. index.html, products.html, offers.html)
        if (isSupabaseReady()) {
            if (!profile || profile.role !== 'admin') {
                window.location.href = 'login.html'; // Go to /admin/login.html
            }
        } else {
            if (!profile || profile.role !== 'admin' || !profile.is_mock_session || profile.phone !== '9999999999') {
                window.location.href = 'login.html'; // Go to /admin/login.html
            }
        }
        return;
    }

    // Handle customer login page bypass
    if (path.includes('login.html')) {
        if (profile) {
            // Already logged in customer -> redirect to storefront index
            window.location.href = 'index.html';
        }
        return;
    }

    // List of customer-facing pages that require authentication
    const protectedPages = [
        'index.html',
        'shop.html',
        'product-details.html',
        'cart.html',
        'reviews.html',
        'about.html',
        'contact.html'
    ];

    // Check if the current page is protected (or is the directory index root '/')
    const isProtected = protectedPages.some(page => path.includes(page)) || path.endsWith('/');

    if (isProtected) {
        if (!profile) {
            // Redirect to customer login.html
            const basePath = path.includes('/admin/') ? '../' : '';
            window.location.href = `${basePath}login.html`;
        }
    }
}
