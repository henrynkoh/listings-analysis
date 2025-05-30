#!/usr/bin/env python3
"""
SimplyRETS Connection Test Script
Test your SimplyRETS API credentials and basic functionality
"""

import os
from dotenv import load_dotenv
from simplyrets_integration import SimplyRETSConnector

def test_simplyrets_integration():
    """Test SimplyRETS integration step by step"""
    
    print("🏠 Seattle REI Analyzer - SimplyRETS Integration Test")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    # Get credentials
    username = os.getenv('SIMPLYRETS_USERNAME')
    password = os.getenv('SIMPLYRETS_PASSWORD')
    vendor = os.getenv('SIMPLYRETS_VENDOR', 'test')
    
    if not username or not password:
        print("❌ Missing credentials! Please set SIMPLYRETS_USERNAME and SIMPLYRETS_PASSWORD in .env file")
        return False
    
    print(f"📋 Using credentials: {username[:4]}*** / Vendor: {vendor}")
    
    # Initialize connector
    print("\n1️⃣ Initializing SimplyRETS connector...")
    connector = SimplyRETSConnector(username, password, vendor)
    
    # Test connection
    print("\n2️⃣ Testing API connection...")
    if not connector.test_connection():
        print("❌ Connection failed! Check your credentials and try again.")
        return False
    
    # Fetch sample properties
    print("\n3️⃣ Fetching sample properties...")
    try:
        properties = connector.get_seattle_properties(limit=5)
        print(f"✅ Retrieved {len(properties)} sample properties")
        
        if properties:
            # Show first property
            prop = properties[0]
            print(f"\n📍 Sample Property:")
            print(f"   Address: {prop.get('address', {}).get('streetName', 'Unknown')}")
            print(f"   Price: ${prop.get('listPrice', 0):,}")
            print(f"   Type: {prop.get('property', {}).get('type', 'Unknown')}")
    
    except Exception as e:
        print(f"❌ Failed to fetch properties: {e}")
        return False
    
    # Test property analysis
    print("\n4️⃣ Testing property analysis...")
    try:
        if properties:
            analysis = connector.analyze_investment_property(properties[0])
            chars = analysis['characteristics']
            metrics = analysis['investment_metrics']
            
            print(f"✅ Analysis completed!")
            print(f"   Multi-Family: {'✅' if chars['multi_family'] else '❌'}")
            print(f"   Detached: {'✅' if chars['detached'] else '❌'}")
            print(f"   Large Garage: {'✅' if chars['large_garage'] else '❌'}")
            print(f"   Cap Rate: {metrics['cap_rate']:.1f}%")
            print(f"   Cash Flow: ${metrics['monthly_cash_flow']:,.0f}/month")
    
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        return False
    
    # Test database saving
    print("\n5️⃣ Testing database integration...")
    try:
        # Analyze a few properties
        deals = connector.get_top_investment_deals(count=3)
        connector.save_to_database(deals)
        print(f"✅ Saved {len(deals)} deals to database")
    
    except Exception as e:
        print(f"❌ Database save failed: {e}")
        return False
    
    print("\n🎉 All tests passed! SimplyRETS integration is working correctly.")
    print("\n📊 Next steps:")
    print("   1. Update your Flask app to use real SimplyRETS data")
    print("   2. Configure your preferred search parameters")
    print("   3. Set up automated data refresh")
    
    return True

if __name__ == "__main__":
    test_simplyrets_integration() 