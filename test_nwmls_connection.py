#!/usr/bin/env python3
"""
NWMLS Connection Test Script
Verify API credentials and connection before full integration
"""

import os
import sys
import requests
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv('config.env')

class NWMLSConnectionTest:
    """Test NWMLS API connection and credentials"""
    
    def __init__(self):
        self.username = os.getenv('NWMLS_USERNAME', '')
        self.password = os.getenv('NWMLS_PASSWORD', '')
        self.base_url = os.getenv('NWMLS_BASE_URL', 'https://api.nwmls.com/v1')
        self.user_agent = os.getenv('NWMLS_USER_AGENT', 'SeattleREIAnalyzer/1.0')
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': self.user_agent,
            'Content-Type': 'application/json'
        })
        
        self.test_results = []
    
    def log_test(self, test_name: str, success: bool, message: str):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_credentials_configured(self):
        """Test if credentials are configured"""
        if not self.username or not self.password:
            self.log_test(
                "Credentials Configuration",
                False,
                "Username or password not configured in config.env"
            )
            return False
        
        self.log_test(
            "Credentials Configuration",
            True,
            f"Username: {self.username[:3]}*** configured"
        )
        return True
    
    def test_network_connectivity(self):
        """Test basic network connectivity to NWMLS"""
        try:
            response = requests.get(self.base_url, timeout=10)
            if response.status_code in [200, 401, 403]:  # Any response is good
                self.log_test(
                    "Network Connectivity",
                    True,
                    f"Successfully connected to {self.base_url}"
                )
                return True
            else:
                self.log_test(
                    "Network Connectivity",
                    False,
                    f"Unexpected response code: {response.status_code}"
                )
                return False
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Network Connectivity",
                False,
                f"Connection failed: {str(e)}"
            )
            return False
    
    def test_authentication(self):
        """Test API authentication"""
        try:
            auth_data = {
                'username': self.username,
                'password': self.password
            }
            
            response = self.session.post(
                f"{self.base_url}/login",
                json=auth_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    self.log_test(
                        "API Authentication",
                        True,
                        "Successfully authenticated and received access token"
                    )
                    return data['access_token']
                else:
                    self.log_test(
                        "API Authentication",
                        False,
                        "Authentication succeeded but no access token received"
                    )
                    return None
            elif response.status_code == 401:
                self.log_test(
                    "API Authentication",
                    False,
                    "Invalid credentials - check username and password"
                )
                return None
            elif response.status_code == 403:
                self.log_test(
                    "API Authentication",
                    False,
                    "Access forbidden - account may not have API access"
                )
                return None
            else:
                self.log_test(
                    "API Authentication",
                    False,
                    f"Authentication failed with status {response.status_code}"
                )
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "API Authentication",
                False,
                f"Authentication request failed: {str(e)}"
            )
            return None
    
    def test_data_access(self, access_token: str):
        """Test data access with valid token"""
        try:
            headers = {
                'Authorization': f'Bearer {access_token}',
                'User-Agent': self.user_agent,
                'Content-Type': 'application/json'
            }
            
            # Test basic listings endpoint
            params = {
                'status': 'Active',
                'property_type': 'RESI',
                'limit': 5  # Just get a few listings for testing
            }
            
            response = requests.get(
                f"{self.base_url}/listings",
                headers=headers,
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                listings = data.get('listings', [])
                self.log_test(
                    "Data Access",
                    True,
                    f"Successfully retrieved {len(listings)} sample listings"
                )
                return listings
            elif response.status_code == 403:
                self.log_test(
                    "Data Access",
                    False,
                    "Access forbidden - may need additional permissions"
                )
                return None
            elif response.status_code == 429:
                self.log_test(
                    "Data Access",
                    False,
                    "Rate limit exceeded - reduce API call frequency"
                )
                return None
            else:
                self.log_test(
                    "Data Access",
                    False,
                    f"Data access failed with status {response.status_code}"
                )
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Data Access",
                False,
                f"Data access request failed: {str(e)}"
            )
            return None
    
    def test_data_quality(self, listings):
        """Test quality and completeness of retrieved data"""
        if not listings:
            self.log_test(
                "Data Quality",
                False,
                "No listings data to analyze"
            )
            return False
        
        required_fields = ['mls_number', 'list_price', 'address', 'city']
        optional_fields = ['bedrooms', 'bathrooms', 'square_feet', 'property_type']
        
        complete_listings = 0
        for listing in listings:
            has_required = all(field in listing for field in required_fields)
            if has_required:
                complete_listings += 1
        
        completeness_rate = (complete_listings / len(listings)) * 100
        
        if completeness_rate >= 80:
            self.log_test(
                "Data Quality",
                True,
                f"Data quality good: {completeness_rate:.1f}% complete listings"
            )
            return True
        else:
            self.log_test(
                "Data Quality",
                False,
                f"Data quality poor: {completeness_rate:.1f}% complete listings"
            )
            return False
    
    def test_rate_limits(self, access_token: str):
        """Test API rate limits"""
        try:
            headers = {
                'Authorization': f'Bearer {access_token}',
                'User-Agent': self.user_agent,
                'Content-Type': 'application/json'
            }
            
            # Make multiple quick requests to test rate limiting
            start_time = datetime.now()
            successful_requests = 0
            
            for i in range(10):  # Test with 10 requests
                response = requests.get(
                    f"{self.base_url}/listings",
                    headers=headers,
                    params={'limit': 1},
                    timeout=10
                )
                
                if response.status_code == 200:
                    successful_requests += 1
                elif response.status_code == 429:
                    break  # Hit rate limit
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            if successful_requests >= 8:  # Allow for some rate limiting
                self.log_test(
                    "Rate Limits",
                    True,
                    f"Rate limits reasonable: {successful_requests}/10 requests in {duration:.1f}s"
                )
                return True
            else:
                self.log_test(
                    "Rate Limits",
                    False,
                    f"Rate limits too restrictive: {successful_requests}/10 requests in {duration:.1f}s"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Rate Limits",
                False,
                f"Rate limit test failed: {str(e)}"
            )
            return False
    
    def run_all_tests(self):
        """Run all connection tests"""
        print("🔍 NWMLS Connection Test Suite")
        print("=" * 50)
        
        # Test 1: Credentials
        if not self.test_credentials_configured():
            print("\n❌ Cannot proceed without valid credentials")
            return False
        
        # Test 2: Network connectivity
        if not self.test_network_connectivity():
            print("\n❌ Cannot proceed without network connectivity")
            return False
        
        # Test 3: Authentication
        access_token = self.test_authentication()
        if not access_token:
            print("\n❌ Cannot proceed without valid authentication")
            return False
        
        # Test 4: Data access
        listings = self.test_data_access(access_token)
        if listings is None:
            print("\n❌ Cannot access listing data")
            return False
        
        # Test 5: Data quality
        self.test_data_quality(listings)
        
        # Test 6: Rate limits
        self.test_rate_limits(access_token)
        
        # Summary
        print("\n" + "=" * 50)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        total_tests = len(self.test_results)
        
        if passed_tests == total_tests:
            print(f"🎉 All tests passed! ({passed_tests}/{total_tests})")
            print("✅ Your NWMLS integration is ready to use")
            return True
        else:
            print(f"⚠️  {passed_tests}/{total_tests} tests passed")
            print("❌ Please fix the failing tests before proceeding")
            return False
    
    def save_test_report(self):
        """Save test results to file"""
        report = {
            'test_date': datetime.now().isoformat(),
            'total_tests': len(self.test_results),
            'passed_tests': sum(1 for r in self.test_results if r['success']),
            'results': self.test_results
        }
        
        with open('nwmls_test_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Test report saved to: nwmls_test_report.json")

def main():
    """Main test function"""
    print("🏢 NWMLS API Connection Test")
    print("Testing connection to Northwest Multiple Listing Service")
    print()
    
    # Check if config file exists
    if not os.path.exists('config.env'):
        print("❌ config.env file not found!")
        print("Please copy config.env.example to config.env and configure your credentials")
        sys.exit(1)
    
    # Run tests
    tester = NWMLSConnectionTest()
    success = tester.run_all_tests()
    tester.save_test_report()
    
    if success:
        print("\n🚀 Next steps:")
        print("1. Run: python nwmls_integration.py")
        print("2. Check the listings database")
        print("3. Start the Flask application")
        sys.exit(0)
    else:
        print("\n🔧 Troubleshooting:")
        print("1. Verify your NWMLS credentials")
        print("2. Contact NWMLS support: (425) 974-1011")
        print("3. Check the setup guide: NWMLS_SETUP_GUIDE.md")
        sys.exit(1)

if __name__ == "__main__":
    main() 