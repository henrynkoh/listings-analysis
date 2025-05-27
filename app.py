from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import json
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Sample real estate data that would come from NWMLS or other sources
NEIGHBORHOOD_DATA = {
    'roi': [
        {'name': 'Capitol Hill', 'value': '14.8%', 'trend': 'up'},
        {'name': 'Fremont', 'value': '18.5%', 'trend': 'up'},
        {'name': 'Ballard', 'value': '13.2%', 'trend': 'up'},
        {'name': 'Queen Anne', 'value': '11.7%', 'trend': 'stable'},
        {'name': 'Wallingford', 'value': '15.3%', 'trend': 'up'},
        {'name': 'Belltown', 'value': '9.8%', 'trend': 'down'},
        {'name': 'Green Lake', 'value': '16.1%', 'trend': 'up'},
        {'name': 'Georgetown', 'value': '22.1%', 'trend': 'up'}
    ],
    'cashflow': [
        {'name': 'Capitol Hill', 'value': '$1,250', 'trend': 'up'},
        {'name': 'Fremont', 'value': '$1,850', 'trend': 'up'},
        {'name': 'Ballard', 'value': '$1,650', 'trend': 'up'},
        {'name': 'Queen Anne', 'value': '$950', 'trend': 'stable'},
        {'name': 'Wallingford', 'value': '$1,420', 'trend': 'up'},
        {'name': 'Belltown', 'value': '$750', 'trend': 'down'},
        {'name': 'Green Lake', 'value': '$1,580', 'trend': 'up'},
        {'name': 'Georgetown', 'value': '$2,100', 'trend': 'up'}
    ],
    'appreciation': [
        {'name': 'Capitol Hill', 'value': '8.2%', 'trend': 'up'},
        {'name': 'Fremont', 'value': '6.8%', 'trend': 'up'},
        {'name': 'Ballard', 'value': '7.5%', 'trend': 'up'},
        {'name': 'Queen Anne', 'value': '5.2%', 'trend': 'stable'},
        {'name': 'Wallingford', 'value': '6.9%', 'trend': 'up'},
        {'name': 'Belltown', 'value': '4.1%', 'trend': 'down'},
        {'name': 'Green Lake', 'value': '7.8%', 'trend': 'up'},
        {'name': 'Georgetown', 'value': '12.3%', 'trend': 'up'}
    ],
    'rentGrowth': [
        {'name': 'Capitol Hill', 'value': '5.2%', 'trend': 'up'},
        {'name': 'Fremont', 'value': '4.8%', 'trend': 'up'},
        {'name': 'Ballard', 'value': '4.5%', 'trend': 'up'},
        {'name': 'Queen Anne', 'value': '3.2%', 'trend': 'stable'},
        {'name': 'Wallingford', 'value': '4.1%', 'trend': 'up'},
        {'name': 'Belltown', 'value': '2.8%', 'trend': 'down'},
        {'name': 'Green Lake', 'value': '4.6%', 'trend': 'up'},
        {'name': 'Georgetown', 'value': '6.8%', 'trend': 'up'}
    ]
}

MARKET_ALERTS = [
    {
        'type': 'high',
        'title': 'High Demand Alert',
        'message': 'Capitol Hill inventory down 35% this month',
        'time': '2 hours ago',
        'icon': 'exclamation-triangle'
    },
    {
        'type': 'medium',
        'title': 'Price Increase',
        'message': 'Bellevue median price up 8.2% QoQ',
        'time': '1 day ago',
        'icon': 'info-circle'
    },
    {
        'type': 'low',
        'title': 'New Opportunity',
        'message': 'Emerging market in Georgetown area',
        'time': '3 days ago',
        'icon': 'chart-line'
    }
]

# Serve static files (your existing frontend)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

# API Endpoints for Analysis Page
@app.route('/api/market-overview')
def market_overview():
    timeframe = request.args.get('timeframe', '90')
    
    # Simulate different data based on timeframe
    data = {
        '30': {
            'median_price': 847000,
            'price_change': 1.2,
            'days_on_market': 38,
            'dom_change': -3,
            'sale_to_list': 96,
            'slr_change': 1.8,
            'active_listings': 1247,
            'listing_change': -89
        },
        '90': {
            'median_price': 847000,
            'price_change': 3.2,
            'days_on_market': 42,
            'dom_change': -8,
            'sale_to_list': 94,
            'slr_change': 2.1,
            'active_listings': 1247,
            'listing_change': -156
        },
        '365': {
            'median_price': 847000,
            'price_change': 8.2,
            'days_on_market': 45,
            'dom_change': -12,
            'sale_to_list': 92,
            'slr_change': 3.5,
            'active_listings': 1247,
            'listing_change': -298
        }
    }
    
    return jsonify(data.get(timeframe, data['90']))

@app.route('/api/neighborhood-analysis/<metric>')
def neighborhood_analysis(metric):
    if metric in NEIGHBORHOOD_DATA:
        return jsonify(NEIGHBORHOOD_DATA[metric])
    return jsonify([])

@app.route('/api/market-stats')
def market_stats():
    return jsonify({
        'total_analyzed': 1247,
        'avg_market_roi': 12.3,
        'hot_neighborhoods': 8,
        'market_trend': 5.2
    })

@app.route('/api/performance-data')
def performance_data():
    # Generate sample performance chart data
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    roi_data = [10.2, 11.5, 12.8, 13.1, 12.9, 14.2]
    cashflow_data = [1200, 1350, 1480, 1520, 1490, 1650]
    
    return jsonify({
        'labels': months,
        'roi': roi_data,
        'cashflow': cashflow_data
    })

@app.route('/api/property-types')
def property_types():
    return jsonify([
        {'type': 'Single Family', 'roi': 12.5, 'percentage': 85},
        {'type': 'Condo', 'roi': 9.8, 'percentage': 70},
        {'type': 'Townhouse', 'roi': 13.2, 'percentage': 92},
        {'type': 'Multi-Family', 'roi': 11.1, 'percentage': 78}
    ])

@app.route('/api/market-alerts')
def market_alerts():
    return jsonify(MARKET_ALERTS)

@app.route('/api/refresh-data')
def refresh_data():
    # Simulate data refresh with slight variations
    return jsonify({
        'status': 'success',
        'message': 'Data refreshed successfully',
        'timestamp': datetime.now().isoformat()
    })

# Market Trends API endpoints
@app.route('/api/price-trends')
def price_trends():
    area = request.args.get('area', 'all')
    timerange = request.args.get('timerange', '1y')
    
    # Generate sample price trend data
    if timerange == '6m':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        median_prices = [820000, 825000, 835000, 840000, 845000, 847000]
    elif timerange == '1y':
        labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']
        median_prices = [780000, 810000, 835000, 847000]
    elif timerange == '2y':
        labels = ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4']
        median_prices = [720000, 740000, 760000, 775000, 780000, 810000, 835000, 847000]
    else:  # 5y
        labels = ['2020', '2021', '2022', '2023', '2024']
        median_prices = [650000, 680000, 720000, 760000, 847000]
    
    return jsonify({
        'labels': labels,
        'median_prices': median_prices,
        'area': area,
        'timerange': timerange
    })

@app.route('/api/market-temperature')
def market_temperature():
    return jsonify({
        'status': 'hot',
        'buyer_demand': 85,
        'inventory_level': 25,
        'price_growth': 75
    })

# AI-Powered Market Summary (New endpoint integrating your insights)
@app.route('/api/ai-market-summary')
def ai_market_summary():
    """
    AI-powered market analysis summary with real-time insights
    This endpoint can be enhanced to integrate with actual AI/LLM services
    """
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Sample AI-generated insights (replace with actual AI integration)
    ai_insights = {
        "title": "May 2025 Seattle Market Analysis",
        "summary": (
            "Market analysis shows a **47.4% year-over-year increase** in active listings, "
            "with **14,459 listings** recorded in May 2025. "
            "Key counties like Snohomish (+84.8%), Columbia (+76.9%), and King (+71.3%) "
            "showed strong inventory growth, suggesting a potential cooling of seller's market conditions."
        ),
        "key_insights": [
            {
                "type": "inventory",
                "title": "Inventory Surge",
                "description": "47.4% YoY increase in active listings indicates market rebalancing",
                "impact": "positive_for_buyers"
            },
            {
                "type": "regional",
                "title": "Regional Variations",
                "description": "Snohomish County leading with 84.8% inventory growth",
                "impact": "opportunity"
            },
            {
                "type": "market_shift",
                "title": "Market Transition",
                "description": "Shift from seller's to more balanced market conditions",
                "impact": "neutral"
            }
        ],
        "investment_outlook": {
            "short_term": "Increased negotiation power for buyers",
            "medium_term": "Price growth moderation expected",
            "long_term": "Continued appreciation at sustainable rates"
        },
        "confidence_score": 0.87,
        "data_sources": ["NWMLS", "County Records", "Market Analytics"],
        "updated": now,
        "next_update": "2025-05-27 09:00:00"
    }
    
    return jsonify(ai_insights)

# ROI Calculator API endpoints
@app.route('/api/calculate-roi', methods=['POST'])
def calculate_roi():
    data = request.json
    
    # Perform ROI calculations based on input data
    property_price = data.get('propertyPrice', 0)
    down_payment = data.get('downPayment', 0)
    monthly_rent = data.get('monthlyRent', 0)
    monthly_expenses = data.get('monthlyExpenses', 0)
    
    # Simple ROI calculation
    annual_income = monthly_rent * 12
    annual_expenses = monthly_expenses * 12
    annual_cash_flow = annual_income - annual_expenses
    roi = (annual_cash_flow / down_payment) * 100 if down_payment > 0 else 0
    
    return jsonify({
        'roi': round(roi, 2),
        'monthly_cash_flow': monthly_rent - monthly_expenses,
        'annual_cash_flow': annual_cash_flow,
        'cap_rate': round((annual_cash_flow / property_price) * 100, 2) if property_price > 0 else 0
    })

@app.route('/api/tax-rates/<location>')
def get_tax_rate(location):
    tax_rates = {
        'seattle': 0.92,
        'bellevue': 0.78,
        'redmond': 0.78,
        'kirkland': 0.78,
        'bothell': 0.78,
        'everett': 0.78,
        'tacoma': 0.78,
        'renton': 0.78
    }
    
    return jsonify({
        'location': location,
        'tax_rate': tax_rates.get(location.lower(), 0.78)
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Frontend available at: http://localhost:5000")
    print("API endpoints available at: http://localhost:5000/api/")
    app.run(host='0.0.0.0', port=5000, debug=True) 