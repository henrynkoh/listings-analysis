// ROI Calculator JavaScript

// Global variables
let currentCalculation = null;
let scenarios = [];

// Tax rates by location
const taxRates = {
    seattle: 0.0092,
    bellevue: 0.0078,
    redmond: 0.0078,
    kirkland: 0.0078,
    bothell: 0.0078,
    everett: 0.0078,
    tacoma: 0.0078,
    renton: 0.0078,
    'federal-way': 0.0085 // Federal Way tax rate
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupEventListeners();
    loadWishlistCount();
    updateDownPaymentPercent();
});

function initializeCalculator() {
    // Check for URL parameters (e.g., from zip code search)
    const urlParams = new URLSearchParams(window.location.search);
    const zipcode = urlParams.get('zipcode');
    const location = urlParams.get('location');
    
    // Pre-fill form if redirected from zip code search
    if (zipcode === '98092' && location) {
        // Set location to Federal Way (98092 zip code area)
        const locationSelect = document.getElementById('location');
        if (locationSelect) {
            // Add Federal Way option if it doesn't exist
            let federalWayOption = Array.from(locationSelect.options).find(option => 
                option.value.toLowerCase().includes('federal way') || option.text.toLowerCase().includes('federal way')
            );
            
            if (!federalWayOption) {
                federalWayOption = new Option('Federal Way', 'federal-way');
                locationSelect.appendChild(federalWayOption);
            }
            
            locationSelect.value = federalWayOption.value;
        }
        
        // Set some default values for Federal Way area (98092)
        const propertyPriceInput = document.getElementById('propertyPrice');
        const monthlyRentInput = document.getElementById('monthlyRent');
        
        if (propertyPriceInput && !propertyPriceInput.value) {
            propertyPriceInput.value = '650000'; // Average home price in Federal Way
        }
        
        if (monthlyRentInput && !monthlyRentInput.value) {
            monthlyRentInput.value = '2800'; // Average rent in Federal Way
        }
        
        // Update property taxes based on Federal Way rates
        updatePropertyTaxes();
        
        // Show a welcome message
        showZipCodeWelcomeMessage(zipcode, location);
    }
    
    // Set default values and calculate initial results
    calculateROI();
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

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Form inputs - real-time calculation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.id === 'propertyPrice' || this.id === 'downPayment') {
                updateDownPaymentPercent();
            }
            if (this.id === 'location') {
                updatePropertyTaxes();
            }
            // Debounce calculation for better performance
            clearTimeout(this.calcTimeout);
            this.calcTimeout = setTimeout(() => {
                calculateROI();
            }, 300);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function updateDownPaymentPercent() {
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    
    const percentage = propertyPrice > 0 ? ((downPayment / propertyPrice) * 100).toFixed(1) : 0;
    const percentElement = document.getElementById('downPaymentPercent');
    if (percentElement) {
        percentElement.textContent = `${percentage}%`;
    }
}

function updatePropertyTaxes() {
    const location = document.getElementById('location').value;
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    const taxRate = taxRates[location] || 0.0078;
    const annualTaxes = propertyPrice * taxRate;
    
    const taxesInput = document.getElementById('propertyTaxes');
    if (taxesInput) {
        taxesInput.value = Math.round(annualTaxes);
    }
}

function calculateROI() {
    try {
        // Get all input values
        const inputs = getFormInputs();
        
        // Validate inputs
        if (!validateInputs(inputs)) {
            clearResults();
            return;
        }

        // Calculate mortgage payment (PITI)
        const monthlyPI = calculateMonthlyPayment(
            inputs.loanAmount,
            inputs.interestRate / 100 / 12,
            inputs.loanTerm * 12
        );

        const monthlyTaxes = inputs.propertyTaxes / 12;
        const monthlyInsurance = inputs.insurance / 12;
        const monthlyPITI = monthlyPI + monthlyTaxes + monthlyInsurance;

        // Calculate monthly expenses
        const monthlyMaintenance = inputs.maintenance / 12;
        const monthlyManagement = (inputs.monthlyRent + inputs.otherIncome) * (inputs.propertyManagement / 100);
        const monthlyVacancy = (inputs.monthlyRent + inputs.otherIncome) * (inputs.vacancyRate / 100);

        const totalMonthlyExpenses = monthlyPITI + inputs.hoaFees + monthlyMaintenance + monthlyManagement + monthlyVacancy;
        const totalMonthlyIncome = inputs.monthlyRent + inputs.otherIncome;
        const monthlyCashFlow = totalMonthlyIncome - totalMonthlyExpenses;
        const annualCashFlow = monthlyCashFlow * 12;

        // Calculate ROI
        const totalCashInvested = inputs.downPayment + inputs.closingCosts + inputs.renovationCosts;
        const roi = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

        // Calculate Cap Rate
        const annualNOI = (totalMonthlyIncome * 12) - (inputs.propertyTaxes + inputs.insurance + inputs.maintenance + (monthlyManagement * 12) + (monthlyVacancy * 12));
        const capRate = inputs.propertyPrice > 0 ? (annualNOI / inputs.propertyPrice) * 100 : 0;

        // Calculate Rent to PITI ratio
        const rentToPITI = monthlyPITI > 0 ? (totalMonthlyIncome / monthlyPITI) * 100 : 0;

        // Store calculation results
        currentCalculation = {
            inputs,
            results: {
                monthlyPI,
                monthlyTaxes,
                monthlyInsurance,
                monthlyPITI,
                monthlyMaintenance,
                monthlyManagement,
                monthlyVacancy,
                totalMonthlyExpenses,
                totalMonthlyIncome,
                monthlyCashFlow,
                annualCashFlow,
                totalCashInvested,
                roi,
                capRate,
                rentToPITI
            }
        };

        // Update display
        updateResults(currentCalculation.results);
        updateInvestmentGrade(currentCalculation.results);

    } catch (error) {
        console.error('Calculation error:', error);
        clearResults();
    }
}

function getFormInputs() {
    return {
        propertyPrice: parseFloat(document.getElementById('propertyPrice').value) || 0,
        propertyType: document.getElementById('propertyType').value,
        location: document.getElementById('location').value,
        bedrooms: parseInt(document.getElementById('bedrooms').value) || 0,
        bathrooms: parseFloat(document.getElementById('bathrooms').value) || 0,
        squareFootage: parseInt(document.getElementById('squareFootage').value) || 0,
        downPayment: parseFloat(document.getElementById('downPayment').value) || 0,
        interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
        loanTerm: parseInt(document.getElementById('loanTerm').value) || 30,
        closingCosts: parseFloat(document.getElementById('closingCosts').value) || 0,
        renovationCosts: parseFloat(document.getElementById('renovationCosts').value) || 0,
        propertyTaxes: parseFloat(document.getElementById('propertyTaxes').value) || 0,
        insurance: parseFloat(document.getElementById('insurance').value) || 0,
        hoaFees: parseFloat(document.getElementById('hoaFees').value) || 0,
        maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
        propertyManagement: parseFloat(document.getElementById('propertyManagement').value) || 0,
        vacancyRate: parseFloat(document.getElementById('vacancyRate').value) || 0,
        monthlyRent: parseFloat(document.getElementById('monthlyRent').value) || 0,
        otherIncome: parseFloat(document.getElementById('otherIncome').value) || 0,
        rentGrowth: parseFloat(document.getElementById('rentGrowth').value) || 0,
        appreciation: parseFloat(document.getElementById('appreciation').value) || 0,
        get loanAmount() { return this.propertyPrice - this.downPayment; }
    };
}

function validateInputs(inputs) {
    return inputs.propertyPrice > 0 && 
           inputs.downPayment >= 0 && 
           inputs.downPayment <= inputs.propertyPrice &&
           inputs.interestRate > 0 &&
           inputs.monthlyRent > 0;
}

function calculateMonthlyPayment(principal, monthlyRate, numPayments) {
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
}

function updateResults(results) {
    // Update key metrics
    document.getElementById('roiValue').textContent = `${results.roi.toFixed(1)}%`;
    document.getElementById('cashFlowValue').textContent = `$${results.monthlyCashFlow.toFixed(0)}`;
    document.getElementById('capRateValue').textContent = `${results.capRate.toFixed(1)}%`;
    document.getElementById('rentRatioValue').textContent = `${results.rentToPITI.toFixed(0)}%`;

    // Update breakdown sections
    document.getElementById('grossIncome').textContent = `$${results.totalMonthlyIncome.toFixed(0)}`;
    document.getElementById('otherIncomeDisplay').textContent = `$${currentCalculation.inputs.otherIncome.toFixed(0)}`;
    document.getElementById('totalIncome').textContent = `$${results.totalMonthlyIncome.toFixed(0)}`;

    document.getElementById('piPayment').textContent = `$${results.monthlyPI.toFixed(0)}`;
    document.getElementById('taxesMonthly').textContent = `$${results.monthlyTaxes.toFixed(0)}`;
    document.getElementById('insuranceMonthly').textContent = `$${results.monthlyInsurance.toFixed(0)}`;
    document.getElementById('hoaMonthly').textContent = `$${currentCalculation.inputs.hoaFees.toFixed(0)}`;
    document.getElementById('maintenanceMonthly').textContent = `$${results.monthlyMaintenance.toFixed(0)}`;
    document.getElementById('managementMonthly').textContent = `$${results.monthlyManagement.toFixed(0)}`;
    document.getElementById('vacancyMonthly').textContent = `$${results.monthlyVacancy.toFixed(0)}`;
    document.getElementById('totalExpenses').textContent = `$${results.totalMonthlyExpenses.toFixed(0)}`;

    document.getElementById('totalInvestment').textContent = `$${results.totalCashInvested.toLocaleString()}`;
    document.getElementById('loanAmount').textContent = `$${currentCalculation.inputs.loanAmount.toLocaleString()}`;
    document.getElementById('monthlyCashFlow').textContent = `$${results.monthlyCashFlow.toFixed(0)}`;
    document.getElementById('annualCashFlow').textContent = `$${results.annualCashFlow.toFixed(0)}`;

    // Add color coding for cash flow
    const cashFlowElements = [
        document.getElementById('cashFlowValue'),
        document.getElementById('monthlyCashFlow')
    ];
    
    cashFlowElements.forEach(element => {
        if (element) {
            element.style.color = results.monthlyCashFlow >= 0 ? '#48bb78' : '#f56565';
        }
    });
}

function updateInvestmentGrade(results) {
    // Calculate overall grade based on multiple factors
    let score = 0;
    let grades = {};

    // Cash Flow (25 points)
    if (results.monthlyCashFlow >= 500) {
        score += 25;
        grades.cashFlow = 'excellent';
    } else if (results.monthlyCashFlow >= 200) {
        score += 20;
        grades.cashFlow = 'good';
    } else if (results.monthlyCashFlow >= 0) {
        score += 15;
        grades.cashFlow = 'fair';
    } else {
        score += 0;
        grades.cashFlow = 'poor';
    }

    // ROI (25 points)
    if (results.roi >= 15) {
        score += 25;
        grades.roi = 'excellent';
    } else if (results.roi >= 10) {
        score += 20;
        grades.roi = 'good';
    } else if (results.roi >= 5) {
        score += 15;
        grades.roi = 'fair';
    } else {
        score += 0;
        grades.roi = 'poor';
    }

    // Cap Rate (25 points)
    if (results.capRate >= 8) {
        score += 25;
        grades.capRate = 'excellent';
    } else if (results.capRate >= 6) {
        score += 20;
        grades.capRate = 'good';
    } else if (results.capRate >= 4) {
        score += 15;
        grades.capRate = 'fair';
    } else {
        score += 0;
        grades.capRate = 'poor';
    }

    // Rent to PITI (25 points)
    if (results.rentToPITI >= 130) {
        score += 25;
        grades.rentRatio = 'excellent';
    } else if (results.rentToPITI >= 120) {
        score += 20;
        grades.rentRatio = 'good';
    } else if (results.rentToPITI >= 110) {
        score += 15;
        grades.rentRatio = 'fair';
    } else {
        score += 0;
        grades.rentRatio = 'poor';
    }

    // Overall grade
    let overallGrade;
    if (score >= 85) overallGrade = 'excellent';
    else if (score >= 70) overallGrade = 'good';
    else if (score >= 55) overallGrade = 'fair';
    else overallGrade = 'poor';

    // Update display
    const gradeElement = document.getElementById('investmentGrade');
    if (gradeElement) {
        gradeElement.textContent = overallGrade.toUpperCase();
        gradeElement.className = `grade-badge ${overallGrade}`;
    }

    // Update individual criteria
    Object.keys(grades).forEach(key => {
        const element = document.getElementById(`${key}Status`);
        if (element) {
            element.textContent = grades[key].toUpperCase();
            element.className = `criteria-status ${grades[key]}`;
        }
    });
}

function clearResults() {
    const resultElements = [
        'roiValue', 'cashFlowValue', 'capRateValue', 'rentRatioValue',
        'grossIncome', 'otherIncomeDisplay', 'totalIncome',
        'piPayment', 'taxesMonthly', 'insuranceMonthly', 'hoaMonthly',
        'maintenanceMonthly', 'managementMonthly', 'vacancyMonthly', 'totalExpenses',
        'totalInvestment', 'loanAmount', 'monthlyCashFlow', 'annualCashFlow'
    ];

    resultElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '--';
            element.style.color = '';
        }
    });

    const gradeElement = document.getElementById('investmentGrade');
    if (gradeElement) {
        gradeElement.textContent = '--';
        gradeElement.className = 'grade-badge';
    }
}

function resetCalculator() {
    // Reset all form inputs to default values
    document.getElementById('propertyPrice').value = '750000';
    document.getElementById('propertyType').value = 'single-family';
    document.getElementById('location').value = 'seattle';
    document.getElementById('bedrooms').value = '3';
    document.getElementById('bathrooms').value = '2';
    document.getElementById('squareFootage').value = '1500';
    document.getElementById('downPayment').value = '187500';
    document.getElementById('interestRate').value = '6.5';
    document.getElementById('loanTerm').value = '30';
    document.getElementById('closingCosts').value = '15000';
    document.getElementById('renovationCosts').value = '0';
    document.getElementById('propertyTaxes').value = '6900';
    document.getElementById('insurance').value = '1200';
    document.getElementById('hoaFees').value = '0';
    document.getElementById('maintenance').value = '3000';
    document.getElementById('propertyManagement').value = '8';
    document.getElementById('vacancyRate').value = '5';
    document.getElementById('monthlyRent').value = '3200';
    document.getElementById('otherIncome').value = '0';
    document.getElementById('rentGrowth').value = '3';
    document.getElementById('appreciation').value = '4';

    // Update dependent fields
    updateDownPaymentPercent();
    updatePropertyTaxes();
    
    // Recalculate
    calculateROI();
}

function exportResults() {
    if (!currentCalculation) {
        alert('Please calculate ROI first before exporting.');
        return;
    }

    // Simulate PDF export
    const button = event.target.closest('.btn-icon');
    const originalHTML = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 2000);
    }, 2000);
}

function saveToWishlist() {
    if (!currentCalculation) {
        alert('Please calculate ROI first before saving to wishlist.');
        return;
    }

    const property = {
        id: Date.now().toString(),
        title: `${currentCalculation.inputs.propertyType} in ${currentCalculation.inputs.location}`,
        location: currentCalculation.inputs.location,
        price: currentCalculation.inputs.propertyPrice,
        roi: currentCalculation.results.roi,
        cashFlow: currentCalculation.results.monthlyCashFlow,
        capRate: currentCalculation.results.capRate,
        rentToPITI: currentCalculation.results.rentToPITI,
        bedrooms: currentCalculation.inputs.bedrooms,
        bathrooms: currentCalculation.inputs.bathrooms,
        squareFootage: currentCalculation.inputs.squareFootage,
        dateAdded: new Date().toISOString()
    };

    let wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
    wishlist.push(property);
    localStorage.setItem('propertyWishlist', JSON.stringify(wishlist));

    // Update wishlist count
    loadWishlistCount();

    // Show success feedback
    const button = event.target.closest('.btn-icon');
    const originalHTML = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.color = '#48bb78';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
    }, 2000);
}

function addScenario() {
    if (!currentCalculation) {
        alert('Please calculate ROI first before adding a scenario.');
        return;
    }

    const scenarioName = prompt('Enter a name for this scenario:');
    if (!scenarioName) return;

    const scenario = {
        id: Date.now().toString(),
        name: scenarioName,
        calculation: JSON.parse(JSON.stringify(currentCalculation))
    };

    scenarios.push(scenario);
    updateScenarioGrid();
}

function updateScenarioGrid() {
    const grid = document.getElementById('scenarioGrid');
    if (!grid) return;

    if (scenarios.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #718096; padding: 2rem;">No scenarios saved yet. Calculate ROI and click "Add Scenario" to compare different options.</p>';
        return;
    }

    grid.innerHTML = scenarios.map(scenario => `
        <div class="scenario-card">
            <div class="scenario-header">
                <h3>${scenario.name}</h3>
                <button class="btn-icon" onclick="removeScenario('${scenario.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="scenario-metrics">
                <div class="metric-item">
                    <span>ROI:</span>
                    <span>${scenario.calculation.results.roi.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span>Cash Flow:</span>
                    <span>$${scenario.calculation.results.monthlyCashFlow.toFixed(0)}</span>
                </div>
                <div class="metric-item">
                    <span>Cap Rate:</span>
                    <span>${scenario.calculation.results.capRate.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span>Rent/PITI:</span>
                    <span>${scenario.calculation.results.rentToPITI.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function removeScenario(scenarioId) {
    scenarios = scenarios.filter(s => s.id !== scenarioId);
    updateScenarioGrid();
}

function handleSearch(query) {
    if (query.length < 2) return;
    
    // Simulate search functionality
    console.log('Searching for:', query);
    
    // In a real application, this would search through saved calculations
    // or property databases and populate the form
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
                <p>${property.location} • ${property.bedrooms}bd/${property.bathrooms}ba • ${property.squareFootage} sqft</p>
                <div class="wishlist-metrics">
                    <span>ROI: ${property.roi.toFixed(1)}%</span>
                    <span>Cash Flow: $${property.cashFlow.toFixed(0)}</span>
                    <span>Cap Rate: ${property.capRate.toFixed(1)}%</span>
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

// Add CSS for scenario cards and wishlist items
const style = document.createElement('style');
style.textContent = `
    .scenario-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .scenario-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
    }
    
    .scenario-metrics {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .metric-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
    }
    
    .metric-item span:first-child {
        color: #718096;
    }
    
    .metric-item span:last-child {
        font-weight: 600;
        color: #2d3748;
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

// Show welcome message when redirected from zip code search
function showZipCodeWelcomeMessage(zipcode, location) {
    // Create welcome notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 350px;
        animation: slideInRight 0.5s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
            <i class="fas fa-map-marker-alt" style="margin-right: 0.5rem; font-size: 1.2rem;"></i>
            <strong style="font-size: 1.1rem;">Welcome to ${location}!</strong>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
            You searched for zip code <strong>${zipcode}</strong>. We've pre-filled the calculator with average values for ${location} area.
        </div>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.7;
            padding: 0.25rem;
        ">×</button>
    `;
    
    // Add animation keyframes
    if (!document.getElementById('zipcode-animations')) {
        const style = document.createElement('style');
        style.id = 'zipcode-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }
    }, 8000);
} 