// js/supabase-config.js

// Set your Supabase credentials here for deployment:
const SUPABASE_URL_DEFAULT = "https://nzaithqyfmuhkyuqmjvg.supabase.co";
const SUPABASE_ANON_KEY_DEFAULT = "sb_publishable_5PLaBfYl4Ot8nAnZxHQ18g_J09UNNcB";

// For local development and testing, you can also store credentials in localStorage
const SUPABASE_URL = localStorage.getItem('LLC_SUPABASE_URL') || SUPABASE_URL_DEFAULT;
const SUPABASE_ANON_KEY = localStorage.getItem('LLC_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY_DEFAULT;

let supabaseClient = null;

if (typeof window.supabase !== 'undefined' && 
    SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL" && 
    SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY" &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY") {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Checks if Supabase is configured and initialized.
 * @returns {boolean}
 */
function isSupabaseReady() {
    return supabaseClient !== null;
}

/**
 * Saves credentials to localStorage (useful for owner initialization).
 * @param {string} url 
 * @param {string} anonKey 
 */
function saveSupabaseCredentials(url, anonKey) {
    if (!url || !anonKey) return false;
    localStorage.setItem('LLC_SUPABASE_URL', url.trim());
    localStorage.setItem('LLC_SUPABASE_ANON_KEY', anonKey.trim());
    return true;
}

/**
 * Clears localStorage credentials to revert to default code-level credentials.
 */
function clearSupabaseCredentials() {
    localStorage.removeItem('LLC_SUPABASE_URL');
    localStorage.removeItem('LLC_SUPABASE_ANON_KEY');
}

// ===================================================
// LOCAL FALLBACK DATA (For Offline/Pre-Connect Mode)
// ===================================================

const MOCK_PRODUCTS = [
    {
        id: "mock-hamper-1",
        name: "Gift Hamper Premium Box",
        category: "Hampers",
        description: "Beautiful handmade curation containing Fruits, Dry Fruits, Sweet Box, Teddy Bear or Crochet Keychain, Happy Birthday Prop, Diary, Chocolates, Mini Perfume, Phone Cover, Hair Clips. Customisable in any budget or occasion.",
        price: 799,
        original_price: 1299,
        is_starts_from: true,
        image_url: "images/hamper/p5.jpeg",
        available: true,
        featured: true,
        customizable: true
    },
    {
        id: "mock-bouquet-1",
        name: "Crochet Lily & Tulip Bouquet",
        category: "Bouquets",
        description: "Elegant arrangement featuring 2 Crochet lilies, 2 tulips, 3 roses, 1 leaf stick. Can be customised according to the size and number of flowers.",
        price: 1499,
        original_price: null,
        is_starts_from: false,
        image_url: "images/flower/p13.jpeg",
        available: true,
        featured: true,
        customizable: true
    },
    {
        id: "mock-bouquet-2",
        name: "Crochet Heart & Rose Bouquet",
        category: "Bouquets",
        description: "Warm personalized design containing 1 Crochet heart with honey bee, 1 crochet tulip, 1 crochet rose. Custom creations for every occasion.",
        price: 999,
        original_price: null,
        is_starts_from: false,
        image_url: "images/flower/p14.jpeg",
        available: true,
        featured: false,
        customizable: true
    },
    {
        id: "mock-resin-1",
        name: "Customized Resin Art Creations",
        category: "Resin Arts",
        description: "Fully customized resin art creations for every occasion. Whether you have a specific design, theme, or budget in mind, we can create unique pieces specially made for you. Final pricing depends on size and design details.",
        price: 1799,
        original_price: null,
        is_starts_from: true,
        image_url: "images/decor/p12.jpeg",
        available: true,
        featured: true,
        customizable: true
    },
    {
        id: "mock-resin-2",
        name: "Resin Keychains & Accessories",
        category: "Resin Arts",
        description: "Beautiful handmade resin keychains and small accessories, customized with your name, initials, or small foils. Starts from just 99.",
        price: 99,
        original_price: null,
        is_starts_from: true,
        image_url: "images/decor/p16.jpeg",
        available: true,
        featured: false,
        customizable: true
    },
    {
        id: "mock-frames-1",
        name: "Personalized Photo Frames",
        category: "Photo Frames",
        description: "Available in various sizes and fully customizable to match your budget, style, and occasion. Final pricing depends on the size and customization selected.",
        price: 599,
        original_price: null,
        is_starts_from: true,
        image_url: "images/frames/p3.jpeg",
        available: true,
        featured: true,
        customizable: true
    },
    {
        id: "mock-bouquets-2",
        name: "Personalized Photo Bouquets",
        category: "Photo Bouquets",
        description: "Unique combination of print photographs and floral design elements, custom-made for anniversaries and birthdays. Pricing depends on photo quantity.",
        price: 1149,
        original_price: null,
        is_starts_from: true,
        image_url: "images/frames/p8.jpeg",
        available: true,
        featured: false,
        customizable: true
    },
    {
        id: "mock-clocks-1",
        name: "Customized Resin Clocks",
        category: "Clocks",
        description: "Beautiful handmade wall clocks customized with photos, colors, and designs of your choice. A timeless gift for weddings and home warming.",
        price: 1299,
        original_price: null,
        is_starts_from: true,
        image_url: "images/clock/p2.jpeg",
        available: true,
        featured: false,
        customizable: true
    },
    {
        id: "mock-decor-1",
        name: "Handmade Decor Items",
        category: "Decor",
        description: "Unique handcrafted home decor accessories and aesthetic display items to light up your space.",
        price: 499,
        original_price: null,
        is_starts_from: true,
        image_url: "images/decor/p11.jpeg",
        available: true,
        featured: false,
        customizable: true
    }
];

const MOCK_REVIEWS = [
    {
        id: "mock-rev-1",
        customer_name: "Aishwarya S.",
        rating: 5,
        review_text: "Absolutely loved the gift hamper! The crochet keychain was incredibly cute, and the premium packaging made it look so luxury. Highly recommend for custom gifts!",
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
    },
    {
        id: "mock-rev-2",
        customer_name: "Rahul Sharma",
        rating: 5,
        review_text: "Ordered a customized resin clock for my wedding anniversary. It came out beautiful and exactly as I imagined. Thank you Craftifyy!",
        created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    },
    {
        id: "mock-rev-3",
        customer_name: "Sahana Rao",
        rating: 5,
        review_text: "The crochet lily bouquet looks so realistic and matches the Pinterest inspiration reference photo I sent. Pan-India shipping was fast and safe.",
        created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString()
    }
];

const MOCK_OFFERS = [
    {
        id: "mock-off-1",
        title: "20% OFF on Birthday Hampers",
        description: "Celebrate birthdays in style with our curated premium gift hampers. Use code BDAY20 on WhatsApp inquiry.",
        discount_type: "percentage",
        discount_value: 20,
        active: true,
        start_date: "2026-08-01",
        end_date: "2026-08-31"
    },
    {
        id: "mock-off-2",
        title: "₹100 OFF on orders above ₹999",
        description: "Get flat ₹100 discount on any customizable craft order totaling more than ₹999.",
        discount_type: "fixed",
        discount_value: 100,
        active: true,
        start_date: "2026-08-01",
        end_date: "2026-12-31"
    },
    {
        id: "mock-off-3",
        title: "Festive Special — Limited Time Offer",
        description: "Handcrafted resin designs and photo frames personalized for the holiday season. Pan-India shipping available.",
        discount_type: "message",
        discount_value: 0,
        active: false,
        start_date: "2026-08-05",
        end_date: "2026-08-15"
    }
];

// ===================================================
// PERSISTENT OFFLINE DATA HELPERS
// ===================================================

function getMockProducts() {
    try {
        const local = localStorage.getItem('llc_mock_products');
        if (!local) {
            localStorage.setItem('llc_mock_products', JSON.stringify(MOCK_PRODUCTS));
            return MOCK_PRODUCTS;
        }
        return JSON.parse(local);
    } catch(e) {
        return MOCK_PRODUCTS;
    }
}

function saveMockProducts(products) {
    localStorage.setItem('llc_mock_products', JSON.stringify(products));
}

function getMockOffers() {
    try {
        const local = localStorage.getItem('llc_mock_offers');
        if (!local) {
            localStorage.setItem('llc_mock_offers', JSON.stringify(MOCK_OFFERS));
            return MOCK_OFFERS;
        }
        return JSON.parse(local);
    } catch(e) {
        return MOCK_OFFERS;
    }
}

function saveMockOffers(offers) {
    localStorage.setItem('llc_mock_offers', JSON.stringify(offers));
}
