# Zip Code Search Feature - 98092 Auto-Redirect

## Overview
The Seattle Real Estate Investment Analyzer now includes intelligent zip code search functionality. When users search for specific zip codes, they are automatically redirected to the most relevant page with pre-filled data.

## Current Implementation: 98092 (Federal Way)

### How It Works
1. **Search Detection**: When a user enters "98092" in any search box across the platform
2. **Auto-Redirect**: The system automatically redirects to the ROI Calculator page
3. **Pre-filled Data**: The calculator is pre-populated with Federal Way area data
4. **Welcome Message**: A friendly notification explains the redirect and pre-filled values

### Pages with Zip Code Detection
- ✅ **Home Page** (`index.html`) - Main search bar
- ✅ **Top Deals Page** (`deals.html`) - Search functionality
- ✅ **ROI Calculator** (`roi-calculator.html`) - Handles URL parameters and shows welcome message

### Pre-filled Data for 98092 (Federal Way)
- **Location**: Federal Way
- **Average Property Price**: $650,000
- **Average Monthly Rent**: $2,800
- **Property Tax Rate**: 0.85% annually
- **Welcome Message**: Personalized notification with zip code confirmation

### Technical Implementation

#### Search Detection Logic
```javascript
// Check for specific zip code 98092 and redirect to ROI Calculator
if (query === '98092') {
    // Show loading state briefly
    showSearchLoading();
    
    // Redirect to ROI Calculator with pre-filled data for 98092 area
    setTimeout(() => {
        hideSearchLoading();
        window.location.href = 'roi-calculator.html?zipcode=98092&location=Federal Way';
    }, 500);
    return;
}
```

#### URL Parameter Handling
```javascript
// Check for URL parameters (e.g., from zip code search)
const urlParams = new URLSearchParams(window.location.search);
const zipcode = urlParams.get('zipcode');
const location = urlParams.get('location');

// Pre-fill form if redirected from zip code search
if (zipcode === '98092' && location) {
    // Set location and default values
    // Show welcome message
}
```

### User Experience Flow
1. User enters "98092" in search box
2. Loading indicator appears briefly (500ms)
3. Automatic redirect to ROI Calculator
4. Form pre-filled with Federal Way data
5. Welcome notification appears (8 seconds, dismissible)
6. User can immediately start analyzing investments

### Files Modified
- `script.js` - Added zip code detection to main search
- `deals.js` - Added zip code detection to deals search
- `roi-calculator.js` - Added URL parameter handling and welcome message
- Tax rates updated to include Federal Way

### Future Enhancements
- Add more zip codes (98001, 98003, 98023, etc.)
- Redirect to different pages based on zip code characteristics
- Add zip code-specific market data and trends
- Implement zip code autocomplete suggestions

### Testing
To test the feature:
1. Go to any page with search functionality
2. Enter "98092" in the search box
3. Verify automatic redirect to ROI Calculator
4. Check that Federal Way is selected and values are pre-filled
5. Confirm welcome message appears

### Configuration
The zip code mappings and default values can be easily modified in the respective JavaScript files:

```javascript
// Add new zip codes in script.js and deals.js
if (query === '98001') {
    window.location.href = 'roi-calculator.html?zipcode=98001&location=Auburn';
}

// Add corresponding data in roi-calculator.js
if (zipcode === '98001' && location) {
    // Set Auburn-specific values
}
```

## Benefits
- **Improved User Experience**: Instant access to relevant tools
- **Location-Specific Data**: Pre-filled with accurate local market data
- **Reduced Friction**: No manual form filling required
- **Educational**: Users learn about specific market areas
- **Scalable**: Easy to add more zip codes and destinations

This feature enhances the platform's usability by providing intelligent, location-aware navigation that saves users time and provides immediate value. 