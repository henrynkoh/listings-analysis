#!/usr/bin/env python3
"""
Zillow API Integration for Seattle Real Estate Investment Analyzer
Combined with RentSpotter for rental estimates
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
import sqlite3

class ZillowInvestmentAnalyzer:
    def __init__(self):
        # Zillow API credentials
        self.zillow_api_key = os.getenv('ZILLOW_API_KEY')
        self.zillow_base_url = 'https://api.bridgedataoutput.com/api/v2'
        
        # RentSpotter API for rental estimates
        self.rentspotter_api_key = os.getenv('RENTSPOTTER_API_KEY')
        self.rentspotter_base_url = 'https://api.rentspotter.com/v1'
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 10 requests per second max
        
        self.setup_database()

    def setup_database(self):
        """Setup SQLite database for caching"""
        conn = sqlite3.connect('zillow_properties.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS zillow_properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                zpid TEXT UNIQUE NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT DEFAULT 'WA',
                zip_code TEXT,
                price REAL,
                bedrooms INTEGER,
                bathrooms REAL,
                sqft INTEGER,
                lot_size REAL,
                year_built INTEGER,
                property_type TEXT,
                listing_status TEXT,
                list_date TEXT,
                days_on_market INTEGER,
                estimated_rent REAL,
                rent_to_price_ratio REAL,
                cap_rate REAL,
                neighborhood TEXT,
                school_rating INTEGER,
                walk_score INTEGER,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                raw_data TEXT
            )
        ''')
        
        conn.commit()
        conn.close()

    def rate_limit(self):
        """Implement rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last)
        
        self.last_request_time = time.time()

    def search_properties(self, city: str = "Seattle", state: str = "WA", 
                         min_price: int = 200000, max_price: int = 3000000) -> List[Dict]:
        """Search for properties using Zillow API"""
        self.rate_limit()
        
        headers = {
            'Authorization': f'Bearer {self.zillow_api_key}',
            'Content-Type': 'application/json'
        }
        
        params = {
            'access_token': self.zillow_api_key,
            'limit': 200,  # Maximum per request
            'offset': 0,
            'filter': {
                'ListPrice': {
                    'min': min_price,
                    'max': max_price
                },
                'City': city,
                'StateOrProvince': state,
                'PropertyType': ['Residential', 'Condominium', 'Townhouse'],
                'StandardStatus': ['Active', 'Coming Soon'],
                'ListingContractDate': {
                    'min': (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
                }
            }
        }
        
        try:
            response = requests.get(
                f"{self.zillow_base_url}/odata/Property",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('value', [])
            else:
                print(f"Zillow API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Error fetching Zillow data: {str(e)}")
            return []

    def get_rental_estimate(self, address: str, bedrooms: int, bathrooms: float, sqft: int) -> float:
        """Get rental estimate from RentSpotter API"""
        self.rate_limit()
        
        headers = {
            'Authorization': f'Bearer {self.rentspotter_api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'address': address,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'square_feet': sqft,
            'property_type': 'single_family'
        }
        
        try:
            response = requests.post(
                f"{self.rentspotter_base_url}/rent-estimate",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('estimated_rent', 0)
            else:
                # Fallback to local calculation
                return self.calculate_local_rent_estimate(bedrooms, bathrooms, sqft, address)
                
        except Exception as e:
            print(f"RentSpotter API error: {str(e)}")
            return self.calculate_local_rent_estimate(bedrooms, bathrooms, sqft, address)

    def calculate_local_rent_estimate(self, bedrooms: int, bathrooms: float, sqft: int, address: str) -> float:
        """Fallback rent calculation using local market data"""
        # Seattle area rent multipliers
        area_multipliers = {
            'seattle': 1.0,
            'bellevue': 1.15,
            'redmond': 1.10,
            'kirkland': 1.05,
            'bothell': 0.95,
            'everett': 0.85,
            'tacoma': 0.80,
            'renton': 0.90
        }
        
        # Determine area from address
        address_lower = address.lower()
        multiplier = 1.0
        for area, mult in area_multipliers.items():
            if area in address_lower:
                multiplier = mult
                break
        
        # Base rent calculation
        base_rent = 1500  # Seattle baseline
        base_rent += (bedrooms - 1) * 400
        base_rent += (bathrooms - 1) * 200
        base_rent += max(0, (sqft - 1000) * 0.5)
        
        return round(base_rent * multiplier)

    def calculate_investment_metrics(self, property_data: Dict) -> Dict:
        """Calculate investment metrics for a property"""
        try:
            price = float(property_data.get('ListPrice', 0))
            bedrooms = int(property_data.get('BedroomsTotal', 0))
            bathrooms = float(property_data.get('BathroomsTotalInteger', 0))
            sqft = int(property_data.get('LivingArea', 0))
            address = property_data.get('UnparsedAddress', '')
            
            # Get rental estimate
            estimated_rent = self.get_rental_estimate(address, bedrooms, bathrooms, sqft)
            
            # Calculate basic investment metrics
            annual_rent = estimated_rent * 12
            gross_yield = (annual_rent / price * 100) if price > 0 else 0
            
            # Estimate expenses (property taxes, insurance, maintenance)
            annual_expenses = price * 0.015  # 1.5% of property value
            net_annual_income = annual_rent - annual_expenses
            cap_rate = (net_annual_income / price * 100) if price > 0 else 0
            
            # Cash flow estimate (assuming 25% down, 6.5% interest)
            down_payment = price * 0.25
            loan_amount = price * 0.75
            monthly_payment = self.calculate_mortgage_payment(loan_amount, 0.065, 30)
            monthly_expenses = annual_expenses / 12
            monthly_cash_flow = estimated_rent - monthly_payment - monthly_expenses
            
            # ROI calculation
            annual_cash_flow = monthly_cash_flow * 12
            roi = (annual_cash_flow / down_payment * 100) if down_payment > 0 else 0
            
            return {
                'estimated_rent': estimated_rent,
                'gross_yield': gross_yield,
                'cap_rate': cap_rate,
                'monthly_cash_flow': monthly_cash_flow,
                'roi': roi,
                'down_payment': down_payment,
                'monthly_payment': monthly_payment
            }
            
        except Exception as e:
            print(f"Error calculating metrics: {str(e)}")
            return {}

    def calculate_mortgage_payment(self, loan_amount: float, annual_rate: float, years: int) -> float:
        """Calculate monthly mortgage payment"""
        monthly_rate = annual_rate / 12
        num_payments = years * 12
        
        if monthly_rate == 0:
            return loan_amount / num_payments
        
        payment = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        return payment

    def process_properties(self, properties: List[Dict]) -> List[Dict]:
        """Process properties and calculate investment metrics"""
        investment_properties = []
        
        for prop in properties:
            try:
                metrics = self.calculate_investment_metrics(prop)
                if not metrics:
                    continue
                
                # Only include properties with positive cash flow potential
                if metrics.get('cap_rate', 0) >= 4:  # Minimum 4% cap rate
                    
                    processed_prop = {
                        'zpid': prop.get('ListingId', ''),
                        'address': prop.get('UnparsedAddress', ''),
                        'city': prop.get('City', ''),
                        'state': prop.get('StateOrProvince', 'WA'),
                        'zip_code': prop.get('PostalCode', ''),
                        'price': float(prop.get('ListPrice', 0)),
                        'bedrooms': int(prop.get('BedroomsTotal', 0)),
                        'bathrooms': float(prop.get('BathroomsTotalInteger', 0)),
                        'sqft': int(prop.get('LivingArea', 0)),
                        'lot_size': float(prop.get('LotSizeAcres', 0)),
                        'year_built': int(prop.get('YearBuilt', 0)),
                        'property_type': prop.get('PropertyType', ''),
                        'listing_status': prop.get('StandardStatus', ''),
                        'list_date': prop.get('ListingContractDate', ''),
                        'days_on_market': int(prop.get('DaysOnMarket', 0)),
                        'estimated_rent': metrics['estimated_rent'],
                        'cap_rate': metrics['cap_rate'],
                        'monthly_cash_flow': metrics['monthly_cash_flow'],
                        'roi': metrics['roi'],
                        'gross_yield': metrics['gross_yield']
                    }
                    
                    investment_properties.append(processed_prop)
                    
            except Exception as e:
                print(f"Error processing property: {str(e)}")
                continue
        
        # Sort by cap rate (highest first)
        investment_properties.sort(key=lambda x: x['cap_rate'], reverse=True)
        
        return investment_properties[:100]  # Top 100

    def store_properties(self, properties: List[Dict]):
        """Store properties in database"""
        conn = sqlite3.connect('zillow_properties.db')
        cursor = conn.cursor()
        
        for prop in properties:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO zillow_properties (
                        zpid, address, city, state, zip_code, price, bedrooms, bathrooms,
                        sqft, lot_size, year_built, property_type, listing_status, list_date,
                        days_on_market, estimated_rent, cap_rate, neighborhood
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    prop['zpid'], prop['address'], prop['city'], prop['state'],
                    prop['zip_code'], prop['price'], prop['bedrooms'], prop['bathrooms'],
                    prop['sqft'], prop['lot_size'], prop['year_built'], prop['property_type'],
                    prop['listing_status'], prop['list_date'], prop['days_on_market'],
                    prop['estimated_rent'], prop['cap_rate'], prop.get('neighborhood', '')
                ))
            except Exception as e:
                print(f"Error storing property: {str(e)}")
                continue
        
        conn.commit()
        conn.close()

    def get_top_100_deals(self) -> List[Dict]:
        """Main method to get top 100 investment deals"""
        print("Fetching properties from Zillow...")
        
        # Search multiple Seattle area cities
        cities = ['Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Bothell', 'Everett', 'Tacoma', 'Renton']
        all_properties = []
        
        for city in cities:
            properties = self.search_properties(city=city)
            all_properties.extend(properties)
            time.sleep(1)  # Be respectful to API
        
        print(f"Found {len(all_properties)} total properties")
        
        # Process and calculate investment metrics
        investment_properties = self.process_properties(all_properties)
        
        # Store in database
        self.store_properties(investment_properties)
        
        print(f"Processed {len(investment_properties)} investment properties")
        
        return investment_properties

# Integration with your Flask app
def add_zillow_endpoints(app):
    """Add Zillow integration endpoints to Flask app"""
    
    analyzer = ZillowInvestmentAnalyzer()
    
    @app.route('/api/zillow-deals', methods=['GET'])
    def get_zillow_deals():
        try:
            deals = analyzer.get_top_100_deals()
            return jsonify({
                'success': True,
                'deals': deals,
                'total': len(deals),
                'source': 'Zillow + RentSpotter'
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    @app.route('/api/refresh-zillow-data', methods=['POST'])
    def refresh_zillow_data():
        try:
            deals = analyzer.get_top_100_deals()
            return jsonify({
                'success': True,
                'message': f'Refreshed {len(deals)} properties',
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    # Test the analyzer
    analyzer = ZillowInvestmentAnalyzer()
    deals = analyzer.get_top_100_deals()
    print(f"Found {len(deals)} top investment deals") 