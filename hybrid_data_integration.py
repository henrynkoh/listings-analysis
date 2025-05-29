#!/usr/bin/env python3
"""
Hybrid Multi-Source Data Integration for Seattle Real Estate Investment Analyzer
Combines Redfin API, Rentals.com API, Census data, and web scraping
"""

import requests
import json
import time
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from bs4 import BeautifulSoup
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import logging

class HybridInvestmentAnalyzer:
    def __init__(self):
        # API credentials
        self.redfin_api_key = os.getenv('REDFIN_API_KEY')
        self.rentals_api_key = os.getenv('RENTALS_API_KEY')
        
        # API endpoints
        self.redfin_base_url = 'https://api.redfin.com/v1'
        self.rentals_base_url = 'https://api.rentals.com/v1'
        self.census_base_url = 'https://api.census.gov/data/2021/acs/acs5'
        
        # Rate limiting
        self.request_delays = {
            'redfin': 0.5,
            'rentals': 0.2,
            'census': 0.1,
            'scraping': 1.0
        }
        
        self.setup_database()
        self.setup_logging()

    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('hybrid_analyzer.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def setup_database(self):
        """Setup comprehensive database for multi-source data"""
        conn = sqlite3.connect('hybrid_properties.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id TEXT UNIQUE NOT NULL,
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
                source TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rental_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id TEXT,
                estimated_rent REAL,
                rent_source TEXT,
                comparable_rents TEXT,
                market_rent_trend REAL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties (property_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS neighborhood_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                zip_code TEXT UNIQUE,
                median_income REAL,
                population INTEGER,
                employment_rate REAL,
                crime_rate REAL,
                school_rating REAL,
                walkability_score INTEGER,
                transit_score INTEGER,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS investment_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id TEXT,
                estimated_rent REAL,
                cap_rate REAL,
                cash_flow REAL,
                roi REAL,
                investment_score REAL,
                risk_score REAL,
                last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties (property_id)
            )
        ''')
        
        conn.commit()
        conn.close()

    def fetch_redfin_properties(self, region: str = "Seattle, WA") -> List[Dict]:
        """Fetch properties from Redfin API"""
        time.sleep(self.request_delays['redfin'])
        
        headers = {
            'Authorization': f'Bearer {self.redfin_api_key}',
            'Content-Type': 'application/json'
        }
        
        params = {
            'region': region,
            'property_type': 'house,condo,townhouse',
            'status': 'for-sale',
            'min_price': 200000,
            'max_price': 3000000,
            'limit': 200
        }
        
        try:
            response = requests.get(
                f"{self.redfin_base_url}/properties/search",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                self.logger.info(f"Fetched {len(data.get('properties', []))} properties from Redfin")
                return data.get('properties', [])
            else:
                self.logger.error(f"Redfin API error: {response.status_code}")
                return []
                
        except Exception as e:
            self.logger.error(f"Error fetching Redfin data: {str(e)}")
            return []

    def fetch_rental_estimates(self, address: str, bedrooms: int, bathrooms: float) -> Dict:
        """Fetch rental estimates from Rentals.com API"""
        time.sleep(self.request_delays['rentals'])
        
        headers = {
            'Authorization': f'Bearer {self.rentals_api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'address': address,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'radius': 2  # 2 mile radius for comparables
        }
        
        try:
            response = requests.post(
                f"{self.rentals_base_url}/rent-estimate",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'estimated_rent': result.get('estimated_rent', 0),
                    'comparable_rents': result.get('comparable_properties', []),
                    'market_trend': result.get('market_trend', 0),
                    'confidence': result.get('confidence_score', 0)
                }
            else:
                return self.fallback_rent_estimate(address, bedrooms, bathrooms)
                
        except Exception as e:
            self.logger.error(f"Rentals.com API error: {str(e)}")
            return self.fallback_rent_estimate(address, bedrooms, bathrooms)

    def fallback_rent_estimate(self, address: str, bedrooms: int, bathrooms: float) -> Dict:
        """Fallback rent estimation using web scraping"""
        try:
            # Scrape Apartments.com for comparable rents
            search_url = f"https://www.apartments.com/seattle-wa/{bedrooms}-bedrooms/"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            time.sleep(self.request_delays['scraping'])
            response = requests.get(search_url, headers=headers)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                rent_elements = soup.find_all('span', class_='rentRange')
                
                rents = []
                for element in rent_elements[:10]:  # Get first 10 results
                    rent_text = element.text.strip()
                    # Extract numeric rent values
                    import re
                    rent_match = re.search(r'\$(\d{1,3},?\d{3})', rent_text)
                    if rent_match:
                        rent = int(rent_match.group(1).replace(',', ''))
                        rents.append(rent)
                
                if rents:
                    avg_rent = sum(rents) / len(rents)
                    return {
                        'estimated_rent': avg_rent,
                        'comparable_rents': rents,
                        'market_trend': 0,
                        'confidence': 0.6
                    }
            
            # Final fallback to local calculation
            return self.calculate_local_rent(bedrooms, bathrooms, address)
            
        except Exception as e:
            self.logger.error(f"Web scraping error: {str(e)}")
            return self.calculate_local_rent(bedrooms, bathrooms, address)

    def calculate_local_rent(self, bedrooms: int, bathrooms: float, address: str) -> Dict:
        """Local rent calculation based on Seattle market data"""
        # Seattle area base rents (2024 data)
        base_rents = {
            1: 1800,  # 1 bedroom
            2: 2400,  # 2 bedroom
            3: 3200,  # 3 bedroom
            4: 4000,  # 4 bedroom
            5: 4800   # 5+ bedroom
        }
        
        base_rent = base_rents.get(bedrooms, 1800 + (bedrooms - 1) * 600)
        
        # Bathroom adjustment
        if bathrooms >= 2:
            base_rent += (bathrooms - 1) * 200
        
        # Area adjustment based on address
        area_multipliers = {
            'bellevue': 1.2,
            'redmond': 1.15,
            'kirkland': 1.1,
            'seattle': 1.0,
            'bothell': 0.95,
            'everett': 0.85,
            'tacoma': 0.8,
            'renton': 0.9
        }
        
        multiplier = 1.0
        address_lower = address.lower()
        for area, mult in area_multipliers.items():
            if area in address_lower:
                multiplier = mult
                break
        
        estimated_rent = base_rent * multiplier
        
        return {
            'estimated_rent': estimated_rent,
            'comparable_rents': [estimated_rent],
            'market_trend': 0.03,  # 3% annual growth assumption
            'confidence': 0.7
        }

    def fetch_neighborhood_data(self, zip_code: str) -> Dict:
        """Fetch neighborhood data from Census API"""
        time.sleep(self.request_delays['census'])
        
        try:
            # Census ACS 5-year data for demographics
            params = {
                'get': 'B25077_001E,B19013_001E,B08303_001E',  # Median home value, income, commute time
                'for': f'zip code tabulation area:{zip_code}',
                'key': os.getenv('CENSUS_API_KEY', '')  # Free API key from census.gov
            }
            
            response = requests.get(self.census_base_url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if len(data) > 1:  # Header + data row
                    row = data[1]
                    return {
                        'median_home_value': float(row[0]) if row[0] != '-666666666' else 0,
                        'median_income': float(row[1]) if row[1] != '-666666666' else 0,
                        'avg_commute_time': float(row[2]) if row[2] != '-666666666' else 0
                    }
            
            return {}
            
        except Exception as e:
            self.logger.error(f"Census API error: {str(e)}")
            return {}

    def scrape_additional_data(self, address: str) -> Dict:
        """Scrape additional property data from public sources"""
        try:
            # Scrape Walk Score
            walk_score = self.get_walk_score(address)
            
            # Scrape school ratings from GreatSchools.org
            school_rating = self.get_school_rating(address)
            
            return {
                'walk_score': walk_score,
                'school_rating': school_rating
            }
            
        except Exception as e:
            self.logger.error(f"Additional data scraping error: {str(e)}")
            return {}

    def get_walk_score(self, address: str) -> int:
        """Get Walk Score for address"""
        try:
            # Note: Walk Score API requires subscription
            # This is a simplified example
            encoded_address = requests.utils.quote(address)
            url = f"https://api.walkscore.com/score?format=json&address={encoded_address}&lat=47.6062&lon=-122.3321&wsapikey={os.getenv('WALKSCORE_API_KEY', '')}"
            
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                return data.get('walkscore', 50)  # Default to 50 if not found
            
            return 50  # Default walk score
            
        except Exception:
            return 50

    def get_school_rating(self, address: str) -> float:
        """Get school rating for address area"""
        try:
            # Simplified school rating based on Seattle area knowledge
            area_ratings = {
                'bellevue': 9.0,
                'redmond': 8.5,
                'kirkland': 8.0,
                'bothell': 7.5,
                'seattle': 7.0,
                'everett': 6.5,
                'tacoma': 6.0,
                'renton': 6.5
            }
            
            address_lower = address.lower()
            for area, rating in area_ratings.items():
                if area in address_lower:
                    return rating
            
            return 7.0  # Default rating
            
        except Exception:
            return 7.0

    def calculate_investment_metrics(self, property_data: Dict, rental_data: Dict, neighborhood_data: Dict) -> Dict:
        """Calculate comprehensive investment metrics"""
        try:
            price = float(property_data.get('price', 0))
            estimated_rent = rental_data.get('estimated_rent', 0)
            
            if price == 0 or estimated_rent == 0:
                return {}
            
            # Basic metrics
            annual_rent = estimated_rent * 12
            gross_yield = (annual_rent / price) * 100
            
            # Operating expenses (taxes, insurance, maintenance, vacancy)
            annual_expenses = price * 0.02  # 2% of property value
            net_operating_income = annual_rent - annual_expenses
            cap_rate = (net_operating_income / price) * 100
            
            # Cash flow analysis (25% down, 6.5% interest, 30 years)
            down_payment = price * 0.25
            loan_amount = price * 0.75
            monthly_payment = self.calculate_mortgage_payment(loan_amount, 0.065, 30)
            monthly_expenses = annual_expenses / 12
            monthly_cash_flow = estimated_rent - monthly_payment - monthly_expenses
            
            # ROI calculation
            annual_cash_flow = monthly_cash_flow * 12
            roi = (annual_cash_flow / down_payment) * 100 if down_payment > 0 else 0
            
            # Risk assessment
            risk_factors = []
            risk_score = 0
            
            # Market risk factors
            if cap_rate < 5:
                risk_factors.append("Low cap rate")
                risk_score += 2
            
            if monthly_cash_flow < 0:
                risk_factors.append("Negative cash flow")
                risk_score += 3
            
            if property_data.get('days_on_market', 0) > 90:
                risk_factors.append("Long time on market")
                risk_score += 1
            
            # Neighborhood risk factors
            median_income = neighborhood_data.get('median_income', 70000)
            if median_income < 50000:
                risk_factors.append("Low area income")
                risk_score += 2
            
            # Investment score (weighted combination)
            investment_score = (
                cap_rate * 0.3 +
                (roi if roi > 0 else 0) * 0.3 +
                (gross_yield if gross_yield > 0 else 0) * 0.2 +
                (10 - risk_score) * 0.2  # Lower risk = higher score
            )
            
            return {
                'estimated_rent': estimated_rent,
                'cap_rate': cap_rate,
                'roi': roi,
                'monthly_cash_flow': monthly_cash_flow,
                'gross_yield': gross_yield,
                'investment_score': investment_score,
                'risk_score': risk_score,
                'risk_factors': risk_factors,
                'down_payment': down_payment,
                'annual_cash_flow': annual_cash_flow
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating investment metrics: {str(e)}")
            return {}

    def calculate_mortgage_payment(self, loan_amount: float, annual_rate: float, years: int) -> float:
        """Calculate monthly mortgage payment"""
        monthly_rate = annual_rate / 12
        num_payments = years * 12
        
        if monthly_rate == 0:
            return loan_amount / num_payments
        
        payment = loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
        return payment

    def process_properties_parallel(self, properties: List[Dict]) -> List[Dict]:
        """Process properties in parallel for better performance"""
        def process_single_property(prop):
            try:
                # Get rental data
                rental_data = self.fetch_rental_estimates(
                    prop.get('address', ''),
                    prop.get('bedrooms', 0),
                    prop.get('bathrooms', 0)
                )
                
                # Get neighborhood data
                zip_code = prop.get('zip_code', '')
                neighborhood_data = self.fetch_neighborhood_data(zip_code) if zip_code else {}
                
                # Get additional data
                additional_data = self.scrape_additional_data(prop.get('address', ''))
                
                # Calculate investment metrics
                metrics = self.calculate_investment_metrics(prop, rental_data, neighborhood_data)
                
                if metrics and metrics.get('investment_score', 0) > 5:  # Minimum score threshold
                    return {
                        **prop,
                        **metrics,
                        'rental_confidence': rental_data.get('confidence', 0),
                        'walk_score': additional_data.get('walk_score', 50),
                        'school_rating': additional_data.get('school_rating', 7.0),
                        'neighborhood_data': neighborhood_data
                    }
                
                return None
                
            except Exception as e:
                self.logger.error(f"Error processing property {prop.get('address', 'Unknown')}: {str(e)}")
                return None
        
        # Process properties in parallel (max 5 concurrent to respect rate limits)
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(process_single_property, properties))
        
        # Filter out None results and sort by investment score
        valid_results = [r for r in results if r is not None]
        valid_results.sort(key=lambda x: x.get('investment_score', 0), reverse=True)
        
        return valid_results[:100]  # Top 100

    def get_top_100_deals(self) -> List[Dict]:
        """Main method to get top 100 investment deals from all sources"""
        self.logger.info("Starting hybrid data collection...")
        
        all_properties = []
        
        # Fetch from Redfin
        redfin_properties = self.fetch_redfin_properties()
        for prop in redfin_properties:
            prop['source'] = 'redfin'
        all_properties.extend(redfin_properties)
        
        # Could add more sources here (Realtor.com, etc.)
        
        self.logger.info(f"Collected {len(all_properties)} properties from all sources")
        
        # Process properties and calculate investment metrics
        investment_properties = self.process_properties_parallel(all_properties)
        
        self.logger.info(f"Processed {len(investment_properties)} investment properties")
        
        return investment_properties

    def store_results(self, properties: List[Dict]):
        """Store results in database"""
        conn = sqlite3.connect('hybrid_properties.db')
        cursor = conn.cursor()
        
        for prop in properties:
            try:
                # Store property data
                cursor.execute('''
                    INSERT OR REPLACE INTO properties (
                        property_id, address, city, state, zip_code, price, bedrooms, bathrooms,
                        sqft, lot_size, year_built, property_type, listing_status, list_date,
                        days_on_market, source
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    prop.get('id', ''), prop.get('address', ''), prop.get('city', ''),
                    prop.get('state', 'WA'), prop.get('zip_code', ''), prop.get('price', 0),
                    prop.get('bedrooms', 0), prop.get('bathrooms', 0), prop.get('sqft', 0),
                    prop.get('lot_size', 0), prop.get('year_built', 0), prop.get('property_type', ''),
                    prop.get('listing_status', ''), prop.get('list_date', ''),
                    prop.get('days_on_market', 0), prop.get('source', '')
                ))
                
                # Store investment metrics
                cursor.execute('''
                    INSERT OR REPLACE INTO investment_metrics (
                        property_id, estimated_rent, cap_rate, cash_flow, roi, investment_score, risk_score
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    prop.get('id', ''), prop.get('estimated_rent', 0), prop.get('cap_rate', 0),
                    prop.get('monthly_cash_flow', 0), prop.get('roi', 0),
                    prop.get('investment_score', 0), prop.get('risk_score', 0)
                ))
                
            except Exception as e:
                self.logger.error(f"Error storing property: {str(e)}")
                continue
        
        conn.commit()
        conn.close()

# Integration with Flask app
def add_hybrid_endpoints(app):
    """Add hybrid integration endpoints to Flask app"""
    
    analyzer = HybridInvestmentAnalyzer()
    
    @app.route('/api/hybrid-deals', methods=['GET'])
    def get_hybrid_deals():
        try:
            deals = analyzer.get_top_100_deals()
            analyzer.store_results(deals)
            
            return jsonify({
                'success': True,
                'deals': deals,
                'total': len(deals),
                'sources': ['Redfin', 'Rentals.com', 'Census', 'Web Scraping']
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    # Test the analyzer
    analyzer = HybridInvestmentAnalyzer()
    deals = analyzer.get_top_100_deals()
    print(f"Found {len(deals)} top investment deals from hybrid sources") 