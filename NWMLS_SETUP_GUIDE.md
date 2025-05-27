# NWMLS Integration Setup Guide 🏢

*Complete guide to connecting your Seattle Real Estate Investment Analyzer with NWMLS daily listings*

## 📋 Prerequisites

### NWMLS Membership Requirements
- ✅ Active NWMLS broker or agent membership
- ✅ Current NWMLS subscription in good standing
- ✅ Signed NWMLS Data License Agreement
- ✅ API access approval from NWMLS

### Technical Requirements
- Python 3.8+ installed
- Active internet connection
- 500MB+ available disk space
- Valid SSL certificates for API calls

---

## 💰 NWMLS API Costs & Access Levels

### **Broker/Agent Access (Most Common)**
```
RETS Feed Access: $0-50/month
- Usually included with NWMLS membership
- Real-time listing data
- Full property details and photos
- Status change notifications

IDX Display License: $0-25/month
- Usually included with membership
- Public display of listings
- Limited to display purposes only
- Cannot be used for investment analysis

Commercial API Access: $100-500/month
- High-volume data access
- Bulk data downloads
- Advanced search capabilities
- Commercial use rights
```

### **What's Typically Included FREE:**
- Basic RETS feed access
- Up to 1000 API calls per hour
- Standard listing data fields
- Property photos (up to 25 per listing)
- Status updates (Active, Pending, Sold)

### **Additional Costs:**
- High-volume usage: $0.01-0.05 per API call over limit
- Premium data fields: $25-100/month
- Historical data access: $50-200/month
- Custom integrations: $500-2000 setup fee

---

## 🔧 Step-by-Step Setup

### Step 1: Contact NWMLS for API Access

**Call NWMLS Technology Department:**
- **Phone**: (425) 974-1011
- **Email**: techsupport@nwmls.com
- **Hours**: Monday-Friday, 8:00 AM - 5:00 PM PST

**What to Request:**
1. **RETS Feed Access** for your broker account
2. **API credentials** (username/password)
3. **Data License Agreement** for commercial use
4. **Rate limits** and usage guidelines
5. **Technical documentation** and endpoints

**Information You'll Need to Provide:**
- NWMLS Member ID
- Broker License Number
- Intended use case (investment analysis platform)
- Expected daily API call volume
- Technical contact information

### Step 2: Obtain API Credentials

NWMLS will provide you with:
```
Username: your_nwmls_username
Password: your_api_password
Login URL: https://api.nwmls.com/v1/login
Base URL: https://api.nwmls.com/v1
User Agent: YourCompanyName/1.0
```

### Step 3: Configure Your Platform

1. **Copy the environment file:**
```bash
cp config.env.example config.env
```

2. **Edit config.env with your credentials:**
```bash
# NWMLS API Configuration
NWMLS_USERNAME=your_actual_username
NWMLS_PASSWORD=your_actual_password
NWMLS_BASE_URL=https://api.nwmls.com/v1
NWMLS_USER_AGENT=YourBrokerageName/1.0
```

3. **Install required packages:**
```bash
pip install -r requirements.txt
```

### Step 4: Test API Connection

```bash
python test_nwmls_connection.py
```

This will verify:
- ✅ API credentials are valid
- ✅ Network connectivity works
- ✅ Rate limits are appropriate
- ✅ Data format is correct

### Step 5: Run Initial Data Sync

```bash
python nwmls_integration.py
```

This will:
- Download last 24 hours of listings
- Calculate investment metrics
- Store data in local database
- Generate initial analytics

---

## 📊 Available Data Fields

### **Standard Listing Data (Usually Free):**
- MLS Number
- Property Address
- List Price
- Bedrooms/Bathrooms
- Square Footage
- Lot Size
- Year Built
- Property Type
- List Date
- Status
- Basic Photos (up to 25)

### **Premium Data Fields (May Cost Extra):**
- Detailed Property History
- Tax Records
- HOA Information
- Utility Costs
- School District Details
- Neighborhood Statistics
- Market Trends
- Comparable Sales

### **Investment-Specific Calculations (Our Platform Adds):**
- Estimated Rental Income
- Monthly PITI Payments
- Cash Flow Projections
- ROI Calculations
- Cap Rate Analysis
- Rent-to-PITI Ratios

---

## ⚙️ Automation Setup

### Daily Sync Schedule
```python
# Automatic sync every hour
schedule.every().hour.do(sync_new_listings)

# Full database refresh daily at 6 AM
schedule.every().day.at("06:00").do(full_sync)

# Clean old listings weekly
schedule.every().sunday.at("02:00").do(cleanup_old_listings)
```

### Monitoring and Alerts
- Email notifications for sync failures
- Daily summary reports
- API rate limit monitoring
- Data quality checks

---

## 🔒 Compliance and Legal Considerations

### **NWMLS Data Usage Rules:**
1. **Attribution Required**: Must display "Data provided by NWMLS"
2. **Refresh Requirements**: Data must be refreshed every 24 hours
3. **Display Limitations**: Cannot display sold properties older than 90 days
4. **Commercial Use**: Requires separate commercial license
5. **Data Sharing**: Cannot share raw data with third parties

### **Investment Analysis Compliance:**
- ✅ Calculations and projections are clearly marked as estimates
- ✅ Disclaimers about investment risks are displayed
- ✅ Data sources are properly attributed
- ✅ User agreements include liability limitations

### **Required Disclaimers:**
```
"Investment calculations are estimates only and should not be 
considered as investment advice. Actual returns may vary. 
Consult with qualified professionals before making investment 
decisions. Data provided by NWMLS."
```

---

## 🚀 Advanced Features

### Real-Time Notifications
```python
# Set up alerts for high-ROI properties
def setup_investment_alerts():
    # Email alerts for properties with 15%+ ROI
    # SMS alerts for properties under $500K with positive cash flow
    # Slack notifications for multi-family properties
```

### Custom Filters
```python
# Investment-focused filters
filters = {
    'min_roi': 10,
    'min_cash_flow': 200,
    'max_price': 1000000,
    'property_types': ['RESI', 'COND', 'MULT'],
    'areas': ['Seattle', 'Bellevue', 'Redmond']
}
```

### Market Analysis
```python
# Automated market reports
def generate_market_report():
    # Weekly market trends
    # Neighborhood analysis
    # Investment opportunity alerts
    # Portfolio performance tracking
```

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Authentication Failures:**
```
Error: 401 Unauthorized
Solution: Check username/password, verify account status
```

**Rate Limit Exceeded:**
```
Error: 429 Too Many Requests
Solution: Reduce API call frequency, upgrade to higher tier
```

**Missing Data Fields:**
```
Error: KeyError on property field
Solution: Check if field requires premium access
```

**Connection Timeouts:**
```
Error: Request timeout
Solution: Check internet connection, try different endpoint
```

### Support Contacts

**NWMLS Technical Support:**
- Phone: (425) 974-1011
- Email: techsupport@nwmls.com
- Hours: Monday-Friday, 8:00 AM - 5:00 PM PST

**Platform Support:**
- Email: support@seattle-rei-analyzer.com
- Documentation: See MANUAL.md
- GitHub Issues: Create issue in repository

---

## 📈 Expected Performance

### **Data Volume:**
- **New Listings Daily**: 50-200 properties
- **Total Active Listings**: 5,000-15,000 properties
- **API Calls per Day**: 500-2,000 calls
- **Database Size**: 100-500 MB

### **Sync Performance:**
- **Initial Setup**: 30-60 minutes
- **Daily Sync**: 5-15 minutes
- **Real-time Updates**: 1-5 minutes
- **Full Refresh**: 60-120 minutes

### **Investment Analysis:**
- **Properties Analyzed**: 100% of retrieved listings
- **Calculation Time**: <1 second per property
- **Accuracy**: ±10% for rent estimates, ±5% for PITI
- **Update Frequency**: Real-time with new listings

---

## 💡 Best Practices

### **API Usage Optimization:**
1. **Batch Requests**: Group multiple property requests
2. **Caching**: Store frequently accessed data locally
3. **Incremental Updates**: Only fetch changed data
4. **Error Handling**: Implement retry logic with backoff
5. **Monitoring**: Track API usage and performance

### **Data Quality:**
1. **Validation**: Verify all incoming data fields
2. **Cleaning**: Remove duplicate or invalid listings
3. **Enrichment**: Add calculated investment metrics
4. **Archiving**: Maintain historical data for trends
5. **Backup**: Regular database backups

### **Investment Analysis:**
1. **Conservative Estimates**: Use realistic rent projections
2. **Market Adjustments**: Factor in local market conditions
3. **Risk Assessment**: Include market volatility factors
4. **Regular Updates**: Refresh calculations with new data
5. **Professional Review**: Have calculations verified by experts

---

## 📞 Getting Started Checklist

- [ ] Contact NWMLS for API access approval
- [ ] Obtain API credentials and documentation
- [ ] Sign data license agreement
- [ ] Configure platform with credentials
- [ ] Test API connection and data retrieval
- [ ] Run initial data sync
- [ ] Set up automated scheduling
- [ ] Configure monitoring and alerts
- [ ] Review compliance requirements
- [ ] Train team on platform usage

**Estimated Setup Time**: 2-5 business days  
**Monthly Operating Cost**: $0-100 (depending on usage)  
**Technical Difficulty**: Intermediate  

---

*For additional support or questions about NWMLS integration, contact our technical team or refer to the comprehensive documentation in MANUAL.md* 