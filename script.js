// Property Data with Seattle Real Estate Investment Analysis
const properties = [
    {
        id: 1,
        title: "Modern Capitol Hill Condo",
        location: "Capitol Hill, Seattle",
        price: 750000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
        category: "condo",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        yearBuilt: 2018,
        rating: 4.5,
        monthlyRent: 3200,
        expenses: {
            mortgage: 3500,
            taxes: 625,
            insurance: 150,
            hoa: 450,
            maintenance: 200,
            vacancy: 160
        },
        marketTrends: {
            appreciation: 8.2,
            rentGrowth: 5.5,
            demandScore: 9.1
        }
    },
    {
        id: 2,
        title: "Fremont Single Family Home",
        location: "Fremont, Seattle",
        price: 1250000,
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop",
        category: "single-family",
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 2100,
        yearBuilt: 1995,
        rating: 4.8,
        monthlyRent: 4500,
        expenses: {
            mortgage: 5800,
            taxes: 1040,
            insurance: 200,
            hoa: 0,
            maintenance: 350,
            vacancy: 225
        },
        marketTrends: {
            appreciation: 7.8,
            rentGrowth: 4.2,
            demandScore: 8.7
        }
    },
    {
        id: 3,
        title: "Ballard Townhouse",
        location: "Ballard, Seattle",
        price: 950000,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
        category: "townhouse",
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1800,
        yearBuilt: 2015,
        rating: 4.3,
        monthlyRent: 3800,
        expenses: {
            mortgage: 4400,
            taxes: 790,
            insurance: 175,
            hoa: 250,
            maintenance: 280,
            vacancy: 190
        },
        marketTrends: {
            appreciation: 9.1,
            rentGrowth: 6.2,
            demandScore: 8.9
        }
    },
    {
        id: 4,
        title: "Queen Anne Luxury Condo",
        location: "Queen Anne, Seattle",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
        category: "condo",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1400,
        yearBuilt: 2020,
        rating: 4.9,
        monthlyRent: 5200,
        expenses: {
            mortgage: 8350,
            taxes: 1500,
            insurance: 250,
            hoa: 800,
            maintenance: 150,
            vacancy: 260
        },
        marketTrends: {
            appreciation: 6.5,
            rentGrowth: 3.8,
            demandScore: 9.5
        }
    },
    {
        id: 5,
        title: "Wallingford Duplex",
        location: "Wallingford, Seattle",
        price: 1650000,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop",
        category: "multi-family",
        bedrooms: 6,
        bathrooms: 4,
        sqft: 3200,
        yearBuilt: 1985,
        rating: 4.2,
        monthlyRent: 7200,
        expenses: {
            mortgage: 7650,
            taxes: 1375,
            insurance: 300,
            hoa: 0,
            maintenance: 500,
            vacancy: 360
        },
        marketTrends: {
            appreciation: 8.8,
            rentGrowth: 5.9,
            demandScore: 8.4
        }
    },
    {
        id: 6,
        title: "Belltown High-Rise Condo",
        location: "Belltown, Seattle",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
        category: "condo",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 900,
        yearBuilt: 2017,
        rating: 4.4,
        monthlyRent: 3600,
        expenses: {
            mortgage: 5570,
            taxes: 1000,
            insurance: 180,
            hoa: 650,
            maintenance: 120,
            vacancy: 180
        },
        marketTrends: {
            appreciation: 7.2,
            rentGrowth: 4.8,
            demandScore: 9.2
        }
    },
    {
        id: 7,
        title: "Green Lake Craftsman",
        location: "Green Lake, Seattle",
        price: 1450000,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
        category: "single-family",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        yearBuilt: 1925,
        rating: 4.6,
        monthlyRent: 5200,
        expenses: {
            mortgage: 6730,
            taxes: 1210,
            insurance: 220,
            hoa: 0,
            maintenance: 400,
            vacancy: 260
        },
        marketTrends: {
            appreciation: 8.5,
            rentGrowth: 5.1,
            demandScore: 8.8
        }
    },
    {
        id: 8,
        title: "Redmond Tech Hub Townhouse",
        location: "Redmond, Greater Seattle",
        price: 1100000,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
        category: "townhouse",
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1900,
        yearBuilt: 2012,
        rating: 4.7,
        monthlyRent: 4200,
        expenses: {
            mortgage: 5100,
            taxes: 915,
            insurance: 190,
            hoa: 300,
            maintenance: 320,
            vacancy: 210
        },
        marketTrends: {
            appreciation: 9.8,
            rentGrowth: 7.2,
            demandScore: 9.4
        }
    },
    {
        id: 9,
        title: "Bellevue Commercial Space",
        location: "Bellevue, Greater Seattle",
        price: 2800000,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
        category: "commercial",
        bedrooms: 0,
        bathrooms: 4,
        sqft: 4500,
        yearBuilt: 2010,
        rating: 4.1,
        monthlyRent: 12000,
        expenses: {
            mortgage: 13000,
            taxes: 2330,
            insurance: 400,
            hoa: 0,
            maintenance: 800,
            vacancy: 600
        },
        marketTrends: {
            appreciation: 6.8,
            rentGrowth: 4.5,
            demandScore: 8.6
        }
    },
    {
        id: 10,
        title: "West Seattle Beach House",
        location: "West Seattle, Seattle",
        price: 1350000,
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=250&fit=crop",
        category: "single-family",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2000,
        yearBuilt: 1980,
        rating: 4.5,
        monthlyRent: 4800,
        expenses: {
            mortgage: 6260,
            taxes: 1125,
            insurance: 250,
            hoa: 0,
            maintenance: 380,
            vacancy: 240
        },
        marketTrends: {
            appreciation: 7.9,
            rentGrowth: 5.3,
            demandScore: 8.3
        }
    }
];

// Global variables
let filteredProperties = [...properties];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const priceRange = document.getElementById('priceRange');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistCount = document.getElementById('wishlistCount');
const wishlistModal = document.getElementById('wishlistModal');
const propertyModal = document.getElementById('propertyModal');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMobile = document.getElementById('navMobile');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProperties();
    updateWishlistCount();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Search button click
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    // Enter key support for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
    
    // Search input focus/blur for hints
    searchInput.addEventListener('focus', showSearchHint);
    searchInput.addEventListener('blur', hideSearchHint);
    
    // Filter functionality
    categoryFilter.addEventListener('change', handleFilters);
    sortFilter.addEventListener('change', handleFilters);
    priceRange.addEventListener('change', handleFilters);
    
    // Wishlist modal
    wishlistBtn.addEventListener('click', openWishlistModal);
    document.getElementById('modalClose').addEventListener('click', closeWishlistModal);
    
    // Property modal
    document.getElementById('propertyModalClose').addEventListener('click', closePropertyModal);
    
    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === wishlistModal) closeWishlistModal();
        if (e.target === propertyModal) closePropertyModal();
    });
    
    // Mobile navigation links
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.style.display = 'none';
        });
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Check for zip codes and redirect to ROI Calculator
    if (/^\d{5}$/.test(query)) {
        // Show loading state briefly
        showSearchLoading();
        
        // Create a notification for zip code search
        showZipCodeNotification(query);
        
        // Redirect to ROI Calculator with pre-filled data
        setTimeout(() => {
            hideSearchLoading();
            if (query === '98092') {
                window.location.href = 'roi-calculator.html?zipcode=98092&location=Federal Way';
            } else {
                // For other zip codes, redirect to ROI calculator with the zip code
                window.location.href = `roi-calculator.html?zipcode=${query}`;
            }
        }, 1500);
        return;
    }
    
    // Check for MLS numbers (typically 6-8 digits)
    if (/^\d{6,8}$/.test(query)) {
        handleMLSSearch();
        return;
    }
    
    // Original search functionality for text searches
    filteredProperties = properties.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.category.toLowerCase().includes(query)
    );
    applyFiltersAndSort();
}

// Show zip code search notification
function showZipCodeNotification(zipCode) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.zip-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'zip-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-map-marker-alt"></i>
            <span>Searching properties in zip code ${zipCode}...</span>
            <span>Redirecting to ROI Calculator</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2000);
}

// Filter and sort functionality
function handleFilters() {
    let filtered = [...properties];
    
    // Apply search filter
    const query = searchInput.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(property => 
            property.title.toLowerCase().includes(query) ||
            property.location.toLowerCase().includes(query) ||
            property.category.toLowerCase().includes(query)
        );
    }
    
    // Apply category filter
    const category = categoryFilter.value;
    if (category !== 'all') {
        filtered = filtered.filter(property => property.category === category);
    }
    
    // Apply price range filter
    const priceRangeValue = priceRange.value;
    if (priceRangeValue !== 'all') {
        const [min, max] = priceRangeValue.split('-').map(Number);
        if (max) {
            filtered = filtered.filter(property => property.price >= min && property.price <= max);
        } else {
            filtered = filtered.filter(property => property.price >= min);
        }
    }
    
    filteredProperties = filtered;
    applyFiltersAndSort();
}

function applyFiltersAndSort() {
    const sortValue = sortFilter.value;
    
    filteredProperties.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'roi-high':
                return calculateROI(b) - calculateROI(a);
            case 'cashflow-high':
                return calculateCashFlow(b) - calculateCashFlow(a);
            case 'sqft-high':
                return b.sqft - a.sqft;
            default:
                return 0;
        }
    });
    
    renderProperties();
}

// Calculate ROI
function calculateROI(property) {
    const annualRent = property.monthlyRent * 12;
    const annualExpenses = Object.values(property.expenses).reduce((sum, expense) => sum + (expense * 12), 0);
    const netIncome = annualRent - annualExpenses;
    const downPayment = property.price * 0.25; // Assuming 25% down payment
    return ((netIncome / downPayment) * 100);
}

// Calculate Cash Flow
function calculateCashFlow(property) {
    const monthlyIncome = property.monthlyRent;
    const monthlyExpenses = Object.values(property.expenses).reduce((sum, expense) => sum + expense, 0);
    return monthlyIncome - monthlyExpenses;
}

// Calculate Cap Rate
function calculateCapRate(property) {
    const annualRent = property.monthlyRent * 12;
    const annualExpenses = Object.values(property.expenses).reduce((sum, expense) => sum + (expense * 12), 0);
    const netIncome = annualRent - annualExpenses;
    return ((netIncome / property.price) * 100);
}

// Calculate PITI (Principal, Interest, Taxes, Insurance)
function calculatePITI(property) {
    const loanAmount = property.price * 0.75; // Assuming 25% down payment
    const monthlyInterestRate = 0.065 / 12; // Assuming 6.5% annual interest rate
    const numberOfPayments = 30 * 12; // 30-year mortgage
    
    // Calculate monthly principal and interest using mortgage formula
    const monthlyPI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Add taxes and insurance from expenses
    const monthlyTaxes = property.expenses.taxes;
    const monthlyInsurance = property.expenses.insurance;
    
    return {
        principal: monthlyPI * 0.3, // Approximate principal portion (varies over time)
        interest: monthlyPI * 0.7,  // Approximate interest portion (varies over time)
        taxes: monthlyTaxes,
        insurance: monthlyInsurance,
        total: monthlyPI + monthlyTaxes + monthlyInsurance
    };
}

// Render properties
function renderProperties() {
    if (filteredProperties.length === 0) {
        propertiesGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria or filters.</p>
            </div>
        `;
        return;
    }
    
    propertiesGrid.innerHTML = filteredProperties.map(property => {
        const roi = calculateROI(property);
        const cashFlow = calculateCashFlow(property);
        const capRate = calculateCapRate(property);
        const piti = calculatePITI(property);
        const isInWishlist = wishlist.some(item => item.id === property.id);
        
        return `
            <div class="property-card fade-in" data-id="${property.id}">
                <img src="${property.image}" alt="${property.title}" class="property-image">
                <div class="property-content">
                    <div class="property-header">
                        <div>
                            <h3 class="property-title">${property.title}</h3>
                            <div class="property-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${property.location}
                            </div>
                        </div>
                        <button class="wishlist-toggle ${isInWishlist ? 'active' : ''}" 
                                onclick="toggleWishlist(${property.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="property-price">$${property.price.toLocaleString()}</div>
                    
                    <div class="property-details">
                        <div class="detail-item">
                            <span class="detail-value">${property.bedrooms || 'N/A'}</span>
                            <span class="detail-label">Beds</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-value">${property.bathrooms}</span>
                            <span class="detail-label">Baths</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-value">${property.sqft.toLocaleString()}</span>
                            <span class="detail-label">Sq Ft</span>
                        </div>
                    </div>
                    
                    <div class="property-metrics">
                        <div class="metric-item">
                            <span class="metric-label">ROI</span>
                            <span class="metric-value ${roi > 0 ? 'positive' : 'negative'}">${roi.toFixed(1)}%</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Cash Flow</span>
                            <span class="metric-value ${cashFlow > 0 ? 'positive' : 'negative'}">$${cashFlow.toLocaleString()}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Cap Rate</span>
                            <span class="metric-value ${capRate > 0 ? 'positive' : 'negative'}">${capRate.toFixed(1)}%</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Rent/Month</span>
                            <span class="metric-value">$${property.monthlyRent.toLocaleString()}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">PITI</span>
                            <span class="metric-value">$${Math.round(piti.total).toLocaleString()}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Rent vs PITI</span>
                            <span class="metric-value ${property.monthlyRent > piti.total ? 'positive' : 'negative'}">
                                ${((property.monthlyRent / piti.total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                    
                    <div class="property-rating">
                        <div class="stars">
                            ${generateStars(property.rating)}
                        </div>
                        <span class="rating-text">${property.rating} (${Math.floor(Math.random() * 50) + 10} reviews)</span>
                    </div>
                    
                    <div class="property-actions">
                        <button class="btn btn-primary" onclick="openPropertyModal(${property.id})">
                            View Details
                        </button>
                        <button class="btn btn-secondary" onclick="toggleWishlist(${property.id})">
                            ${isInWishlist ? 'Remove' : 'Add to List'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    
    return stars;
}

// Wishlist functionality
function toggleWishlist(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    const existingIndex = wishlist.findIndex(item => item.id === propertyId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push({
            ...property,
            quantity: 1,
            dateAdded: new Date().toISOString()
        });
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderProperties();
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

function updateWishlistQuantity(propertyId, change) {
    const item = wishlist.find(item => item.id === propertyId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlistModal();
    }
}

function removeFromWishlist(propertyId) {
    wishlist = wishlist.filter(item => item.id !== propertyId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlistModal();
    renderProperties();
}

// Modal functionality
function openWishlistModal() {
    renderWishlistModal();
    wishlistModal.style.display = 'block';
}

function closeWishlistModal() {
    wishlistModal.style.display = 'none';
}

function renderWishlistModal() {
    const totalProperties = wishlist.reduce((sum, item) => sum + item.quantity, 0);
    const totalInvestment = wishlist.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCashFlow = wishlist.reduce((sum, item) => sum + (calculateCashFlow(item) * item.quantity), 0);
    const averageROI = wishlist.length > 0 ? 
        wishlist.reduce((sum, item) => sum + calculateROI(item), 0) / wishlist.length : 0;
    
    document.getElementById('totalProperties').textContent = totalProperties;
    document.getElementById('totalInvestment').textContent = `$${totalInvestment.toLocaleString()}`;
    document.getElementById('totalCashFlow').textContent = `$${totalCashFlow.toLocaleString()}`;
    document.getElementById('averageROI').textContent = `${averageROI.toFixed(1)}%`;
    
    const wishlistItems = document.getElementById('wishlistItems');
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="text-center">Your wishlist is empty. Start adding properties!</p>';
        return;
    }
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.title}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <div class="wishlist-item-title">${item.title}</div>
                <div class="wishlist-item-price">$${item.price.toLocaleString()}</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 0.25rem;">
                    ROI: ${calculateROI(item).toFixed(1)}% | Cash Flow: $${calculateCashFlow(item).toLocaleString()}
                </div>
            </div>
            <div class="wishlist-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateWishlistQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateWishlistQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromWishlist(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const roi = calculateROI(property);
    const cashFlow = calculateCashFlow(property);
    const capRate = calculateCapRate(property);
    const piti = calculatePITI(property);
    
    document.getElementById('propertyModalTitle').textContent = property.title;
    document.getElementById('propertyModalBody').innerHTML = `
        <div class="property-detail-grid">
            <div>
                <img src="${property.image}" alt="${property.title}" class="property-detail-image">
            </div>
            <div class="property-detail-info">
                <h4>Property Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Price</span>
                        <span class="detail-value">$${property.price.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${property.location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">${property.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Year Built</span>
                        <span class="detail-value">${property.yearBuilt}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bedrooms</span>
                        <span class="detail-value">${property.bedrooms || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bathrooms</span>
                        <span class="detail-value">${property.bathrooms}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Square Feet</span>
                        <span class="detail-value">${property.sqft.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Monthly Rent</span>
                        <span class="detail-value">$${property.monthlyRent.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Investment Analysis</h4>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-value ${roi > 0 ? 'positive' : 'negative'}">${roi.toFixed(1)}%</div>
                    <div class="analysis-label">Return on Investment</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value ${cashFlow > 0 ? 'positive' : 'negative'}">$${cashFlow.toLocaleString()}</div>
                    <div class="analysis-label">Monthly Cash Flow</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value ${capRate > 0 ? 'positive' : 'negative'}">${capRate.toFixed(1)}%</div>
                    <div class="analysis-label">Cap Rate</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">${property.marketTrends.appreciation.toFixed(1)}%</div>
                    <div class="analysis-label">Annual Appreciation</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">${property.marketTrends.rentGrowth.toFixed(1)}%</div>
                    <div class="analysis-label">Rent Growth</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">${property.marketTrends.demandScore.toFixed(1)}/10</div>
                    <div class="analysis-label">Demand Score</div>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>PITI Breakdown (Principal, Interest, Taxes, Insurance)</h4>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-value">$${Math.round(piti.principal).toLocaleString()}</div>
                    <div class="analysis-label">Principal</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${Math.round(piti.interest).toLocaleString()}</div>
                    <div class="analysis-label">Interest</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${piti.taxes.toLocaleString()}</div>
                    <div class="analysis-label">Taxes</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${piti.insurance.toLocaleString()}</div>
                    <div class="analysis-label">Insurance</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${Math.round(piti.total).toLocaleString()}</div>
                    <div class="analysis-label">Total PITI</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value ${property.monthlyRent > piti.total ? 'positive' : 'negative'}">
                        ${((property.monthlyRent / piti.total) * 100).toFixed(0)}%
                    </div>
                    <div class="analysis-label">Rent to PITI Ratio</div>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Monthly Expenses Breakdown</h4>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.mortgage.toLocaleString()}</div>
                    <div class="analysis-label">Mortgage Payment</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.taxes.toLocaleString()}</div>
                    <div class="analysis-label">Property Taxes</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.insurance.toLocaleString()}</div>
                    <div class="analysis-label">Insurance</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.hoa.toLocaleString()}</div>
                    <div class="analysis-label">HOA Fees</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.maintenance.toLocaleString()}</div>
                    <div class="analysis-label">Maintenance</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-value">$${property.expenses.vacancy.toLocaleString()}</div>
                    <div class="analysis-label">Vacancy Reserve</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn btn-primary" onclick="toggleWishlist(${property.id}); closePropertyModal();" style="margin-right: 1rem;">
                Add to Wishlist
            </button>
            <button class="btn btn-secondary" onclick="closePropertyModal()">
                Close
            </button>
        </div>
    `;
    
    propertyModal.style.display = 'block';
}

function closePropertyModal() {
    propertyModal.style.display = 'none';
}

// Mobile menu functionality
function toggleMobileMenu() {
    const isVisible = navMobile.style.display === 'block';
    navMobile.style.display = isVisible ? 'none' : 'block';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation when filtering
function showLoading() {
    propertiesGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
        </div>
    `;
}

// Enhanced search with loading
const originalHandleSearch = handleSearch;
handleSearch = function() {
    showLoading();
    setTimeout(() => {
        originalHandleSearch();
    }, 300);
};

// CTA Button functionality
document.querySelector('.cta-button').addEventListener('click', function() {
    document.getElementById('properties').scrollIntoView({
        behavior: 'smooth'
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe property cards when they're rendered
function observePropertyCards() {
    document.querySelectorAll('.property-card').forEach(card => {
        observer.observe(card);
    });
}

// Call observe function after rendering
const originalRenderProperties = renderProperties;
renderProperties = function() {
    originalRenderProperties();
    setTimeout(observePropertyCards, 100);
};

// Add MLS search functionality
function handleMLSSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    
    // Check if it's an MLS number (typically 7-10 digits)
    const mlsPattern = /^\d{7,10}$/;
    
    if (mlsPattern.test(query)) {
        searchByMLS(query);
    } else if (query.length >= 2) {
        searchByAddress(query);
    }
}

function searchByMLS(mlsNumber) {
    // Show loading state
    showSearchLoading();
    
    // Simulate MLS search
    setTimeout(() => {
        const property = findPropertyByMLS(mlsNumber);
        
        if (property) {
            displayMLSResult(property);
        } else {
            showMLSNotFound(mlsNumber);
        }
        
        hideSearchLoading();
    }, 1000);
}

function findPropertyByMLS(mlsNumber) {
    // Simulate finding property by MLS number
    const sampleProperties = [
        {
            mls: '1234567',
            address: '123 Capitol Hill Ave',
            area: 'Capitol Hill',
            price: 750000,
            type: 'COND',
            bedrooms: 2,
            bathrooms: 1,
            sqft: 950,
            listDate: '2024-01-15',
            status: 'Active',
            description: 'Modern condo in the heart of Capitol Hill with city views.',
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400']
        },
        {
            mls: '2345678',
            address: '456 Fremont St',
            area: 'Fremont',
            price: 1250000,
            type: 'RESI',
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2200,
            listDate: '2024-01-10',
            status: 'Active',
            description: 'Beautiful single family home with large yard.',
            images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400']
        },
        {
            mls: '3456789',
            address: '789 Ballard Way',
            area: 'Ballard',
            price: 950000,
            type: 'TOWN',
            bedrooms: 3,
            bathrooms: 2.5,
            sqft: 1800,
            listDate: '2024-01-12',
            status: 'Pending',
            description: 'Modern townhouse near Ballard Locks.',
            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400']
        }
    ];
    
    return sampleProperties.find(prop => prop.mls === mlsNumber);
}

function displayMLSResult(property) {
    // Create and show MLS result modal
    const modal = createMLSModal(property);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.mls-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function createMLSModal(property) {
    const modal = document.createElement('div');
    modal.className = 'mls-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Calculate investment metrics
    const estimatedRent = calculateEstimatedRent(property);
    const piti = calculatePITI(property.price);
    const rentToPITI = ((estimatedRent / piti) * 100).toFixed(0);
    const roi = calculateROI(property.price, estimatedRent);
    const cashFlow = estimatedRent - piti - 500; // Rough estimate with expenses
    
    modal.innerHTML = `
        <div class="mls-modal-content" style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        ">
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0; color: #2d3748;">MLS# ${property.mls}</h2>
                    <button onclick="closeMLSModal()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: #718096;
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <img src="${property.images[0]}" alt="${property.address}" style="
                            width: 100%;
                            height: 250px;
                            object-fit: cover;
                            border-radius: 8px;
                            margin-bottom: 1rem;
                        ">
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="margin: 0 0 0.5rem 0; color: #2d3748;">${property.address}</h3>
                            <p style="margin: 0; color: #718096; font-size: 0.875rem;">${property.area} • ${property.type}</p>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: #2d3748;">$${property.price.toLocaleString()}</div>
                                <div style="font-size: 0.875rem; color: #718096;">List Price</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: #2d3748;">${property.sqft}</div>
                                <div style="font-size: 0.875rem; color: #718096;">Sq Ft</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: #2d3748;">${property.bedrooms}</div>
                                <div style="font-size: 0.875rem; color: #718096;">Bedrooms</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: #2d3748;">${property.bathrooms}</div>
                                <div style="font-size: 0.875rem; color: #718096;">Bathrooms</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="margin: 0 0 0.5rem 0; color: #2d3748;">Description</h4>
                            <p style="margin: 0; color: #4a5568; line-height: 1.6; font-size: 0.875rem;">${property.description}</p>
                        </div>
                        
                        <div style="display: flex; gap: 1rem;">
                            <span style="
                                padding: 0.5rem 1rem;
                                background: ${property.status === 'Active' ? '#c6f6d5' : '#feebc8'};
                                color: ${property.status === 'Active' ? '#22543d' : '#744210'};
                                border-radius: 20px;
                                font-size: 0.75rem;
                                font-weight: 600;
                            ">${property.status}</span>
                            <span style="
                                padding: 0.5rem 1rem;
                                background: #e2e8f0;
                                color: #4a5568;
                                border-radius: 20px;
                                font-size: 0.75rem;
                                font-weight: 600;
                            ">Listed: ${new Date(property.listDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="margin: 0 0 1rem 0; color: #2d3748;">Investment Analysis</h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px;">
                                <div style="font-size: 1.25rem; font-weight: 700;">${roi.toFixed(1)}%</div>
                                <div style="font-size: 0.75rem; opacity: 0.9;">Est. ROI</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: ${cashFlow >= 0 ? '#48bb78' : '#f56565'}; color: white; border-radius: 8px;">
                                <div style="font-size: 1.25rem; font-weight: 700;">$${cashFlow.toFixed(0)}</div>
                                <div style="font-size: 0.75rem; opacity: 0.9;">Cash Flow</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #ed8936; color: white; border-radius: 8px;">
                                <div style="font-size: 1.25rem; font-weight: 700;">$${estimatedRent.toFixed(0)}</div>
                                <div style="font-size: 0.75rem; opacity: 0.9;">Est. Rent</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: ${rentToPITI >= 120 ? '#48bb78' : rentToPITI >= 110 ? '#ed8936' : '#f56565'}; color: white; border-radius: 8px;">
                                <div style="font-size: 1.25rem; font-weight: 700;">${rentToPITI}%</div>
                                <div style="font-size: 0.75rem; opacity: 0.9;">Rent/PITI</div>
                            </div>
                        </div>
                        
                        <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <h4 style="margin: 0 0 1rem 0; color: #2d3748;">PITI Breakdown</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: #718096;">Principal & Interest:</span>
                                    <span style="color: #2d3748; font-weight: 500;">$${(piti * 0.8).toFixed(0)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: #718096;">Property Taxes:</span>
                                    <span style="color: #2d3748; font-weight: 500;">$${(piti * 0.15).toFixed(0)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: #718096;">Insurance:</span>
                                    <span style="color: #2d3748; font-weight: 500;">$${(piti * 0.05).toFixed(0)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; border-top: 1px solid #e2e8f0; padding-top: 0.5rem; margin-top: 0.5rem;">
                                    <span style="color: #2d3748; font-weight: 600;">Total PITI:</span>
                                    <span style="color: #2d3748; font-weight: 600;">$${piti.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <button onclick="addMLSToWishlist('${property.mls}')" style="
                                width: 100%;
                                padding: 0.75rem;
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: transform 0.2s ease;
                            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                <i class="fas fa-heart" style="margin-right: 0.5rem;"></i>
                                Add to Wishlist
                            </button>
                            <button onclick="openROICalculatorWithData('${property.mls}')" style="
                                width: 100%;
                                padding: 0.75rem;
                                background: white;
                                color: #667eea;
                                border: 1px solid #667eea;
                                border-radius: 6px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s ease;
                            " onmouseover="this.style.background='#f7fafc'" onmouseout="this.style.background='white'">
                                <i class="fas fa-calculator" style="margin-right: 0.5rem;"></i>
                                Analyze in ROI Calculator
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function calculateEstimatedRent(property) {
    // Rough rent estimation based on area and property type
    const baseRentPerSqft = {
        'Capitol Hill': 3.2,
        'Fremont': 2.8,
        'Ballard': 3.0,
        'Queen Anne': 3.5,
        'Wallingford': 2.9,
        'Belltown': 3.8,
        'Green Lake': 2.7,
        'Georgetown': 2.5
    };
    
    const multiplier = {
        'COND': 1.0,
        'RESI': 0.9,
        'TOWN': 0.95,
        'RENT': 1.0,
        'VACL': 0.8
    };
    
    const rentPerSqft = baseRentPerSqft[property.area] || 2.8;
    const typeMultiplier = multiplier[property.type] || 1.0;
    
    return property.sqft * rentPerSqft * typeMultiplier;
}

function showMLSNotFound(mlsNumber) {
    const modal = document.createElement('div');
    modal.className = 'mls-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="mls-modal-content" style="
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            padding: 2rem;
            text-align: center;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        ">
            <div style="margin-bottom: 1.5rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ed8936; margin-bottom: 1rem;"></i>
                <h2 style="margin: 0 0 0.5rem 0; color: #2d3748;">Property Not Found</h2>
                <p style="margin: 0; color: #718096;">MLS# ${mlsNumber} was not found in our database.</p>
            </div>
            
            <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0; color: #2d3748;">Try These Options:</h4>
                <ul style="margin: 0; padding-left: 1.5rem; text-align: left; color: #4a5568;">
                    <li>Check the MLS number for typos</li>
                    <li>Search by property address instead</li>
                    <li>Browse our Top Deals page for available properties</li>
                    <li>Use the ROI Calculator for custom analysis</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeMLSModal()" style="
                    padding: 0.75rem 1.5rem;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                ">Close</button>
                <button onclick="closeMLSModal(); window.location.href='deals.html'" style="
                    padding: 0.75rem 1.5rem;
                    background: white;
                    color: #667eea;
                    border: 1px solid #667eea;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                ">Browse Deals</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.mls-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function closeMLSModal() {
    const modal = document.querySelector('.mls-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function addMLSToWishlist(mlsNumber) {
    const property = findPropertyByMLS(mlsNumber);
    if (!property) return;
    
    const estimatedRent = calculateEstimatedRent(property);
    const piti = calculatePITI(property.price);
    const roi = calculateROI(property.price, estimatedRent);
    const cashFlow = estimatedRent - piti - 500;
    
    const wishlistProperty = {
        id: `mls-${property.mls}`,
        title: property.address,
        location: property.area,
        price: property.price,
        roi: roi,
        cashFlow: cashFlow,
        capRate: ((estimatedRent * 12 - 6000) / property.price * 100), // Rough cap rate
        rentToPITI: (estimatedRent / piti) * 100,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFootage: property.sqft,
        mls: property.mls,
        dateAdded: new Date().toISOString()
    };
    
    let wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
    
    // Check if already in wishlist
    if (wishlist.some(item => item.mls === property.mls)) {
        alert('This property is already in your wishlist!');
        return;
    }
    
    wishlist.push(wishlistProperty);
    localStorage.setItem('propertyWishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    loadWishlistCount();
    
    // Show success message
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i>Added to Wishlist!';
    button.style.background = '#48bb78';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }, 2000);
}

function openROICalculatorWithData(mlsNumber) {
    const property = findPropertyByMLS(mlsNumber);
    if (!property) return;
    
    // Store property data for the calculator
    localStorage.setItem('calculatorPreload', JSON.stringify({
        propertyPrice: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFootage: property.sqft,
        monthlyRent: calculateEstimatedRent(property),
        location: property.area.toLowerCase().replace(' ', '-')
    }));
    
    // Navigate to calculator
    window.location.href = 'roi-calculator.html';
}

function searchByAddress(address) {
    // Show loading state
    showSearchLoading();
    
    // Simulate address search
    setTimeout(() => {
        // For demo, just show a message
        alert(`Address search for "${address}" - This feature would search through property addresses and display matching results.`);
        hideSearchLoading();
    }, 1000);
}

function showSearchLoading() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23718096\'%3E%3Cpath d=\'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9H21ZM19 21H5V3H13V9H19V21Z\'/%3E%3C/svg%3E") no-repeat right 12px center';
        searchInput.style.backgroundSize = '16px';
        searchInput.disabled = true;
    }
}

function hideSearchLoading() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.style.background = '';
        searchInput.disabled = false;
    }
}

// Show search hint
function showSearchHint() {
    // Remove any existing hint
    const existingHint = document.querySelector('.search-hint');
    if (existingHint) {
        existingHint.remove();
    }
    
    // Create hint element
    const hint = document.createElement('div');
    hint.className = 'search-hint';
    hint.innerHTML = `
        <div class="hint-content">
            <div class="hint-item">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>98092</strong> - Search by zip code</span>
            </div>
            <div class="hint-item">
                <i class="fas fa-home"></i>
                <span><strong>1234567</strong> - Search by MLS#</span>
            </div>
            <div class="hint-item">
                <i class="fas fa-search"></i>
                <span><strong>Capitol Hill</strong> - Search by location</span>
            </div>
        </div>
    `;
    
    // Position relative to search container
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(hint);
    
    // Show with animation
    setTimeout(() => hint.classList.add('show'), 10);
}

// Hide search hint
function hideSearchHint() {
    setTimeout(() => {
        const hint = document.querySelector('.search-hint');
        if (hint) {
            hint.classList.remove('show');
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 300);
        }
    }, 150); // Small delay to allow clicking on hint
}

// Update the existing search input event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Enhanced search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMLSSearch();
            }
        });
        
        // Add search icon click handler
        const searchIcon = searchInput.parentElement.querySelector('.fa-search');
        if (searchIcon) {
            searchIcon.addEventListener('click', handleMLSSearch);
            searchIcon.style.cursor = 'pointer';
        }
    }
}); 