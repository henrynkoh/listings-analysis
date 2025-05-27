// Analysis Page JavaScript

// API base URL
const API_BASE = window.location.origin + '/api';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalysis();
    setupEventListeners();
    loadWishlistCount();
    loadMarketStats();
    loadMarketOverview();
    loadMarketAlerts();
    updateNeighborhoodAnalysis('roi');
    loadPropertyTypes();
    animateCharts();
});

function initializeAnalysis() {
    // Load initial data from API
    loadMarketStats();
    initializePerformanceChart();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMobile = document.getElementById('navMobile');
    
    if (mobileMenuToggle && navMobile) {
        mobileMenuToggle.addEventListener('click', function() {
            navMobile.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            openWishlistModal();
        });
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeWishlistModal();
        });
    }

    // Analysis metric selector
    const analysisMetric = document.getElementById('analysisMetric');
    if (analysisMetric) {
        analysisMetric.addEventListener('change', function() {
            updateNeighborhoodAnalysis(this.value);
        });
    }

    // Time range selector
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            updateMarketOverview(this.value);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }
}

// API Functions
async function loadMarketStats() {
    try {
        const response = await fetch(`${API_BASE}/market-stats`);
        const data = await response.json();
        
        // Animate counters with real data
        const counters = [
            { id: 'totalAnalyzed', target: data.total_analyzed, suffix: '' },
            { id: 'avgMarketROI', target: data.avg_market_roi, suffix: '%' },
            { id: 'hotNeighborhoods', target: data.hot_neighborhoods, suffix: '' },
            { id: 'marketTrend', target: data.market_trend, suffix: '%', prefix: '+' }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
                animateCounter(element, 0, counter.target, 2000, counter.suffix, counter.prefix);
            }
        });
    } catch (error) {
        console.error('Error loading market stats:', error);
    }
}

async function loadMarketOverview(timeframe = '90') {
    try {
        const response = await fetch(`${API_BASE}/market-overview?timeframe=${timeframe}`);
        const data = await response.json();
        
        // Update metric values with animation
        updateMetricValue('median-price', `$${(data.median_price / 1000).toFixed(0)}K`);
        updateMetricValue('price-change', `+${data.price_change}%`);
        updateMetricValue('days-market', data.days_on_market);
        updateMetricValue('dom-change', `${data.dom_change} days`);
        updateMetricValue('sale-list', `${data.sale_to_list}%`);
        updateMetricValue('slr-change', `+${data.slr_change}%`);
        updateMetricValue('active-listings', data.active_listings.toLocaleString());
        updateMetricValue('listing-change', data.listing_change);
        
    } catch (error) {
        console.error('Error loading market overview:', error);
    }
}

async function updateNeighborhoodAnalysis(metric) {
    try {
        const response = await fetch(`${API_BASE}/neighborhood-analysis/${metric}`);
        const data = await response.json();
        
        const grid = document.getElementById('neighborhoodGrid');
        if (!grid || !data.length) return;

        grid.innerHTML = data.map(item => `
            <div class="neighborhood-card">
                <div class="neighborhood-name">${item.name}</div>
                <div class="neighborhood-metric">${item.value}</div>
                <div class="neighborhood-label">${getMetricLabel(metric)}</div>
            </div>
        `).join('');

        // Animate cards
        const cards = grid.querySelectorAll('.neighborhood-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    } catch (error) {
        console.error('Error loading neighborhood analysis:', error);
    }
}

async function loadPropertyTypes() {
    try {
        const response = await fetch(`${API_BASE}/property-types`);
        const data = await response.json();
        
        // Update property type chart
        const chartItems = document.querySelectorAll('.chart-item');
        data.forEach((item, index) => {
            if (chartItems[index]) {
                const barFill = chartItems[index].querySelector('.bar-fill');
                const chartLabel = chartItems[index].querySelector('.chart-label');
                const chartValue = chartItems[index].querySelector('.chart-value');
                
                if (barFill) barFill.style.height = `${item.percentage}%`;
                if (chartLabel) chartLabel.textContent = item.type;
                if (chartValue) chartValue.textContent = `${item.roi}% ROI`;
            }
        });
    } catch (error) {
        console.error('Error loading property types:', error);
    }
}

async function loadMarketAlerts() {
    try {
        const response = await fetch(`${API_BASE}/market-alerts`);
        const alerts = await response.json();
        
        const alertList = document.querySelector('.alert-list');
        if (!alertList) return;
        
        alertList.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-icon">
                    <i class="fas fa-${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
            </div>
        `).join('');
        
        // Update alert count
        const alertCount = document.querySelector('.alert-count');
        if (alertCount) {
            alertCount.textContent = alerts.length;
        }
    } catch (error) {
        console.error('Error loading market alerts:', error);
    }
}

function animateCounter(element, start, end, duration, suffix = '', prefix = '') {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuart(progress);
        const value = isDecimal ? current.toFixed(1) : Math.floor(current);
        
        element.textContent = `${prefix}${value}${suffix}`;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function getMetricLabel(metric) {
    const labels = {
        roi: 'Annual ROI',
        cashflow: 'Monthly Cash Flow',
        appreciation: 'YoY Appreciation',
        rentGrowth: 'Rent Growth Rate'
    };
    return labels[metric] || 'Metric';
}

function updateMarketOverview(timeframe) {
    loadMarketOverview(timeframe);
}

function updateMetricValue(elementClass, value) {
    const elements = document.querySelectorAll(`.${elementClass}`);
    elements.forEach(element => {
        element.style.opacity = '0.5';
        setTimeout(() => {
            element.textContent = value;
            element.style.opacity = '1';
        }, 150);
    });
}

function initializePerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Load and draw real performance data
    loadPerformanceData(ctx, width, height);
}

async function loadPerformanceData(ctx, width, height) {
    try {
        const response = await fetch(`${API_BASE}/performance-data`);
        const data = await response.json();
        
        // Draw grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        for (let i = 1; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw ROI line
        ctx.setLineDash([]);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.roi.forEach((value, index) => {
            const x = (width / (data.roi.length - 1)) * index;
            const y = height - (value / 20) * height; // Scale to chart height
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Add labels
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        data.labels.forEach((label, index) => {
            const x = (width / (data.labels.length - 1)) * index;
            ctx.fillText(label, x, height - 5);
        });

    } catch (error) {
        console.error('Error loading performance data:', error);
        // Fallback to placeholder
        drawChartPlaceholder(ctx, width, height);
    }
}

function drawChartPlaceholder(ctx, width, height) {
    // Draw placeholder chart
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Draw grid lines
    for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Add chart label
    ctx.fillStyle = '#a0aec0';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Loading Performance Data...', width / 2, height / 2);
}

function animateCharts() {
    // Animate property type chart bars
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach((bar, index) => {
        const targetHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'height 1s ease-out';
            bar.style.height = targetHeight;
        }, index * 200);
    });
}

async function refreshData() {
    try {
        // Show refresh animation
        const refreshBtn = document.querySelector('.refresh-btn i');
        if (refreshBtn) {
            refreshBtn.style.animation = 'spin 1s linear';
        }

        // Call refresh API
        const response = await fetch(`${API_BASE}/refresh-data`);
        const result = await response.json();
        
        if (result.status === 'success') {
            // Reload all data
            await Promise.all([
                loadMarketStats(),
                loadMarketOverview(),
                loadMarketAlerts(),
                updateNeighborhoodAnalysis(document.getElementById('analysisMetric')?.value || 'roi'),
                loadPropertyTypes()
            ]);
        }
        
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.style.animation = '';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error refreshing data:', error);
    }
}

function openComparison() {
    // Placeholder for comparison tool
    alert('Market Comparison tool coming soon! This will allow you to compare properties and neighborhoods side by side.');
}

function exportReport() {
    // Simulate report export
    const button = event.target.closest('.tool-btn');
    const originalText = button.textContent;
    
    button.textContent = 'Generating...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Download Complete!';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }, 2000);
}

function handleSearch(query) {
    if (query.length < 2) return;
    
    // Simulate search functionality
    console.log('Searching for:', query);
    
    // In a real application, this would search through properties
    // and update the display accordingly
}

// Wishlist functionality
function loadWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
    const countElement = document.getElementById('wishlistCount');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

function openWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
        modal.style.display = 'flex';
        loadWishlistItems();
    }
}

function closeWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
    const container = document.getElementById('wishlistItems');
    const totalProperties = document.getElementById('totalProperties');
    const totalInvestment = document.getElementById('totalInvestment');
    const totalCashFlow = document.getElementById('totalCashFlow');
    const averageROI = document.getElementById('averageROI');

    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096; padding: 2rem;">No properties in wishlist yet.</p>';
        if (totalProperties) totalProperties.textContent = '0';
        if (totalInvestment) totalInvestment.textContent = '$0';
        if (totalCashFlow) totalCashFlow.textContent = '$0';
        if (averageROI) averageROI.textContent = '0%';
        return;
    }

    // Calculate totals
    let totalInvestmentAmount = 0;
    let totalMonthlyCashFlow = 0;
    let totalROI = 0;

    wishlist.forEach(property => {
        totalInvestmentAmount += property.price || 0;
        totalMonthlyCashFlow += property.cashFlow || 0;
        totalROI += property.roi || 0;
    });

    const avgROI = wishlist.length > 0 ? (totalROI / wishlist.length) : 0;

    // Update summary
    if (totalProperties) totalProperties.textContent = wishlist.length;
    if (totalInvestment) totalInvestment.textContent = `$${(totalInvestmentAmount / 1000000).toFixed(1)}M`;
    if (totalCashFlow) totalCashFlow.textContent = `$${totalMonthlyCashFlow.toLocaleString()}`;
    if (averageROI) averageROI.textContent = `${avgROI.toFixed(1)}%`;

    // Display wishlist items
    container.innerHTML = wishlist.map(property => `
        <div class="wishlist-item">
            <div class="wishlist-item-info">
                <h4>${property.title}</h4>
                <p>${property.location}</p>
                <div class="wishlist-metrics">
                    <span>ROI: ${property.roi}%</span>
                    <span>Cash Flow: $${property.cashFlow}</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromWishlist('${property.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeFromWishlist(propertyId) {
    let wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
    wishlist = wishlist.filter(property => property.id !== propertyId);
    localStorage.setItem('propertyWishlist', JSON.stringify(wishlist));
    
    loadWishlistItems();
    loadWishlistCount();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('wishlistModal');
    if (event.target === modal) {
        closeWishlistModal();
    }
});

// Add CSS animation for spinning refresh icon
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .wishlist-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .wishlist-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: #2d3748;
    }
    
    .wishlist-item-info p {
        margin: 0 0 0.5rem 0;
        color: #718096;
        font-size: 0.875rem;
    }
    
    .wishlist-metrics {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: #4a5568;
    }
    
    .remove-btn {
        background: #f56565;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    }
    
    .remove-btn:hover {
        background: #e53e3e;
    }
`;
document.head.appendChild(style); 