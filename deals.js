// Sample NWMLS-style New Listings Data (simulating real data from matrix.nwmls.com)
const newListings = [
    {
        id: 1,
        mlsNumber: "2374816",
        address: "3677 SE Chesterton Dr",
        area: "Port Orchard",
        city: "Port Orchard",
        state: "WA",
        type: "RESI",
        price: 610000,
        listDate: "2025-05-26",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1850,
        yearBuilt: 2018,
        lotSize: 0.25,
        estimatedRent: 2800,
        isMultiFamily: false,
        isDetached: true,
        hasLargeGarage: true,
        marketTrends: {
            appreciation: 7.5,
            rentGrowth: 4.8,
            demandScore: 8.2
        }
    },
    {
        id: 2,
        mlsNumber: "2381602",
        address: "8627 25th Ave #B",
        area: "Westwood",
        city: "Seattle",
        state: "WA",
        type: "COND",
        price: 415000,
        listDate: "2025-05-26",
        bedrooms: 2,
        bathrooms: 1,
        sqft: 950,
        yearBuilt: 2015,
        lotSize: 0,
        estimatedRent: 2200,
        isMultiFamily: false,
        isDetached: false,
        hasLargeGarage: false,
        marketTrends: {
            appreciation: 8.1,
            rentGrowth: 5.2,
            demandScore: 9.1
        }
    },
    {
        id: 3,
        mlsNumber: "2380676",
        address: "94 Brazil Rd",
        area: "Sequim",
        city: "Sequim",
        state: "WA",
        type: "RESI",
        price: 689000,
        listDate: "2025-05-26",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2200,
        yearBuilt: 1995,
        lotSize: 0.5,
        estimatedRent: 3200,
        isMultiFamily: false,
        isDetached: true,
        hasLargeGarage: true,
        marketTrends: {
            appreciation: 6.8,
            rentGrowth: 4.1,
            demandScore: 7.9
        }
    },
    {
        id: 4,
        mlsNumber: "2381302",
        address: "9999 View Ridge - Lot 4 Dr",
        area: "Gardiner",
        city: "Sequim",
        state: "WA",
        type: "VACL",
        price: 175000,
        listDate: "2025-05-26",
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
        yearBuilt: 0,
        lotSize: 2.5,
        estimatedRent: 0,
        isMultiFamily: false,
        isDetached: false,
        hasLargeGarage: false,
        marketTrends: {
            appreciation: 5.2,
            rentGrowth: 0,
            demandScore: 6.5
        }
    },
    {
        id: 5,
        mlsNumber: "2381590",
        address: "11427 40th Dr",
        area: "Silver Lake",
        city: "Everett",
        state: "WA",
        type: "RENT",
        price: 4299,
        listDate: "2025-05-26",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1600,
        yearBuilt: 2010,
        lotSize: 0.15,
        estimatedRent: 4299,
        isMultiFamily: true,
        isDetached: false,
        hasLargeGarage: true,
        marketTrends: {
            appreciation: 7.2,
            rentGrowth: 5.8,
            demandScore: 8.5
        }
    },
    // Add more sample listings to reach 100+ entries
    ...generateAdditionalListings()
];

// Generate additional sample listings
function generateAdditionalListings() {
    const areas = ["Seattle", "Bellevue", "Redmond", "Kirkland", "Bothell", "Everett", "Tacoma", "Renton"];
    const types = ["RESI", "COND", "RENT"];
    const streets = ["Main St", "Oak Ave", "Pine Dr", "Cedar Ln", "Maple Way", "Elm Ct", "Birch Rd", "Ash Blvd"];
    const listings = [];
    
    for (let i = 6; i <= 120; i++) {
        const area = areas[Math.floor(Math.random() * areas.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const houseNumber = Math.floor(Math.random() * 9999) + 1000;
        
        const basePrice = type === "COND" ? 400000 : type === "RENT" ? 3000 : 600000;
        const priceVariation = Math.random() * 0.8 + 0.6; // 60% to 140% of base
        const price = Math.round(basePrice * priceVariation / 1000) * 1000;
        
        const bedrooms = type === "COND" ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 4) + 2;
        const bathrooms = Math.floor(Math.random() * 2) + 1 + (bedrooms > 2 ? 0.5 : 0);
        const sqft = bedrooms * 400 + Math.floor(Math.random() * 600) + 200;
        
        // Estimate rent based on area and property characteristics
        let rentMultiplier = 1.0;
        if (area === "Seattle" || area === "Bellevue") rentMultiplier = 1.3;
        else if (area === "Redmond" || area === "Kirkland") rentMultiplier = 1.2;
        else if (area === "Bothell" || area === "Renton") rentMultiplier = 1.1;
        
        const estimatedRent = type === "RENT" ? price : Math.round((sqft * 1.8 * rentMultiplier) / 50) * 50;
        
        // Determine property characteristics based on type and other factors
        const isMultiFamily = type === "RENT" || (type === "RESI" && bedrooms >= 4 && Math.random() > 0.7);
        const isDetached = type === "RESI" && Math.random() > 0.3; // 70% chance for residential
        const hasLargeGarage = (type === "RESI" || type === "RENT") && sqft > 1500 && Math.random() > 0.4; // 60% chance for larger properties
        
        listings.push({
            id: i,
            mlsNumber: `23${80000 + i}`,
            address: `${houseNumber} ${street}`,
            area: area,
            city: area,
            state: "WA",
            type: type,
            price: price,
            listDate: "2025-05-26",
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            sqft: sqft,
            yearBuilt: Math.floor(Math.random() * 40) + 1980,
            lotSize: Math.random() * 0.5 + 0.1,
            estimatedRent: estimatedRent,
            isMultiFamily: isMultiFamily,
            isDetached: isDetached,
            hasLargeGarage: hasLargeGarage,
            marketTrends: {
                appreciation: Math.random() * 4 + 5, // 5-9%
                rentGrowth: Math.random() * 3 + 3, // 3-6%
                demandScore: Math.random() * 3 + 7 // 7-10
            }
        });
    }
    
    return listings;
}

// Global variables
let filteredDeals = [...newListings];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentPage = 1;
let itemsPerPage = 25;
let currentSort = 'rentToPiti';

// DOM Elements
const dealsTableBody = document.getElementById('dealsTableBody');
const searchInput = document.getElementById('searchInput');
const minRentToPiti = document.getElementById('minRentToPiti');
const propertyType = document.getElementById('propertyType');
const priceRange = document.getElementById('priceRange');
const area = document.getElementById('area');
const sortBy = document.getElementById('sortBy');
const resultsCount = document.getElementById('resultsCount');
const multiFamily = document.getElementById('multiFamily');
const detached = document.getElementById('detached');
const largeGarage = document.getElementById('largeGarage');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistCount = document.getElementById('wishlistCount');
const wishlistModal = document.getElementById('wishlistModal');
const dealModal = document.getElementById('dealModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistCount();
    setupEventListeners();
    applyFiltersAndSort();
    updateSummaryStats();
});

// Event Listeners
function setupEventListeners() {
    // Search and filter functionality
    searchInput.addEventListener('input', debounce(applyFiltersAndSort, 300));
    minRentToPiti.addEventListener('change', applyFiltersAndSort);
    propertyType.addEventListener('change', applyFiltersAndSort);
    priceRange.addEventListener('change', applyFiltersAndSort);
    area.addEventListener('change', applyFiltersAndSort);
    sortBy.addEventListener('change', applyFiltersAndSort);
    resultsCount.addEventListener('change', applyFiltersAndSort);
    multiFamily.addEventListener('change', applyFiltersAndSort);
    detached.addEventListener('change', applyFiltersAndSort);
    largeGarage.addEventListener('change', applyFiltersAndSort);
    
    // Wishlist modal
    wishlistBtn.addEventListener('click', openWishlistModal);
    document.getElementById('modalClose').addEventListener('click', closeWishlistModal);
    
    // Deal modal
    document.getElementById('dealModalClose').addEventListener('click', closeDealModal);
    
    // Bulk actions
    document.getElementById('selectAllCheckbox').addEventListener('change', toggleSelectAll);
    document.getElementById('selectAll').addEventListener('click', selectAllVisible);
    document.getElementById('addSelectedToWishlist').addEventListener('click', addSelectedToWishlist);
    
    // Export functionality
    document.getElementById('exportData').addEventListener('click', exportToCSV);
    document.getElementById('refreshData').addEventListener('click', refreshAnalysis);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === wishlistModal) closeWishlistModal();
        if (e.target === dealModal) closeDealModal();
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

// Calculate PITI for a property
function calculatePITI(property) {
    if (property.type === 'VACL' || property.type === 'RENT') {
        return { total: 0, principal: 0, interest: 0, taxes: 0, insurance: 0 };
    }
    
    const loanAmount = property.price * 0.75; // 25% down payment
    const monthlyInterestRate = 0.065 / 12; // 6.5% annual interest rate
    const numberOfPayments = 30 * 12; // 30-year mortgage
    
    // Calculate monthly principal and interest
    const monthlyPI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Estimate taxes and insurance based on property value and location
    const taxRate = property.area === 'Seattle' ? 0.0092 : 0.0078; // Annual tax rate
    const monthlyTaxes = (property.price * taxRate) / 12;
    const monthlyInsurance = property.price * 0.0035 / 12; // 0.35% annually
    
    return {
        principal: monthlyPI * 0.3, // Approximate principal portion
        interest: monthlyPI * 0.7,  // Approximate interest portion
        taxes: monthlyTaxes,
        insurance: monthlyInsurance,
        total: monthlyPI + monthlyTaxes + monthlyInsurance
    };
}

// Calculate investment metrics
function calculateMetrics(property) {
    const piti = calculatePITI(property);
    const rentToPitiRatio = piti.total > 0 ? (property.estimatedRent / piti.total) * 100 : 0;
    const cashFlow = property.estimatedRent - piti.total - (property.estimatedRent * 0.1); // 10% for maintenance/vacancy
    
    const downPayment = property.price * 0.25;
    const annualRent = property.estimatedRent * 12;
    const annualExpenses = piti.total * 12 + (property.estimatedRent * 12 * 0.1);
    const netIncome = annualRent - annualExpenses;
    const roi = downPayment > 0 ? (netIncome / downPayment) * 100 : 0;
    const capRate = property.price > 0 ? (netIncome / property.price) * 100 : 0;
    
    return {
        piti,
        rentToPitiRatio,
        cashFlow,
        roi,
        capRate
    };
}

// Apply filters and sorting
function applyFiltersAndSort() {
    let filtered = [...newListings];
    
    // Apply search filter
    const query = searchInput.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(property => 
            property.mlsNumber.toLowerCase().includes(query) ||
            property.address.toLowerCase().includes(query) ||
            property.area.toLowerCase().includes(query) ||
            property.city.toLowerCase().includes(query)
        );
    }
    
    // Apply minimum rent to PITI ratio filter
    const minRatio = parseInt(minRentToPiti.value);
    if (minRatio > 0) {
        filtered = filtered.filter(property => {
            const metrics = calculateMetrics(property);
            return metrics.rentToPitiRatio >= minRatio;
        });
    }
    
    // Apply property type filter
    const typeFilter = propertyType.value;
    if (typeFilter !== 'all') {
        filtered = filtered.filter(property => property.type === typeFilter);
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
    
    // Apply area filter
    const areaFilter = area.value;
    if (areaFilter !== 'all') {
        filtered = filtered.filter(property => property.area === areaFilter);
    }
    
    // Apply property characteristic filters
    const multiFamilyFilter = multiFamily.value;
    if (multiFamilyFilter !== 'all') {
        const isMultiFamilyRequired = multiFamilyFilter === 'yes';
        filtered = filtered.filter(property => property.isMultiFamily === isMultiFamilyRequired);
    }
    
    const detachedFilter = detached.value;
    if (detachedFilter !== 'all') {
        const isDetachedRequired = detachedFilter === 'yes';
        filtered = filtered.filter(property => property.isDetached === isDetachedRequired);
    }
    
    const largeGarageFilter = largeGarage.value;
    if (largeGarageFilter !== 'all') {
        const hasLargeGarageRequired = largeGarageFilter === 'yes';
        filtered = filtered.filter(property => property.hasLargeGarage === hasLargeGarageRequired);
    }
    
    // Sort the results
    const sortValue = sortBy.value;
    currentSort = sortValue;
    
    filtered.sort((a, b) => {
        const metricsA = calculateMetrics(a);
        const metricsB = calculateMetrics(b);
        
        switch (sortValue) {
            case 'rentToPiti':
                return metricsB.rentToPitiRatio - metricsA.rentToPitiRatio;
            case 'cashFlow':
                return metricsB.cashFlow - metricsA.cashFlow;
            case 'roi':
                return metricsB.roi - metricsA.roi;
            case 'capRate':
                return metricsB.capRate - metricsA.capRate;
            case 'price':
                return a.price - b.price;
            case 'listDate':
                return new Date(b.listDate) - new Date(a.listDate);
            default:
                return metricsB.rentToPitiRatio - metricsA.rentToPitiRatio;
        }
    });
    
    // Apply results count limit
    const maxResults = resultsCount.value;
    if (maxResults !== 'all') {
        filtered = filtered.slice(0, parseInt(maxResults));
    }
    
    filteredDeals = filtered;
    currentPage = 1;
    renderDealsTable();
    updateSummaryStats();
}

// Render the deals table
function renderDealsTable() {
    if (filteredDeals.length === 0) {
        dealsTableBody.innerHTML = `
            <tr>
                <td colspan="18" class="loading-table">
                    <div>No deals found matching your criteria.</div>
                    <div style="margin-top: 1rem; color: #999;">Try adjusting your filters or search terms.</div>
                </td>
            </tr>
        `;
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDeals.length);
    const pageDeals = filteredDeals.slice(startIndex, endIndex);
    
    dealsTableBody.innerHTML = pageDeals.map((property, index) => {
        const metrics = calculateMetrics(property);
        const rank = startIndex + index + 1;
        const isInWishlist = wishlist.some(item => item.mlsNumber === property.mlsNumber);
        
        // Determine ratio class for color coding
        let ratioClass = 'ratio-poor';
        if (metrics.rentToPitiRatio >= 130) ratioClass = 'ratio-excellent';
        else if (metrics.rentToPitiRatio >= 120) ratioClass = 'ratio-good';
        else if (metrics.rentToPitiRatio >= 110) ratioClass = 'ratio-fair';
        
        return `
            <tr>
                <td><input type="checkbox" class="deal-checkbox" data-mls="${property.mlsNumber}"></td>
                <td class="rank-cell">#${rank}</td>
                <td class="mls-cell">${property.mlsNumber}</td>
                <td class="address-cell" title="${property.address}">${property.address}</td>
                <td class="area-cell">${property.area}</td>
                <td class="type-cell">${property.type}</td>
                <td class="characteristic-cell ${property.isMultiFamily ? 'yes' : 'no'}">
                    <span class="characteristic-badge ${property.isMultiFamily ? 'yes' : 'no'}">
                        ${property.isMultiFamily ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="characteristic-cell ${property.isDetached ? 'yes' : 'no'}">
                    <span class="characteristic-badge ${property.isDetached ? 'yes' : 'no'}">
                        ${property.isDetached ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="characteristic-cell ${property.hasLargeGarage ? 'yes' : 'no'}">
                    <span class="characteristic-badge ${property.hasLargeGarage ? 'yes' : 'no'}">
                        ${property.hasLargeGarage ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="price-cell">$${property.price.toLocaleString()}</td>
                <td class="rent-cell">$${property.estimatedRent.toLocaleString()}</td>
                <td class="piti-cell">$${Math.round(metrics.piti.total).toLocaleString()}</td>
                <td class="ratio-cell ${ratioClass}">${metrics.rentToPitiRatio.toFixed(0)}%</td>
                <td class="${metrics.cashFlow > 0 ? 'cashflow-positive' : 'cashflow-negative'}">
                    $${metrics.cashFlow.toLocaleString()}
                </td>
                <td class="roi-cell">${metrics.roi.toFixed(1)}%</td>
                <td class="caprate-cell">${metrics.capRate.toFixed(1)}%</td>
                <td class="date-cell">${formatDate(property.listDate)}</td>
                <td class="actions-cell">
                    <button class="action-btn view" onclick="openDealModal('${property.mlsNumber}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn wishlist ${isInWishlist ? 'active' : ''}" 
                            onclick="toggleWishlist('${property.mlsNumber}')" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Show page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
        <div class="pagination-info">
            Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, filteredDeals.length)} 
            of ${filteredDeals.length} deals
        </div>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderDealsTable();
    }
}

// Update summary statistics
function updateSummaryStats() {
    if (filteredDeals.length === 0) return;
    
    const dealsWithMetrics = filteredDeals.map(property => ({
        ...property,
        metrics: calculateMetrics(property)
    }));
    
    // Find best deals
    const bestRatioProperty = dealsWithMetrics.reduce((best, current) => 
        current.metrics.rentToPitiRatio > best.metrics.rentToPitiRatio ? current : best
    );
    
    const bestCashFlowProperty = dealsWithMetrics.reduce((best, current) => 
        current.metrics.cashFlow > best.metrics.cashFlow ? current : best
    );
    
    const bestROIProperty = dealsWithMetrics.reduce((best, current) => 
        current.metrics.roi > best.metrics.roi ? current : best
    );
    
    // Calculate averages
    const avgRentToPiti = dealsWithMetrics.reduce((sum, deal) => sum + deal.metrics.rentToPitiRatio, 0) / dealsWithMetrics.length;
    const avgPrice = dealsWithMetrics.reduce((sum, deal) => sum + deal.price, 0) / dealsWithMetrics.length;
    const cashFlowPositive = dealsWithMetrics.filter(deal => deal.metrics.cashFlow > 0).length;
    
    // Update hero stats
    document.getElementById('totalListings').textContent = filteredDeals.length;
    document.getElementById('avgRentToPiti').textContent = `${avgRentToPiti.toFixed(0)}%`;
    document.getElementById('topDeals').textContent = cashFlowPositive;
    document.getElementById('lastUpdated').textContent = 'Today';
    
    // Update summary cards
    document.getElementById('bestDealRatio').textContent = `${bestRatioProperty.metrics.rentToPitiRatio.toFixed(0)}%`;
    document.getElementById('bestDealAddress').textContent = bestRatioProperty.address;
    
    document.getElementById('highestCashFlow').textContent = `$${bestCashFlowProperty.metrics.cashFlow.toLocaleString()}`;
    document.getElementById('highestCashFlowAddress').textContent = bestCashFlowProperty.address;
    
    document.getElementById('bestROI').textContent = `${bestROIProperty.metrics.roi.toFixed(1)}%`;
    document.getElementById('bestROIAddress').textContent = bestROIProperty.address;
    
    document.getElementById('avgPrice').textContent = `$${(avgPrice / 1000).toFixed(0)}K`;
}

// Wishlist functionality
function toggleWishlist(mlsNumber) {
    const property = newListings.find(p => p.mlsNumber === mlsNumber);
    const existingIndex = wishlist.findIndex(item => item.mlsNumber === mlsNumber);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push({
            ...property,
            metrics: calculateMetrics(property),
            quantity: 1,
            dateAdded: new Date().toISOString()
        });
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderDealsTable();
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// Bulk selection functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.deal-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function selectAllVisible() {
    const checkboxes = document.querySelectorAll('.deal-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    document.getElementById('selectAllCheckbox').checked = true;
}

function addSelectedToWishlist() {
    const selectedCheckboxes = document.querySelectorAll('.deal-checkbox:checked');
    let addedCount = 0;
    
    selectedCheckboxes.forEach(checkbox => {
        const mlsNumber = checkbox.dataset.mls;
        const property = newListings.find(p => p.mlsNumber === mlsNumber);
        const existingIndex = wishlist.findIndex(item => item.mlsNumber === mlsNumber);
        
        if (existingIndex === -1 && property) {
            wishlist.push({
                ...property,
                metrics: calculateMetrics(property),
                quantity: 1,
                dateAdded: new Date().toISOString()
            });
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderDealsTable();
        
        // Show success message
        alert(`Added ${addedCount} properties to your wishlist!`);
        
        // Uncheck all checkboxes
        document.querySelectorAll('.deal-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('selectAllCheckbox').checked = false;
    } else {
        alert('No new properties to add to wishlist.');
    }
}

// Modal functionality
function openDealModal(mlsNumber) {
    const property = newListings.find(p => p.mlsNumber === mlsNumber);
    if (!property) return;
    
    const metrics = calculateMetrics(property);
    
    document.getElementById('dealModalTitle').textContent = `${property.address} - MLS# ${property.mlsNumber}`;
    document.getElementById('dealModalBody').innerHTML = `
        <div class="deal-analysis-grid">
            <div class="deal-section">
                <h4>Property Information</h4>
                <div class="deal-metric">
                    <span class="deal-metric-label">Address</span>
                    <span class="deal-metric-value">${property.address}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Area</span>
                    <span class="deal-metric-value">${property.area}, ${property.state}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Property Type</span>
                    <span class="deal-metric-value">${property.type}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">List Price</span>
                    <span class="deal-metric-value">$${property.price.toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Bedrooms</span>
                    <span class="deal-metric-value">${property.bedrooms || 'N/A'}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Bathrooms</span>
                    <span class="deal-metric-value">${property.bathrooms || 'N/A'}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Square Feet</span>
                    <span class="deal-metric-value">${property.sqft ? property.sqft.toLocaleString() : 'N/A'}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Year Built</span>
                    <span class="deal-metric-value">${property.yearBuilt || 'N/A'}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">List Date</span>
                    <span class="deal-metric-value">${new Date(property.listDate).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="deal-section">
                <h4>Property Characteristics</h4>
                <div class="deal-metric">
                    <span class="deal-metric-label">Multi-Family</span>
                    <span class="deal-metric-value ${property.isMultiFamily ? 'positive' : 'neutral'}">
                        ${property.isMultiFamily ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Detached</span>
                    <span class="deal-metric-value ${property.isDetached ? 'positive' : 'neutral'}">
                        ${property.isDetached ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Large Garage</span>
                    <span class="deal-metric-value ${property.hasLargeGarage ? 'positive' : 'neutral'}">
                        ${property.hasLargeGarage ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>
            
            <div class="deal-section">
                <h4>Investment Analysis</h4>
                <div class="deal-metric">
                    <span class="deal-metric-label">Estimated Monthly Rent</span>
                    <span class="deal-metric-value positive">$${property.estimatedRent.toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Monthly PITI</span>
                    <span class="deal-metric-value negative">$${Math.round(metrics.piti.total).toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Rent to PITI Ratio</span>
                    <span class="deal-metric-value ${metrics.rentToPitiRatio > 120 ? 'excellent' : metrics.rentToPitiRatio > 100 ? 'positive' : 'negative'}">
                        ${metrics.rentToPitiRatio.toFixed(1)}%
                    </span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Monthly Cash Flow</span>
                    <span class="deal-metric-value ${metrics.cashFlow > 0 ? 'positive' : 'negative'}">
                        $${metrics.cashFlow.toLocaleString()}
                    </span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">ROI</span>
                    <span class="deal-metric-value ${metrics.roi > 0 ? 'positive' : 'negative'}">
                        ${metrics.roi.toFixed(1)}%
                    </span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Cap Rate</span>
                    <span class="deal-metric-value ${metrics.capRate > 0 ? 'positive' : 'negative'}">
                        ${metrics.capRate.toFixed(1)}%
                    </span>
                </div>
            </div>
            
            <div class="deal-section">
                <h4>PITI Breakdown</h4>
                <div class="deal-metric">
                    <span class="deal-metric-label">Principal</span>
                    <span class="deal-metric-value">$${Math.round(metrics.piti.principal).toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Interest</span>
                    <span class="deal-metric-value">$${Math.round(metrics.piti.interest).toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Taxes</span>
                    <span class="deal-metric-value">$${Math.round(metrics.piti.taxes).toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Insurance</span>
                    <span class="deal-metric-value">$${Math.round(metrics.piti.insurance).toLocaleString()}</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Total PITI</span>
                    <span class="deal-metric-value">$${Math.round(metrics.piti.total).toLocaleString()}</span>
                </div>
            </div>
            
            <div class="deal-section">
                <h4>Market Trends</h4>
                <div class="deal-metric">
                    <span class="deal-metric-label">Annual Appreciation</span>
                    <span class="deal-metric-value positive">${property.marketTrends.appreciation.toFixed(1)}%</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Rent Growth</span>
                    <span class="deal-metric-value positive">${property.marketTrends.rentGrowth.toFixed(1)}%</span>
                </div>
                <div class="deal-metric">
                    <span class="deal-metric-label">Demand Score</span>
                    <span class="deal-metric-value">${property.marketTrends.demandScore.toFixed(1)}/10</span>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn btn-primary" onclick="toggleWishlist('${property.mlsNumber}'); closeDealModal();" style="margin-right: 1rem;">
                Add to Wishlist
            </button>
            <button class="btn btn-secondary" onclick="closeDealModal()">
                Close
            </button>
        </div>
    `;
    
    dealModal.style.display = 'block';
}

function closeDealModal() {
    dealModal.style.display = 'none';
}

function openWishlistModal() {
    // Reuse wishlist modal functionality from main site
    renderWishlistModal();
    wishlistModal.style.display = 'block';
}

function closeWishlistModal() {
    wishlistModal.style.display = 'none';
}

function renderWishlistModal() {
    const totalProperties = wishlist.reduce((sum, item) => sum + item.quantity, 0);
    const totalInvestment = wishlist.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCashFlow = wishlist.reduce((sum, item) => sum + (item.metrics.cashFlow * item.quantity), 0);
    const averageROI = wishlist.length > 0 ? 
        wishlist.reduce((sum, item) => sum + item.metrics.roi, 0) / wishlist.length : 0;
    
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
            <div class="wishlist-item-details">
                <div class="wishlist-item-title">${item.address}</div>
                <div class="wishlist-item-price">$${item.price.toLocaleString()}</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 0.25rem;">
                    MLS# ${item.mlsNumber} | ROI: ${item.metrics.roi.toFixed(1)}% | Cash Flow: $${item.metrics.cashFlow.toLocaleString()}
                </div>
            </div>
            <div class="wishlist-item-actions">
                <button class="remove-btn" onclick="removeFromWishlist('${item.mlsNumber}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeFromWishlist(mlsNumber) {
    wishlist = wishlist.filter(item => item.mlsNumber !== mlsNumber);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlistModal();
    renderDealsTable();
}

// Export functionality
function exportToCSV() {
    const headers = [
        'Rank', 'MLS#', 'Address', 'Area', 'Type', 'Multi-Family', 'Detached', 'Large Garage',
        'Price', 'Est. Rent', 'PITI', 'Rent/PITI', 'Cash Flow', 'ROI', 'Cap Rate', 'List Date'
    ];
    
    const csvData = filteredDeals.map((property, index) => {
        const metrics = calculateMetrics(property);
        return [
            index + 1,
            property.mlsNumber,
            `"${property.address}"`,
            property.area,
            property.type,
            property.isMultiFamily ? 'Yes' : 'No',
            property.isDetached ? 'Yes' : 'No',
            property.hasLargeGarage ? 'Yes' : 'No',
            property.price,
            property.estimatedRent,
            Math.round(metrics.piti.total),
            `${metrics.rentToPitiRatio.toFixed(1)}%`,
            Math.round(metrics.cashFlow),
            `${metrics.roi.toFixed(1)}%`,
            `${metrics.capRate.toFixed(1)}%`,
            property.listDate
        ];
    });
    
    const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seattle-investment-deals-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Refresh analysis
function refreshAnalysis() {
    // Simulate data refresh
    document.getElementById('refreshData').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    
    setTimeout(() => {
        applyFiltersAndSort();
        updateSummaryStats();
        document.getElementById('refreshData').innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Analysis';
        
        // Show success message
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = '<i class="fas fa-check"></i> Analysis refreshed successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }, 1500);
} 