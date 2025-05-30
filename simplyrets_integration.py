# 🏠 SimplyRETS Integration for Seattle Real Estate Investment Analyzer
# This module integrates with SimplyRETS API to fetch real MLS data

import requests
import json
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import sqlite3
import logging
from urllib.parse import urlencode
import base64

# Import existing analyzer components
from nwmls_data_parser import PropertyAnalyzer

class SimplyRETSConnector:
    """
    SimplyRETS API connector for fetching MLS data
    
    Features:
    - Real-time MLS property data
    - Investment property filtering  
    - Seattle market focus
    - Property characteristic analysis
    - Rate limiting and error handling
    """
    
    def __init__(self, username: str, password: str, vendor: str = "test"):
        """
        Initialize SimplyRETS connection
        
        Args:
            username: SimplyRETS username
            password: SimplyRETS password  
            vendor: MLS vendor (default: test for demo)
        """
        self.username = username
        self.password = password
        self.vendor = vendor
        self.base_url = "https://api.simplyrets.com"
        self.analyzer = PropertyAnalyzer()
        
        # Setup authentication
        credentials = f"{username}:{password}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        self.headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
            "User-Agent": "Seattle-REI-Analyzer/1.0"
        }
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 10 requests per second max
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
    def _rate_limit(self):
        """Enforce rate limiting"""
        now = time.time()
        time_since_last = now - self.last_request_time
        if time_since_last < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last)
        self.last_request_time = time.time()
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """
        Make API request with error handling
        
        Args:
            endpoint: API endpoint
            params: Query parameters
            
        Returns:
            API response data or None if failed
        """
        self._rate_limit()
        
        url = f"{self.base_url}/{endpoint}"
        if params:
            url += f"?{urlencode(params)}"
            
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            self.logger.error(f"API request failed: {e}")
            return None
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON decode error: {e}")
            return None
    
    def test_connection(self) -> bool:
        """
        Test API connection
        
        Returns:
            True if connection successful
        """
        try:
            response = self._make_request("properties", {"limit": 1})
            if response:
                self.logger.info("✅ SimplyRETS connection successful!")
                return True
            else:
                self.logger.error("❌ SimplyRETS connection failed")
                return False
        except Exception as e:
            self.logger.error(f"❌ Connection test failed: {e}")
            return False
    
    def get_seattle_properties(self, 
                              limit: int = 100,
                              min_price: int = 200000,
                              max_price: int = 2000000,
                              property_types: List[str] = None) -> List[Dict]:
        """
        Fetch Seattle area properties for investment analysis
        
        Args:
            limit: Maximum number of properties
            min_price: Minimum price filter
            max_price: Maximum price filter
            property_types: Property types to include
            
        Returns:
            List of property data dictionaries
        """
        # Seattle area zip codes
        seattle_zips = [
            "98101", "98102", "98103", "98104", "98105", "98106", "98107", 
            "98108", "98109", "98112", "98115", "98116", "98117", "98118", 
            "98119", "98121", "98122", "98125", "98126", "98133", "98134", 
            "98136", "98144", "98146", "98154", "98164", "98174", "98177", 
            "98178", "98195", "98199",
            # Nearby investment areas
            "98092",  # Federal Way
            "98003", "98023", "98032", "98042",  # South King County
            "98168", "98148", "98166", "98188"   # SeaTac area
        ]
        
        if property_types is None:
            property_types = ["Residential", "Condo", "Multi-Family"]
        
        all_properties = []
        
        for zip_code in seattle_zips[:10]:  # Start with first 10 zip codes
            params = {
                "limit": min(limit // len(seattle_zips[:10]), 50),
                "minprice": min_price,
                "maxprice": max_price,
                "postalcode": zip_code,
                "type": ",".join(property_types),
                "status": "Active"
            }
            
            self.logger.info(f"Fetching properties from {zip_code}...")
            properties = self._make_request("properties", params)
            
            if properties:
                all_properties.extend(properties)
                time.sleep(0.2)  # Be nice to the API
            
            if len(all_properties) >= limit:
                break
        
        self.logger.info(f"📊 Fetched {len(all_properties)} properties from SimplyRETS")
        return all_properties[:limit]
    
    def analyze_investment_property(self, property_data: Dict) -> Dict:
        """
        Analyze property for investment characteristics
        
        Args:
            property_data: SimplyRETS property data
            
        Returns:
            Analysis results with investment metrics
        """
        # Convert SimplyRETS format to our analyzer format
        analyzer_data = self._convert_simplyrets_format(property_data)
        
        # Run our intelligent property analyzer
        analysis = self.analyzer.analyze_property(analyzer_data)
        
        # Calculate investment metrics
        investment_metrics = self._calculate_investment_metrics(property_data)
        
        # Combine results
        return {
            "property_id": property_data.get("listingId", "unknown"),
            "address": property_data.get("address", {}),
            "price": property_data.get("listPrice", 0),
            "characteristics": {
                "multi_family": analysis.get("is_multi_family", False),
                "detached": analysis.get("is_detached", False), 
                "large_garage": analysis.get("has_large_garage", False)
            },
            "confidence_scores": analysis.get("confidence", {}),
            "investment_metrics": investment_metrics,
            "raw_data": property_data
        }
    
    def _convert_simplyrets_format(self, property_data: Dict) -> Dict:
        """Convert SimplyRETS data to our analyzer format"""
        
        # Extract key fields
        address = property_data.get("address", {})
        property_info = property_data.get("property", {})
        
        return {
            "ListingId": property_data.get("listingId"),
            "ListPrice": property_data.get("listPrice", 0),
            "PropertyType": property_info.get("type", "RESI"),
            "SquareFeet": property_info.get("area", 0),
            "LotSize": property_info.get("lotSize", 0),
            "GarageSpaces": property_info.get("garageSpaces", 0),
            "NumberOfUnits": property_info.get("units", 1),
            "PublicRemarks": property_data.get("remarks", ""),
            "Style": property_info.get("style", ""),
            "City": address.get("city", ""),
            "PostalCode": address.get("postalCode", ""),
            "Street": f"{address.get('streetNumber', '')} {address.get('streetName', '')}",
            "YearBuilt": property_info.get("yearBuilt", 0),
            "Bedrooms": property_info.get("bedrooms", 0),
            "Bathrooms": property_info.get("bathrooms", 0),
            "HOADues": property_info.get("association", {}).get("fee", 0)
        }
    
    def _calculate_investment_metrics(self, property_data: Dict) -> Dict:
        """Calculate investment metrics for a property"""
        
        price = property_data.get("listPrice", 0)
        sqft = property_data.get("property", {}).get("area", 1)
        
        # Estimate rent based on Seattle market data
        estimated_rent = self._estimate_rent(property_data)
        
        # Basic investment calculations
        price_per_sqft = price / sqft if sqft > 0 else 0
        
        # Rough PITI calculation (basic estimate)
        monthly_payment = price * 0.005  # ~5% of purchase price monthly
        
        # Investment metrics
        monthly_cash_flow = estimated_rent - monthly_payment
        annual_rent = estimated_rent * 12
        cap_rate = (annual_rent / price) * 100 if price > 0 else 0
        rent_to_price = (estimated_rent / price) * 1000 if price > 0 else 0
        
        return {
            "estimated_rent": estimated_rent,
            "price_per_sqft": price_per_sqft,
            "monthly_cash_flow": monthly_cash_flow,
            "cap_rate": cap_rate,
            "rent_to_price_ratio": rent_to_price,
            "annual_rent": annual_rent,
            "monthly_payment_estimate": monthly_payment
        }
    
    def _estimate_rent(self, property_data: Dict) -> float:
        """Estimate monthly rent based on property characteristics"""
        
        property_info = property_data.get("property", {})
        bedrooms = property_info.get("bedrooms", 1)
        bathrooms = property_info.get("bathrooms", 1)
        sqft = property_info.get("area", 1000)
        
        # Seattle rent estimation (rough)
        base_rent = 1500  # Base Seattle rent
        bedroom_multiplier = bedrooms * 400
        bathroom_multiplier = bathrooms * 200
        sqft_multiplier = (sqft / 1000) * 300
        
        estimated_rent = base_rent + bedroom_multiplier + bathroom_multiplier + sqft_multiplier
        
        # Adjust for property type
        prop_type = property_info.get("type", "").lower()
        if "condo" in prop_type:
            estimated_rent *= 0.9  # Condos typically rent for less
        elif "multi" in prop_type or "duplex" in prop_type:
            estimated_rent *= 1.2  # Multi-family premium
            
        return max(estimated_rent, 800)  # Minimum rent floor
    
    def get_top_investment_deals(self, count: int = 100) -> List[Dict]:
        """
        Get top investment deals analyzed for ROI
        
        Args:
            count: Number of deals to analyze
            
        Returns:
            List of analyzed investment deals sorted by ROI
        """
        self.logger.info(f"🔍 Analyzing top {count} investment deals...")
        
        # Fetch properties
        properties = self.get_seattle_properties(limit=count)
        
        # Analyze each property
        analyzed_deals = []
        for prop in properties:
            try:
                analysis = self.analyze_investment_property(prop)
                analyzed_deals.append(analysis)
            except Exception as e:
                self.logger.error(f"Analysis failed for property {prop.get('listingId')}: {e}")
                continue
        
        # Sort by cap rate (ROI indicator)
        analyzed_deals.sort(key=lambda x: x.get("investment_metrics", {}).get("cap_rate", 0), reverse=True)
        
        self.logger.info(f"✅ Analyzed {len(analyzed_deals)} investment deals")
        return analyzed_deals
    
    def save_to_database(self, deals: List[Dict], db_path: str = "investment_deals.db"):
        """Save analyzed deals to database"""
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS investment_deals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                listing_id TEXT UNIQUE,
                address TEXT,
                price INTEGER,
                estimated_rent REAL,
                cap_rate REAL,
                cash_flow REAL,
                is_multi_family BOOLEAN,
                is_detached BOOLEAN,
                has_large_garage BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                raw_data TEXT
            )
        """)
        
        # Insert deals
        for deal in deals:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO investment_deals 
                    (listing_id, address, price, estimated_rent, cap_rate, cash_flow,
                     is_multi_family, is_detached, has_large_garage, raw_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    deal["property_id"],
                    f"{deal['address'].get('streetNumber', '')} {deal['address'].get('streetName', '')}",
                    deal["price"],
                    deal["investment_metrics"]["estimated_rent"],
                    deal["investment_metrics"]["cap_rate"],
                    deal["investment_metrics"]["monthly_cash_flow"],
                    deal["characteristics"]["multi_family"],
                    deal["characteristics"]["detached"],
                    deal["characteristics"]["large_garage"],
                    json.dumps(deal["raw_data"])
                ))
            except Exception as e:
                self.logger.error(f"Database insert failed: {e}")
                continue
        
        conn.commit()
        conn.close()
        self.logger.info(f"💾 Saved {len(deals)} deals to database")

def main():
    """Example usage"""
    
    # Initialize with your SimplyRETS credentials
    username = "YOUR_USERNAME"  # Get from SimplyRETS dashboard
    password = "YOUR_PASSWORD"  # Get from SimplyRETS dashboard
    
    connector = SimplyRETSConnector(username, password)
    
    # Test connection
    if connector.test_connection():
        print("🎉 Connected to SimplyRETS!")
        
        # Get top investment deals
        deals = connector.get_top_investment_deals(count=50)
        
        # Display results
        print(f"\n📊 Top 10 Investment Deals:")
        for i, deal in enumerate(deals[:10], 1):
            metrics = deal["investment_metrics"]
            chars = deal["characteristics"]
            
            print(f"\n{i}. ${deal['price']:,} - {deal['address'].get('streetName', 'Unknown St')}")
            print(f"   Cap Rate: {metrics['cap_rate']:.1f}% | Cash Flow: ${metrics['monthly_cash_flow']:,.0f}")
            print(f"   Multi-Family: {'✅' if chars['multi_family'] else '❌'} | "
                  f"Detached: {'✅' if chars['detached'] else '❌'} | "
                  f"Large Garage: {'✅' if chars['large_garage'] else '❌'}")
        
        # Save to database
        connector.save_to_database(deals)
        
    else:
        print("❌ Failed to connect to SimplyRETS")

if __name__ == "__main__":
    main() 