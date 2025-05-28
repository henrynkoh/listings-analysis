"""
NWMLS Integration Module
Real-time listing data integration for Seattle Real Estate Investment Analyzer
"""

import requests
import json
import sqlite3
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional
import os
from dataclasses import dataclass
import schedule
import time

# Import our intelligent property analyzer
from nwmls_data_parser import NWMLSPropertyAnalyzer, analyze_property_characteristics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class NWMLSConfig:
    """NWMLS API Configuration"""
    base_url: str = "https://api.nwmls.com/v1"
    username: str = os.getenv('NWMLS_USERNAME', '')
    password: str = os.getenv('NWMLS_PASSWORD', '')
    user_agent: str = "SeattleREIAnalyzer/1.0"
    login_url: str = "https://api.nwmls.com/v1/login"
    
class NWMLSClient:
    """NWMLS API Client for real-time listing data"""
    
    def __init__(self, config: NWMLSConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': config.user_agent,
            'Content-Type': 'application/json'
        })
        self.auth_token = None
        self.token_expires = None
        
    def authenticate(self) -> bool:
        """Authenticate with NWMLS API"""
        try:
            auth_data = {
                'username': self.config.username,
                'password': self.config.password
            }
            
            response = self.session.post(
                self.config.login_url,
                json=auth_data
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('access_token')
                expires_in = data.get('expires_in', 3600)
                self.token_expires = datetime.now() + timedelta(seconds=expires_in)
                
                # Add token to session headers
                self.session.headers.update({
                    'Authorization': f'Bearer {self.auth_token}'
                })
                
                logger.info("Successfully authenticated with NWMLS")
                return True
            else:
                logger.error(f"Authentication failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return False
    
    def is_token_valid(self) -> bool:
        """Check if current token is still valid"""
        if not self.auth_token or not self.token_expires:
            return False
        return datetime.now() < self.token_expires
    
    def ensure_authenticated(self) -> bool:
        """Ensure we have a valid authentication token"""
        if not self.is_token_valid():
            return self.authenticate()
        return True
    
    def get_new_listings(self, hours_back: int = 24) -> List[Dict]:
        """Get new listings from the last N hours"""
        if not self.ensure_authenticated():
            return []
        
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(hours=hours_back)
            
            params = {
                'status': 'Active',
                'list_date_from': start_date.strftime('%Y-%m-%d'),
                'list_date_to': end_date.strftime('%Y-%m-%d'),
                'property_type': 'RESI,COND,MULT',  # Residential, Condo, Multi-family
                'area': 'Seattle,Bellevue,Redmond,Kirkland,Bothell,Everett,Tacoma,Renton',
                'limit': 1000
            }
            
            response = self.session.get(
                f"{self.config.base_url}/listings",
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                listings = data.get('listings', [])
                logger.info(f"Retrieved {len(listings)} new listings")
                return listings
            else:
                logger.error(f"Failed to get listings: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting new listings: {str(e)}")
            return []
    
    def get_listing_details(self, mls_number: str) -> Optional[Dict]:
        """Get detailed information for a specific listing"""
        if not self.ensure_authenticated():
            return None
        
        try:
            response = self.session.get(
                f"{self.config.base_url}/listings/{mls_number}"
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get listing details for {mls_number}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting listing details: {str(e)}")
            return None
    
    def get_listing_photos(self, mls_number: str) -> List[str]:
        """Get photo URLs for a listing"""
        if not self.ensure_authenticated():
            return []
        
        try:
            response = self.session.get(
                f"{self.config.base_url}/listings/{mls_number}/photos"
            )
            
            if response.status_code == 200:
                data = response.json()
                return [photo['url'] for photo in data.get('photos', [])]
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting photos: {str(e)}")
            return []

class ListingProcessor:
    """Process and analyze NWMLS listings for investment potential"""
    
    def __init__(self, db_path: str = "listings.db"):
        self.db_path = db_path
        self.property_analyzer = NWMLSPropertyAnalyzer()
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for storing listings"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS listings (
                mls_number TEXT PRIMARY KEY,
                address TEXT,
                city TEXT,
                state TEXT,
                zip_code TEXT,
                price INTEGER,
                bedrooms INTEGER,
                bathrooms REAL,
                square_feet INTEGER,
                lot_size REAL,
                year_built INTEGER,
                property_type TEXT,
                list_date TEXT,
                status TEXT,
                estimated_rent INTEGER,
                monthly_piti INTEGER,
                cash_flow INTEGER,
                roi_percentage REAL,
                cap_rate REAL,
                rent_to_piti_ratio REAL,
                is_multi_family BOOLEAN,
                is_detached BOOLEAN,
                has_large_garage BOOLEAN,
                multi_family_confidence REAL,
                detached_confidence REAL,
                garage_confidence REAL,
                detection_reasons TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def calculate_investment_metrics(self, listing: Dict) -> Dict:
        """Calculate investment metrics for a listing"""
        try:
            price = listing.get('list_price', 0)
            bedrooms = listing.get('bedrooms', 0)
            bathrooms = listing.get('bathrooms', 0)
            sqft = listing.get('square_feet', 0)
            city = listing.get('city', '').lower()
            
            # Estimate rent based on bedrooms, bathrooms, and location
            base_rent = self.estimate_rent(bedrooms, bathrooms, sqft, city)
            
            # Calculate PITI (assuming 25% down, 6.5% interest, 30-year loan)
            down_payment = price * 0.25
            loan_amount = price - down_payment
            monthly_payment = self.calculate_monthly_payment(loan_amount, 0.065, 30)
            
            # Add taxes and insurance (estimate 1.2% annually for taxes, 0.5% for insurance)
            annual_taxes = price * 0.012
            annual_insurance = price * 0.005
            monthly_piti = monthly_payment + (annual_taxes / 12) + (annual_insurance / 12)
            
            # Calculate metrics
            monthly_cash_flow = base_rent - monthly_piti
            annual_cash_flow = monthly_cash_flow * 12
            roi = (annual_cash_flow / down_payment) * 100 if down_payment > 0 else 0
            cap_rate = ((base_rent * 12) / price) * 100 if price > 0 else 0
            rent_to_piti = (base_rent / monthly_piti) * 100 if monthly_piti > 0 else 0
            
            return {
                'estimated_rent': int(base_rent),
                'monthly_piti': int(monthly_piti),
                'cash_flow': int(monthly_cash_flow),
                'roi_percentage': round(roi, 2),
                'cap_rate': round(cap_rate, 2),
                'rent_to_piti_ratio': round(rent_to_piti, 2)
            }
            
        except Exception as e:
            logger.error(f"Error calculating metrics: {str(e)}")
            return {
                'estimated_rent': 0,
                'monthly_piti': 0,
                'cash_flow': 0,
                'roi_percentage': 0,
                'cap_rate': 0,
                'rent_to_piti_ratio': 0
            }
    
    def estimate_rent(self, bedrooms: int, bathrooms: float, sqft: int, city: str) -> float:
        """Estimate monthly rent based on property characteristics"""
        # Base rent by city (Seattle market rates)
        city_multipliers = {
            'seattle': 1.0,
            'bellevue': 1.15,
            'redmond': 1.10,
            'kirkland': 1.05,
            'bothell': 0.95,
            'everett': 0.85,
            'tacoma': 0.80,
            'renton': 0.90
        }
        
        # Base rent calculation
        base_rent = 1500  # Seattle baseline for 1BR
        
        # Adjust for bedrooms
        if bedrooms >= 2:
            base_rent += (bedrooms - 1) * 400
        elif bedrooms == 0:  # Studio
            base_rent = 1200
        
        # Adjust for bathrooms
        if bathrooms >= 2:
            base_rent += (bathrooms - 1) * 200
        
        # Adjust for square footage
        if sqft > 1000:
            base_rent += (sqft - 1000) * 0.5
        
        # Apply city multiplier
        multiplier = city_multipliers.get(city, 0.90)
        estimated_rent = base_rent * multiplier
        
        return max(estimated_rent, 800)  # Minimum rent floor
    
    def calculate_monthly_payment(self, principal: float, annual_rate: float, years: int) -> float:
        """Calculate monthly mortgage payment"""
        monthly_rate = annual_rate / 12
        num_payments = years * 12
        
        if monthly_rate == 0:
            return principal / num_payments
        
        payment = principal * (monthly_rate * (1 + monthly_rate)**num_payments) / \
                 ((1 + monthly_rate)**num_payments - 1)
        
        return payment
    
    def analyze_property_characteristics(self, listing: Dict) -> Dict:
        """Use intelligent analyzer to determine property characteristics"""
        try:
            # Use the intelligent analyzer
            analysis_result = self.property_analyzer.analyze_from_nwmls_fields(listing)
            
            return {
                'is_multi_family': analysis_result['is_multi_family'],
                'is_detached': analysis_result['is_detached'],
                'has_large_garage': analysis_result['has_large_garage'],
                'multi_family_confidence': analysis_result['confidence_scores']['multi_family'],
                'detached_confidence': analysis_result['confidence_scores']['detached'],
                'garage_confidence': analysis_result['confidence_scores']['large_garage'],
                'detection_reasons': json.dumps(analysis_result['detection_reasons'])
            }
            
        except Exception as e:
            logger.error(f"Error analyzing property characteristics: {str(e)}")
            # Fallback to simple logic
            return self._fallback_characteristic_detection(listing)
    
    def _fallback_characteristic_detection(self, listing: Dict) -> Dict:
        """Fallback method for property characteristic detection"""
        property_type = listing.get('property_type', '').upper()
        garage_spaces = listing.get('garage_spaces', 0)
        
        # Simple fallback logic
        is_multi_family = property_type in ['MULT', 'DUPLEX', 'TRIPLEX']
        is_detached = property_type == 'RESI'
        has_large_garage = garage_spaces >= 2
        
        return {
            'is_multi_family': is_multi_family,
            'is_detached': is_detached,
            'has_large_garage': has_large_garage,
            'multi_family_confidence': 0.5 if is_multi_family else 0.1,
            'detached_confidence': 0.7 if is_detached else 0.3,
            'garage_confidence': 0.8 if has_large_garage else 0.2,
            'detection_reasons': json.dumps({
                'multi_family': ['Fallback detection'],
                'detached': ['Fallback detection'],
                'large_garage': ['Fallback detection']
            })
        }
    
    def process_listing(self, listing: Dict) -> bool:
        """Process a single listing and store in database"""
        try:
            mls_number = listing.get('mls_number')
            if not mls_number:
                return False
            
            # Calculate investment metrics
            metrics = self.calculate_investment_metrics(listing)
            
            # Analyze property characteristics using intelligent analyzer
            characteristics = self.analyze_property_characteristics(listing)
            
            # Prepare data for database
            listing_data = {
                'mls_number': mls_number,
                'address': listing.get('address', ''),
                'city': listing.get('city', ''),
                'state': listing.get('state', 'WA'),
                'zip_code': listing.get('zip_code', ''),
                'price': listing.get('list_price', 0),
                'bedrooms': listing.get('bedrooms', 0),
                'bathrooms': listing.get('bathrooms', 0),
                'square_feet': listing.get('square_feet', 0),
                'lot_size': listing.get('lot_size', 0),
                'year_built': listing.get('year_built', 0),
                'property_type': listing.get('property_type', ''),
                'list_date': listing.get('list_date', ''),
                'status': listing.get('status', 'Active'),
                **metrics,
                **characteristics
            }
            
            # Store in database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Use INSERT OR REPLACE to handle duplicates
            placeholders = ', '.join(['?' for _ in listing_data])
            columns = ', '.join(listing_data.keys())
            
            cursor.execute(f'''
                INSERT OR REPLACE INTO listings ({columns})
                VALUES ({placeholders})
            ''', list(listing_data.values()))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Processed listing {mls_number} - Multi-Family: {characteristics['is_multi_family']}, "
                       f"Detached: {characteristics['is_detached']}, Large Garage: {characteristics['has_large_garage']}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing listing: {str(e)}")
            return False

class NWMLSScheduler:
    """Scheduler for automated NWMLS data updates"""
    
    def __init__(self, config: NWMLSConfig):
        self.client = NWMLSClient(config)
        self.processor = ListingProcessor()
    
    def sync_new_listings(self):
        """Sync new listings from NWMLS"""
        logger.info("Starting NWMLS sync...")
        
        # Get new listings from last 24 hours
        listings = self.client.get_new_listings(hours_back=24)
        
        processed_count = 0
        multi_family_count = 0
        detached_count = 0
        large_garage_count = 0
        
        for listing in listings:
            if self.processor.process_listing(listing):
                processed_count += 1
                
                # Count characteristics for reporting
                characteristics = self.processor.analyze_property_characteristics(listing)
                if characteristics['is_multi_family']:
                    multi_family_count += 1
                if characteristics['is_detached']:
                    detached_count += 1
                if characteristics['has_large_garage']:
                    large_garage_count += 1
        
        logger.info(f"Sync complete. Processed {processed_count} listings.")
        logger.info(f"Found: {multi_family_count} multi-family, {detached_count} detached, {large_garage_count} large garage properties")
    
    def start_scheduler(self):
        """Start the automated scheduler"""
        # Schedule sync every hour
        schedule.every().hour.do(self.sync_new_listings)
        
        # Schedule full sync every day at 6 AM
        schedule.every().day.at("06:00").do(self.sync_new_listings)
        
        logger.info("NWMLS scheduler started with intelligent property analysis")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

# Configuration and usage example
if __name__ == "__main__":
    # Set up configuration
    config = NWMLSConfig(
        username="your_nwmls_username",
        password="your_nwmls_password"
    )
    
    # Initialize scheduler
    scheduler = NWMLSScheduler(config)
    
    # Run initial sync
    scheduler.sync_new_listings()
    
    # Start automated scheduler (uncomment to run continuously)
    # scheduler.start_scheduler() 