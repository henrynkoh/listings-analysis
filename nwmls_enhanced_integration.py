#!/usr/bin/env python3
"""
Enhanced NWMLS Integration for Top 100 Investment Deals
Specifically designed for Seattle Real Estate Investment Analyzer
"""

import requests
import sqlite3
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dataclasses import dataclass

@dataclass
class InvestmentProperty:
    mls_number: str
    address: str
    area: str
    price: float
    bedrooms: int
    bathrooms: float
    sqft: int
    property_type: str
    list_date: str
    estimated_rent: float
    piti: float
    rent_to_piti_ratio: float
    cash_flow: float
    roi: float
    cap_rate: float
    is_multi_family: bool
    is_detached: bool
    has_large_garage: bool

class NWMLSInvestmentAnalyzer:
    def __init__(self):
        self.base_url = os.getenv('NWMLS_API_URL', 'https://api.nwmls.com')
        self.username = os.getenv('NWMLS_USERNAME')
        self.password = os.getenv('NWMLS_PASSWORD')
        self.login_url = os.getenv('NWMLS_LOGIN_URL')
        self.db_path = 'investment_properties.db'
        self.session = requests.Session()
        self.setup_database()
        self.setup_logging()

    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('nwmls_investment.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def setup_database(self):
        """Create database tables for investment properties"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS investment_properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mls_number TEXT UNIQUE NOT NULL,
                address TEXT NOT NULL,
                area TEXT NOT NULL,
                city TEXT,
                state TEXT DEFAULT 'WA',
                price REAL NOT NULL,
                bedrooms INTEGER,
                bathrooms REAL,
                sqft INTEGER,
                lot_size REAL,
                property_type TEXT,
                property_subtype TEXT,
                year_built INTEGER,
                list_date TEXT,
                days_on_market INTEGER,
                hoa_dues REAL DEFAULT 0,
                property_taxes REAL,
                estimated_rent REAL,
                monthly_piti REAL,
                rent_to_piti_ratio REAL,
                monthly_cash_flow REAL,
                annual_roi REAL,
                cap_rate REAL,
                is_multi_family BOOLEAN DEFAULT 0,
                is_detached BOOLEAN DEFAULT 0,
                has_large_garage BOOLEAN DEFAULT 0,
                garage_spaces INTEGER DEFAULT 0,
                public_remarks TEXT,
                marketing_remarks TEXT,
                photos_url TEXT,
                virtual_tour_url TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                investment_score REAL,
                confidence_scores TEXT,
                detection_reasons TEXT
            )
        ''')
        
        # Create indexes for better query performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_rent_to_piti ON investment_properties(rent_to_piti_ratio DESC)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_cash_flow ON investment_properties(monthly_cash_flow DESC)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_roi ON investment_properties(annual_roi DESC)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_area ON investment_properties(area)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_price ON investment_properties(price)')
        
        conn.commit()
        conn.close()

    def authenticate(self) -> bool:
        """Authenticate with NWMLS API"""
        try:
            auth_data = {
                'username': self.username,
                'password': self.password
            }
            
            response = self.session.post(self.login_url, data=auth_data)
            
            if response.status_code == 200:
                self.logger.info("Successfully authenticated with NWMLS")
                return True
            else:
                self.logger.error(f"Authentication failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Authentication error: {str(e)}")
            return False

    def fetch_new_listings(self, days_back: int = 7) -> List[Dict]:
        """Fetch new listings from the last N days"""
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            
            # NWMLS API parameters for new listings
            params = {
                'ListingStatus': 'Active',
                'ListDateFrom': start_date.strftime('%Y-%m-%d'),
                'ListDateTo': end_date.strftime('%Y-%m-%d'),
                'PropertyType': 'RESI,COND,MULT',  # Residential, Condo, Multi-family
                'Area': 'Seattle,Bellevue,Redmond,Kirkland,Bothell,Everett,Tacoma,Renton',
                'MinPrice': 200000,  # Minimum investment threshold
                'MaxPrice': 3000000,  # Maximum for analysis
                'SortBy': 'ListDate',
                'SortOrder': 'DESC',
                'Limit': 500  # Get more than needed for filtering
            }
            
            response = self.session.get(f"{self.base_url}/listings", params=params)
            
            if response.status_code == 200:
                listings = response.json()
                self.logger.info(f"Fetched {len(listings)} new listings")
                return listings
            else:
                self.logger.error(f"Failed to fetch listings: {response.status_code}")
                return []
                
        except Exception as e:
            self.logger.error(f"Error fetching listings: {str(e)}")
            return []

    def calculate_investment_metrics(self, property_data: Dict) -> Dict:
        """Calculate investment metrics for a property"""
        try:
            price = float(property_data.get('ListPrice', 0))
            bedrooms = int(property_data.get('Bedrooms', 0))
            bathrooms = float(property_data.get('Bathrooms', 0))
            sqft = int(property_data.get('SquareFeet', 0))
            area = property_data.get('Area', 'Seattle')
            
            # Calculate estimated rent using your existing logic
            estimated_rent = self.calculate_estimated_rent(bedrooms, bathrooms, sqft, area)
            
            # Calculate PITI (Principal, Interest, Taxes, Insurance)
            monthly_piti = self.calculate_piti(price, area)
            
            # Investment metrics
            rent_to_piti_ratio = (estimated_rent / monthly_piti * 100) if monthly_piti > 0 else 0
            monthly_cash_flow = estimated_rent - monthly_piti - (estimated_rent * 0.1)  # 10% for maintenance/vacancy
            
            # ROI calculation (25% down payment assumption)
            down_payment = price * 0.25
            annual_cash_flow = monthly_cash_flow * 12
            annual_roi = (annual_cash_flow / down_payment * 100) if down_payment > 0 else 0
            
            # Cap rate calculation
            annual_rent = estimated_rent * 12
            annual_expenses = monthly_piti * 12 + (annual_rent * 0.1)
            net_operating_income = annual_rent - annual_expenses
            cap_rate = (net_operating_income / price * 100) if price > 0 else 0
            
            # Investment score (weighted combination of metrics)
            investment_score = (
                rent_to_piti_ratio * 0.4 +  # 40% weight
                (annual_roi if annual_roi > 0 else 0) * 0.3 +  # 30% weight
                (cap_rate if cap_rate > 0 else 0) * 0.3  # 30% weight
            )
            
            return {
                'estimated_rent': estimated_rent,
                'monthly_piti': monthly_piti,
                'rent_to_piti_ratio': rent_to_piti_ratio,
                'monthly_cash_flow': monthly_cash_flow,
                'annual_roi': annual_roi,
                'cap_rate': cap_rate,
                'investment_score': investment_score
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating metrics: {str(e)}")
            return {}

    def calculate_estimated_rent(self, bedrooms: int, bathrooms: float, sqft: int, area: str) -> float:
        """Calculate estimated monthly rent based on property characteristics"""
        # Base rent rates per sqft by area (Seattle market data)
        base_rates = {
            'Seattle': 3.2,
            'Bellevue': 3.5,
            'Redmond': 3.3,
            'Kirkland': 3.1,
            'Bothell': 2.8,
            'Everett': 2.6,
            'Tacoma': 2.4,
            'Renton': 2.7
        }
        
        base_rate = base_rates.get(area, 2.8)
        
        # Base calculation
        base_rent = max(1200, sqft * base_rate)  # Minimum $1200
        
        # Adjustments for bedrooms
        if bedrooms >= 3:
            base_rent *= 1.1
        elif bedrooms <= 1:
            base_rent *= 0.9
            
        # Adjustments for bathrooms
        if bathrooms >= 2.5:
            base_rent *= 1.05
        elif bathrooms < 1.5:
            base_rent *= 0.95
            
        return round(base_rent)

    def calculate_piti(self, price: float, area: str) -> float:
        """Calculate monthly PITI payment"""
        # Loan parameters
        loan_amount = price * 0.75  # 25% down
        annual_rate = 0.065  # 6.5% interest rate
        loan_term_months = 360  # 30 years
        
        # Monthly payment calculation
        monthly_rate = annual_rate / 12
        monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate)**loan_term_months) / ((1 + monthly_rate)**loan_term_months - 1)
        
        # Property taxes (varies by area)
        tax_rates = {
            'Seattle': 0.0092,
            'Bellevue': 0.0078,
            'Redmond': 0.0082,
            'Kirkland': 0.0085,
            'Bothell': 0.0088,
            'Everett': 0.0095,
            'Tacoma': 0.0105,
            'Renton': 0.0090
        }
        
        tax_rate = tax_rates.get(area, 0.0090)
        monthly_taxes = (price * tax_rate) / 12
        
        # Insurance (approximately 0.35% annually)
        monthly_insurance = (price * 0.0035) / 12
        
        return monthly_payment + monthly_taxes + monthly_insurance

    def analyze_property_characteristics(self, property_data: Dict) -> Dict:
        """Analyze property characteristics using intelligent detection"""
        # Import your existing analyzer
        from nwmls_data_parser import PropertyAnalyzer
        
        analyzer = PropertyAnalyzer()
        analysis = analyzer.analyze_property(property_data)
        
        return {
            'is_multi_family': analysis['characteristics']['multi_family'],
            'is_detached': analysis['characteristics']['detached'],
            'has_large_garage': analysis['characteristics']['large_garage'],
            'confidence_scores': json.dumps(analysis['confidence']),
            'detection_reasons': json.dumps(analysis['reasoning'])
        }

    def process_and_store_listings(self, listings: List[Dict]) -> int:
        """Process listings and store investment properties"""
        processed_count = 0
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for listing in listings:
            try:
                # Calculate investment metrics
                metrics = self.calculate_investment_metrics(listing)
                if not metrics:
                    continue
                
                # Analyze property characteristics
                characteristics = self.analyze_property_characteristics(listing)
                
                # Only store properties with good investment potential
                if metrics.get('rent_to_piti_ratio', 0) >= 100:  # At least break-even
                    
                    # Prepare data for database
                    property_data = (
                        listing.get('MLSNumber'),
                        listing.get('Address'),
                        listing.get('Area'),
                        listing.get('City'),
                        listing.get('State', 'WA'),
                        float(listing.get('ListPrice', 0)),
                        int(listing.get('Bedrooms', 0)),
                        float(listing.get('Bathrooms', 0)),
                        int(listing.get('SquareFeet', 0)),
                        float(listing.get('LotSize', 0)),
                        listing.get('PropertyType'),
                        listing.get('PropertySubType'),
                        int(listing.get('YearBuilt', 0)),
                        listing.get('ListDate'),
                        int(listing.get('DaysOnMarket', 0)),
                        float(listing.get('HOADues', 0)),
                        float(listing.get('PropertyTaxes', 0)),
                        metrics['estimated_rent'],
                        metrics['monthly_piti'],
                        metrics['rent_to_piti_ratio'],
                        metrics['monthly_cash_flow'],
                        metrics['annual_roi'],
                        metrics['cap_rate'],
                        characteristics['is_multi_family'],
                        characteristics['is_detached'],
                        characteristics['has_large_garage'],
                        int(listing.get('GarageSpaces', 0)),
                        listing.get('PublicRemarks', ''),
                        listing.get('MarketingRemarks', ''),
                        listing.get('PhotosURL', ''),
                        listing.get('VirtualTourURL', ''),
                        metrics['investment_score'],
                        characteristics['confidence_scores'],
                        characteristics['detection_reasons']
                    )
                    
                    # Insert or update property
                    cursor.execute('''
                        INSERT OR REPLACE INTO investment_properties (
                            mls_number, address, area, city, state, price, bedrooms, bathrooms,
                            sqft, lot_size, property_type, property_subtype, year_built, list_date,
                            days_on_market, hoa_dues, property_taxes, estimated_rent, monthly_piti,
                            rent_to_piti_ratio, monthly_cash_flow, annual_roi, cap_rate,
                            is_multi_family, is_detached, has_large_garage, garage_spaces,
                            public_remarks, marketing_remarks, photos_url, virtual_tour_url,
                            investment_score, confidence_scores, detection_reasons
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', property_data)
                    
                    processed_count += 1
                    
            except Exception as e:
                self.logger.error(f"Error processing listing {listing.get('MLSNumber', 'Unknown')}: {str(e)}")
                continue
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Processed and stored {processed_count} investment properties")
        return processed_count

    def get_top_100_deals(self, sort_by: str = 'rent_to_piti_ratio') -> List[InvestmentProperty]:
        """Get top 100 investment deals from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Valid sort options
        sort_columns = {
            'rent_to_piti_ratio': 'rent_to_piti_ratio DESC',
            'cash_flow': 'monthly_cash_flow DESC',
            'roi': 'annual_roi DESC',
            'cap_rate': 'cap_rate DESC',
            'investment_score': 'investment_score DESC'
        }
        
        sort_clause = sort_columns.get(sort_by, 'rent_to_piti_ratio DESC')
        
        cursor.execute(f'''
            SELECT * FROM investment_properties 
            WHERE rent_to_piti_ratio >= 100 
            ORDER BY {sort_clause}
            LIMIT 100
        ''')
        
        results = cursor.fetchall()
        conn.close()
        
        # Convert to InvestmentProperty objects
        properties = []
        for row in results:
            prop = InvestmentProperty(
                mls_number=row[1],
                address=row[2],
                area=row[3],
                price=row[6],
                bedrooms=row[7],
                bathrooms=row[8],
                sqft=row[9],
                property_type=row[11],
                list_date=row[14],
                estimated_rent=row[18],
                piti=row[19],
                rent_to_piti_ratio=row[20],
                cash_flow=row[21],
                roi=row[22],
                cap_rate=row[23],
                is_multi_family=bool(row[24]),
                is_detached=bool(row[25]),
                has_large_garage=bool(row[26])
            )
            properties.append(prop)
        
        return properties

    def update_deals_data(self) -> Dict:
        """Main method to update investment deals data"""
        self.logger.info("Starting investment deals data update...")
        
        # Authenticate
        if not self.authenticate():
            return {'success': False, 'error': 'Authentication failed'}
        
        # Fetch new listings
        listings = self.fetch_new_listings(days_back=7)
        if not listings:
            return {'success': False, 'error': 'No new listings found'}
        
        # Process and store
        processed_count = self.process_and_store_listings(listings)
        
        # Get updated top 100
        top_deals = self.get_top_100_deals()
        
        return {
            'success': True,
            'processed_count': processed_count,
            'total_deals': len(top_deals),
            'last_updated': datetime.now().isoformat()
        }

# Usage example for your Flask app
def integrate_with_flask_app():
    """Integration example for your existing Flask app"""
    
    analyzer = NWMLSInvestmentAnalyzer()
    
    # Add this to your app.py
    @app.route('/api/update-investment-deals', methods=['POST'])
    def update_investment_deals():
        try:
            result = analyzer.update_deals_data()
            return jsonify(result)
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    @app.route('/api/top-deals', methods=['GET'])
    def get_top_deals():
        try:
            sort_by = request.args.get('sort_by', 'rent_to_piti_ratio')
            deals = analyzer.get_top_100_deals(sort_by)
            
            # Convert to JSON-serializable format
            deals_data = []
            for deal in deals:
                deals_data.append({
                    'mlsNumber': deal.mls_number,
                    'address': deal.address,
                    'area': deal.area,
                    'price': deal.price,
                    'bedrooms': deal.bedrooms,
                    'bathrooms': deal.bathrooms,
                    'sqft': deal.sqft,
                    'type': deal.property_type,
                    'listDate': deal.list_date,
                    'estimatedRent': deal.estimated_rent,
                    'monthlyPITI': deal.piti,
                    'rentToPitiRatio': deal.rent_to_piti_ratio,
                    'cashFlow': deal.cash_flow,
                    'roi': deal.roi,
                    'capRate': deal.cap_rate,
                    'isMultiFamily': deal.is_multi_family,
                    'isDetached': deal.is_detached,
                    'hasLargeGarage': deal.has_large_garage
                })
            
            return jsonify({
                'success': True,
                'deals': deals_data,
                'total': len(deals_data)
            })
            
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    # Test the analyzer
    analyzer = NWMLSInvestmentAnalyzer()
    result = analyzer.update_deals_data()
    print(f"Update result: {result}") 