// Market Trends Page JavaScript

// API base URL
const API_BASE = window.location.origin + '/api';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeMarketTrends();
    setupEventListeners();
    loadWishlistCount();
    loadMarketTemperature();
    animateTemperatureBars();
    initializePriceChart();
    initializeForecastChart();
});

function initializeMarketTrends() {
    // Animate hero stats
    animateHeroStats();
    
    // Load initial chart data
    updatePriceChart('1y', 'all');
    
    // Initialize market temperature animation
    setTimeout(() => {
        animateTemperatureBars();
    }, 500);
    
    // Load AI market summary
    loadAIMarketSummary();
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

    // Chart controls
    const areaSelect = document.getElementById('areaSelect');
    const timeRange = document.getElementById('timeRange');
    
    if (areaSelect) {
        areaSelect.addEventListener('change', function() {
            const currentTimeRange = timeRange ? timeRange.value : '1y';
            updatePriceChart(currentTimeRange, this.value);
        });
    }
    
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            const currentArea = areaSelect ? areaSelect.value : 'all';
            updatePriceChart(this.value, currentArea);
        });
    }

    // Metrics timeframe
    const metricsTimeframe = document.getElementById('metricsTimeframe');
    if (metricsTimeframe) {
        metricsTimeframe.addEventListener('change', function() {
            updateMetrics(this.value);
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
async function loadMarketTemperature() {
    try {
        const response = await fetch(`${API_BASE}/market-temperature`);
        const data = await response.json();
        
        // Update temperature bars
        const tempFills = document.querySelectorAll('.temp-fill');
        if (tempFills.length >= 3) {
            tempFills[0].style.width = `${data.buyer_demand}%`;
            tempFills[1].style.width = `${data.inventory_level}%`;
            tempFills[2].style.width = `${data.price_growth}%`;
            
            // Update the low class for inventory
            if (data.inventory_level < 50) {
                tempFills[1].classList.add('low');
            }
        }
        
        // Update temperature indicator
        const tempIndicator = document.querySelector('.temperature-indicator');
        if (tempIndicator) {
            tempIndicator.className = `temperature-indicator ${data.status}`;
            const statusText = tempIndicator.querySelector('span');
            if (statusText) {
                statusText.textContent = `${data.status.charAt(0).toUpperCase() + data.status.slice(1)} Market`;
            }
        }
        
    } catch (error) {
        console.error('Error loading market temperature:', error);
    }
}

function animateHeroStats() {
    const stats = [
        { selector: '.trending-up', target: 8.2, suffix: '%', prefix: '+' },
        { selector: '.trending-down', target: -15, suffix: '%' }
    ];

    stats.forEach(stat => {
        const elements = document.querySelectorAll(stat.selector);
        elements.forEach(element => {
            if (element.textContent.includes('%')) {
                animateCounter(element, 0, stat.target, 2000, stat.suffix, stat.prefix);
            }
        });
    });
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

function animateTemperatureBars() {
    const tempFills = document.querySelectorAll('.temp-fill');
    tempFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, index * 300);
    });
}

function initializePriceChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw placeholder
    drawChartPlaceholder(ctx, width, height, 'Price Trends Chart');
}

function initializeForecastChart() {
    const canvas = document.getElementById('forecastChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw forecast chart
    drawForecastChart(ctx, width, height);
}

function drawChartPlaceholder(ctx, width, height, title) {
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines
    for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 1; i < 6; i++) {
        const x = (width / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Draw sample data lines
    ctx.setLineDash([]);
    
    // Median price line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const pricePoints = [
        { x: 0, y: height * 0.8 },
        { x: width * 0.2, y: height * 0.7 },
        { x: width * 0.4, y: height * 0.6 },
        { x: width * 0.6, y: height * 0.4 },
        { x: width * 0.8, y: height * 0.3 },
        { x: width, y: height * 0.2 }
    ];
    
    pricePoints.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();

    // Price per sq ft line
    ctx.strokeStyle = '#48bb78';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sqftPoints = [
        { x: 0, y: height * 0.9 },
        { x: width * 0.2, y: height * 0.8 },
        { x: width * 0.4, y: height * 0.7 },
        { x: width * 0.6, y: height * 0.5 },
        { x: width * 0.8, y: height * 0.4 },
        { x: width, y: height * 0.3 }
    ];
    
    sqftPoints.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();

    // Add title
    ctx.fillStyle = '#a0aec0';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(title + ' (Sample Data)', width / 2, height / 2);
}

function drawForecastChart(ctx, width, height) {
    // Draw forecast bars
    const bars = [
        { label: 'Q1', value: 0.7, color: '#48bb78' },
        { label: 'Q2', value: 0.8, color: '#48bb78' },
        { label: 'Q3', value: 0.6, color: '#ed8936' },
        { label: 'Q4', value: 0.5, color: '#f56565' }
    ];

    const barWidth = width / (bars.length * 2);
    const barSpacing = barWidth * 0.5;

    bars.forEach((bar, index) => {
        const x = (index * (barWidth + barSpacing)) + barSpacing;
        const barHeight = height * bar.value * 0.8;
        const y = height - barHeight - 20;

        // Draw bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw label
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(bar.label, x + barWidth / 2, height - 5);
    });

    // Add title
    ctx.fillStyle = '#a0aec0';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('6-Month Forecast', width / 2, 20);
}

async function updatePriceChart(timeRange, area) {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear and show loading
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#a0aec0';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Loading chart data...', width / 2, height / 2);

    try {
        const response = await fetch(`${API_BASE}/price-trends?timerange=${timeRange}&area=${area}`);
        const data = await response.json();
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        // Horizontal grid lines
        for (let i = 1; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw price line
        ctx.setLineDash([]);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const maxPrice = Math.max(...data.median_prices);
        const minPrice = Math.min(...data.median_prices);
        const priceRange = maxPrice - minPrice;

        data.median_prices.forEach((price, index) => {
            const x = (width / (data.median_prices.length - 1)) * index;
            const normalizedPrice = priceRange > 0 ? (price - minPrice) / priceRange : 0.5;
            const y = height - (normalizedPrice * height * 0.8) - (height * 0.1);
            
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

        // Add title
        ctx.fillStyle = '#2d3748';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${area.toUpperCase()} - ${timeRange.toUpperCase()} Price Trends`, width / 2, 20);

    } catch (error) {
        console.error('Error loading price trends:', error);
        ctx.clearRect(0, 0, width, height);
        drawChartPlaceholder(ctx, width, height, 'Error Loading Data');
    }
}

function updateMetrics(timeframe) {
    // Simulate metrics update based on timeframe
    const metrics = {
        month: {
            activeListings: { value: 1247, change: -5.2 },
            salesVolume: { value: 892, change: 8.1 },
            saleToList: { value: 96, change: 1.8 },
            daysOnMarket: { value: 38, change: -3 }
        },
        quarter: {
            activeListings: { value: 1247, change: -12.3 },
            salesVolume: { value: 892, change: 5.7 },
            saleToList: { value: 94, change: 2.1 },
            daysOnMarket: { value: 42, change: -8 }
        },
        year: {
            activeListings: { value: 1247, change: -18.5 },
            salesVolume: { value: 892, change: 12.4 },
            saleToList: { value: 92, change: 3.5 },
            daysOnMarket: { value: 45, change: -12 }
        }
    };

    const data = metrics[timeframe] || metrics.quarter;
    
    // Update metric boxes with animation
    updateMetricBox('activeListings', data.activeListings);
    updateMetricBox('salesVolume', data.salesVolume);
    updateMetricBox('saleToList', data.saleToList);
    updateMetricBox('daysOnMarket', data.daysOnMarket);
}

function updateMetricBox(metricType, data) {
    const boxes = document.querySelectorAll('.metric-box');
    boxes.forEach(box => {
        const valueElement = box.querySelector('.metric-value');
        const changeElement = box.querySelector('.metric-change');
        
        if (valueElement && valueElement.textContent.includes(data.value.toString().substring(0, 2))) {
            // Animate value update
            valueElement.style.opacity = '0.5';
            changeElement.style.opacity = '0.5';
            
            setTimeout(() => {
                valueElement.textContent = data.value;
                changeElement.textContent = data.change > 0 ? `+${data.change}%` : `${data.change}%`;
                changeElement.className = `metric-change ${data.change > 0 ? 'positive' : 'negative'}`;
                
                valueElement.style.opacity = '1';
                changeElement.style.opacity = '1';
            }, 200);
        }
    });
}

function handleSearch(query) {
    if (query.length < 2) return;
    
    // Simulate search functionality
    console.log('Searching market trends for:', query);
    
    // In a real application, this would filter trends data
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

// Add CSS for wishlist items
const style = document.createElement('style');
style.textContent = `
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

// Load AI Market Summary
async function loadAIMarketSummary() {
    try {
        const response = await fetch(`${API_BASE}/ai-market-summary`);
        const data = await response.json();
        
        // Create AI summary section if it doesn't exist
        let aiSection = document.getElementById('ai-market-summary');
        if (!aiSection) {
            aiSection = createAISummarySection();
            // Insert after market overview section
            const marketOverview = document.querySelector('.market-overview');
            if (marketOverview) {
                marketOverview.insertAdjacentElement('afterend', aiSection);
            }
        }
        
        // Update AI summary content
        updateAISummaryContent(aiSection, data);
        
    } catch (error) {
        console.error('Error loading AI market summary:', error);
    }
}

function createAISummarySection() {
    const section = document.createElement('section');
    section.id = 'ai-market-summary';
    section.className = 'ai-summary';
    section.innerHTML = `
        <div class="container">
            <div class="ai-summary-card">
                <div class="card-header">
                    <div class="ai-header">
                        <div class="ai-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="ai-title">
                            <h2>AI Market Analysis</h2>
                            <p>Powered by advanced market intelligence</p>
                        </div>
                        <div class="confidence-score">
                            <div class="confidence-label">Confidence</div>
                            <div class="confidence-value">--</div>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="ai-summary-content">
                        <div class="summary-text">Loading AI analysis...</div>
                        <div class="key-insights">
                            <h3>Key Insights</h3>
                            <div class="insights-grid"></div>
                        </div>
                        <div class="investment-outlook">
                            <h3>Investment Outlook</h3>
                            <div class="outlook-grid"></div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="data-sources">
                        <span class="sources-label">Data Sources:</span>
                        <span class="sources-list">--</span>
                    </div>
                    <div class="last-updated">
                        <span class="updated-label">Last Updated:</span>
                        <span class="updated-time">--</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    return section;
}

function updateAISummaryContent(section, data) {
    // Update title and summary
    const titleElement = section.querySelector('.ai-title h2');
    if (titleElement) titleElement.textContent = data.title;
    
    const summaryElement = section.querySelector('.summary-text');
    if (summaryElement) {
        // Convert markdown-style bold to HTML
        const htmlSummary = data.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        summaryElement.innerHTML = htmlSummary;
    }
    
    // Update confidence score
    const confidenceValue = section.querySelector('.confidence-value');
    if (confidenceValue) {
        const percentage = Math.round(data.confidence_score * 100);
        confidenceValue.textContent = `${percentage}%`;
        confidenceValue.className = `confidence-value ${getConfidenceClass(data.confidence_score)}`;
    }
    
    // Update key insights
    const insightsGrid = section.querySelector('.insights-grid');
    if (insightsGrid && data.key_insights) {
        insightsGrid.innerHTML = data.key_insights.map(insight => `
            <div class="insight-item ${insight.impact}">
                <div class="insight-icon">
                    <i class="fas fa-${getInsightIcon(insight.type)}"></i>
                </div>
                <div class="insight-content">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-description">${insight.description}</div>
                    <div class="insight-impact">${formatImpact(insight.impact)}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Update investment outlook
    const outlookGrid = section.querySelector('.outlook-grid');
    if (outlookGrid && data.investment_outlook) {
        outlookGrid.innerHTML = `
            <div class="outlook-item">
                <div class="outlook-period">Short Term</div>
                <div class="outlook-text">${data.investment_outlook.short_term}</div>
            </div>
            <div class="outlook-item">
                <div class="outlook-period">Medium Term</div>
                <div class="outlook-text">${data.investment_outlook.medium_term}</div>
            </div>
            <div class="outlook-item">
                <div class="outlook-period">Long Term</div>
                <div class="outlook-text">${data.investment_outlook.long_term}</div>
            </div>
        `;
    }
    
    // Update footer
    const sourcesList = section.querySelector('.sources-list');
    if (sourcesList && data.data_sources) {
        sourcesList.textContent = data.data_sources.join(', ');
    }
    
    const updatedTime = section.querySelector('.updated-time');
    if (updatedTime) {
        updatedTime.textContent = new Date(data.updated).toLocaleString();
    }
    
    // Animate the section
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    setTimeout(() => {
        section.style.transition = 'all 0.5s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 100);
}

function getConfidenceClass(score) {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
}

function getInsightIcon(type) {
    const icons = {
        'inventory': 'warehouse',
        'regional': 'map-marked-alt',
        'market_shift': 'exchange-alt',
        'price': 'dollar-sign',
        'demand': 'chart-line'
    };
    return icons[type] || 'info-circle';
}

function formatImpact(impact) {
    const impacts = {
        'positive_for_buyers': 'Positive for Buyers',
        'positive_for_sellers': 'Positive for Sellers',
        'opportunity': 'Investment Opportunity',
        'neutral': 'Market Neutral',
        'caution': 'Exercise Caution'
    };
    return impacts[impact] || impact.replace('_', ' ').toUpperCase();
} 