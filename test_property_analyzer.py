#!/usr/bin/env python3
"""
Test script for the intelligent property analyzer
Verifies detection accuracy for Multi-Family, Detached, and Large Garage properties
"""

import sys
import os
from nwmls_data_parser import NWMLSPropertyAnalyzer, analyze_property_characteristics

def test_multi_family_detection():
    """Test multi-family property detection"""
    print("🏠 Testing Multi-Family Detection")
    print("=" * 50)
    
    test_cases = [
        {
            'name': 'Obvious Duplex',
            'data': {
                'PropertyType': 'MULT',
                'PublicRemarks': 'Beautiful duplex with separate entrances and utilities',
                'ListPrice': 750000,
                'NumberOfUnits': 2
            },
            'expected': True
        },
        {
            'name': 'Investment Property with Rental Income',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Great investment property with rental income from mother-in-law suite',
                'MarketingRemarks': 'Perfect for house hacking with ADU',
                'ListPrice': 650000
            },
            'expected': True
        },
        {
            'name': 'Single Family Home',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Beautiful single family home with spacious yard',
                'ListPrice': 850000
            },
            'expected': False
        },
        {
            'name': 'Triplex Property',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Triplex with three separate units, excellent rental income',
                'NumberOfUnits': 3,
                'ListPrice': 1200000
            },
            'expected': True
        }
    ]
    
    analyzer = NWMLSPropertyAnalyzer()
    
    for test_case in test_cases:
        result = analyzer.analyze_from_nwmls_fields(test_case['data'])
        detected = result['is_multi_family']
        confidence = result['confidence_scores']['multi_family']
        reasons = result['detection_reasons']['multi_family']
        
        status = "✅ PASS" if detected == test_case['expected'] else "❌ FAIL"
        print(f"{status} {test_case['name']}")
        print(f"   Expected: {test_case['expected']}, Got: {detected}")
        print(f"   Confidence: {confidence:.2f}")
        print(f"   Reasons: {', '.join(reasons)}")
        print()

def test_detached_detection():
    """Test detached property detection"""
    print("🏡 Testing Detached Property Detection")
    print("=" * 50)
    
    test_cases = [
        {
            'name': 'Residential Property',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Beautiful detached single family home with private yard',
                'Style': 'Traditional',
                'LotSize': 0.25,
                'HOADues': 0
            },
            'expected': True
        },
        {
            'name': 'Condominium',
            'data': {
                'PropertyType': 'COND',
                'PublicRemarks': 'Modern condo with shared amenities',
                'Style': 'High-Rise',
                'HOADues': 350
            },
            'expected': False
        },
        {
            'name': 'Townhouse',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Beautiful townhouse with shared wall',
                'Style': 'Townhouse',
                'HOADues': 200
            },
            'expected': False
        },
        {
            'name': 'Large Lot Residential',
            'data': {
                'PropertyType': 'RESI',
                'PublicRemarks': 'Standalone home on large private lot',
                'LotSize': 0.5,
                'HOADues': 0
            },
            'expected': True
        }
    ]
    
    analyzer = NWMLSPropertyAnalyzer()
    
    for test_case in test_cases:
        result = analyzer.analyze_from_nwmls_fields(test_case['data'])
        detected = result['is_detached']
        confidence = result['confidence_scores']['detached']
        reasons = result['detection_reasons']['detached']
        
        status = "✅ PASS" if detected == test_case['expected'] else "❌ FAIL"
        print(f"{status} {test_case['name']}")
        print(f"   Expected: {test_case['expected']}, Got: {detected}")
        print(f"   Confidence: {confidence:.2f}")
        print(f"   Reasons: {', '.join(reasons)}")
        print()

def test_large_garage_detection():
    """Test large garage detection"""
    print("🚗 Testing Large Garage Detection")
    print("=" * 50)
    
    test_cases = [
        {
            'name': 'Two Car Garage',
            'data': {
                'GarageSpaces': 2,
                'PublicRemarks': 'Home features 2 car garage with storage',
                'ListPrice': 750000
            },
            'expected': True
        },
        {
            'name': 'Single Car Garage',
            'data': {
                'GarageSpaces': 1,
                'PublicRemarks': 'Cozy home with single car garage',
                'ListPrice': 550000
            },
            'expected': False
        },
        {
            'name': 'Three Car Garage',
            'data': {
                'GarageSpaces': 3,
                'PublicRemarks': 'Luxury home with oversized 3 car garage',
                'ListPrice': 1200000,
                'SquareFeet': 3500
            },
            'expected': True
        },
        {
            'name': 'Description Mentions Large Garage',
            'data': {
                'GarageSpaces': 0,  # No explicit garage spaces
                'PublicRemarks': 'Beautiful home with spacious double garage and workshop',
                'ListPrice': 850000
            },
            'expected': True
        },
        {
            'name': 'High-End Property (Likely Large Garage)',
            'data': {
                'GarageSpaces': 0,  # No explicit data
                'PublicRemarks': 'Luxury estate with premium finishes',
                'ListPrice': 1500000,
                'SquareFeet': 4000
            },
            'expected': True
        }
    ]
    
    analyzer = NWMLSPropertyAnalyzer()
    
    for test_case in test_cases:
        result = analyzer.analyze_from_nwmls_fields(test_case['data'])
        detected = result['has_large_garage']
        confidence = result['confidence_scores']['large_garage']
        reasons = result['detection_reasons']['large_garage']
        
        status = "✅ PASS" if detected == test_case['expected'] else "❌ FAIL"
        print(f"{status} {test_case['name']}")
        print(f"   Expected: {test_case['expected']}, Got: {detected}")
        print(f"   Confidence: {confidence:.2f}")
        print(f"   Reasons: {', '.join(reasons)}")
        print()

def test_real_nwmls_sample():
    """Test with real NWMLS-style data from the images"""
    print("📋 Testing with Real NWMLS Sample Data")
    print("=" * 50)
    
    # Based on the NWMLS listing shown in the images
    sample_listing = {
        'PropertyType': 'RESI',
        'ListPrice': 599500,
        'SquareFeet': 1396,
        'PublicRemarks': '''Enter into this meticulously curated rambler that offers numerous 
        features and upgrades. You're instantly greeted with a beautiful 
        open concept living space. The kitchen has a large island with plenty of storage 
        throughout. Don't miss the bonus living area! Enjoy the luxurious finished 
        basement with a wet bar and bonus room. This is a must-see property, do not miss out!''',
        'GarageSpaces': 2,
        'LotSize': 0.215,
        'Style': 'Rambler',
        'SubType': 'Single Family',
        'ParkingType': 'Garage-Attached, Off Street',
        'HOADues': 0,
        'Bedrooms': 3,
        'Bathrooms': 2.5
    }
    
    analyzer = NWMLSPropertyAnalyzer()
    result = analyzer.analyze_from_nwmls_fields(sample_listing)
    
    print("Analysis Results for Real NWMLS Sample:")
    print(f"Multi-Family: {result['is_multi_family']} (confidence: {result['confidence_scores']['multi_family']:.2f})")
    print(f"Detached: {result['is_detached']} (confidence: {result['confidence_scores']['detached']:.2f})")
    print(f"Large Garage: {result['has_large_garage']} (confidence: {result['confidence_scores']['large_garage']:.2f})")
    
    print("\nDetailed Analysis:")
    for category, reasons in result['detection_reasons'].items():
        if reasons:
            print(f"{category.replace('_', ' ').title()}: {', '.join(reasons)}")
    
    print("\nExpected Results:")
    print("- Multi-Family: False (single family rambler)")
    print("- Detached: True (residential property with lot)")
    print("- Large Garage: True (2 car garage)")

def test_convenience_function():
    """Test the convenience function"""
    print("🔧 Testing Convenience Function")
    print("=" * 50)
    
    sample_data = {
        'PropertyType': 'MULT',
        'ListPrice': 875000,
        'GarageSpaces': 3,
        'PublicRemarks': 'Excellent duplex investment property with large 3 car garage'
    }
    
    result = analyze_property_characteristics(sample_data)
    
    print("Convenience Function Results:")
    print(f"isMultiFamily: {result['isMultiFamily']}")
    print(f"isDetached: {result['isDetached']}")
    print(f"hasLargeGarage: {result['hasLargeGarage']}")
    print(f"Confidence Scores: {result['confidence']}")

def run_all_tests():
    """Run all test suites"""
    print("🧪 NWMLS Property Analyzer Test Suite")
    print("=" * 60)
    print()
    
    test_multi_family_detection()
    print()
    test_detached_detection()
    print()
    test_large_garage_detection()
    print()
    test_real_nwmls_sample()
    print()
    test_convenience_function()
    
    print("=" * 60)
    print("✅ All tests completed!")
    print()
    print("💡 Usage Tips:")
    print("1. Use analyze_property_characteristics() for simple boolean results")
    print("2. Use NWMLSPropertyAnalyzer() for detailed analysis with confidence scores")
    print("3. Check detection_reasons for debugging and transparency")
    print("4. Confidence scores help identify uncertain classifications")

if __name__ == "__main__":
    run_all_tests() 