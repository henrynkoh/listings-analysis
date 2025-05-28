"""
NWMLS Data Parser - Intelligent Property Characteristic Detection
Automatically detects Multi-Family, Detached, and Large Garage properties
from NWMLS listing data and property descriptions.
"""

import re
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class PropertyCharacteristics:
    """Data class for property characteristics"""
    is_multi_family: bool
    is_detached: bool
    has_large_garage: bool
    confidence_scores: Dict[str, float]
    detection_reasons: Dict[str, List[str]]

class NWMLSPropertyAnalyzer:
    """Intelligent analyzer for NWMLS property characteristics"""
    
    def __init__(self):
        # Multi-family keywords and patterns
        self.multi_family_keywords = [
            'duplex', 'triplex', 'fourplex', 'quadplex', 'multi-family', 'multifamily',
            'multi family', 'apartment', 'units', 'rental income', 'separate entrance',
            'mother-in-law', 'mil suite', 'adu', 'accessory dwelling unit',
            'income property', 'investment property', 'two family', 'three family'
        ]
        
        # Multi-family property types from NWMLS
        self.multi_family_types = [
            'MULT', 'DUPLEX', 'TRIPLEX', 'FOURPLEX', 'APARTMENT'
        ]
        
        # Detached keywords and patterns
        self.detached_keywords = [
            'single family', 'detached', 'standalone', 'separate', 'private',
            'own lot', 'individual', 'freestanding'
        ]
        
        # Non-detached indicators
        self.attached_indicators = [
            'condo', 'condominium', 'townhouse', 'townhome', 'attached',
            'shared wall', 'common wall', 'row house', 'patio home'
        ]
        
        # Large garage keywords and patterns
        self.large_garage_keywords = [
            'two car', '2 car', 'three car', '3 car', 'four car', '4 car',
            'double garage', 'triple garage', 'oversized garage', 'large garage',
            'spacious garage', 'workshop', 'rv parking', 'boat parking',
            'extra parking', 'multiple vehicles'
        ]
        
        # Garage size patterns (regex)
        self.garage_size_patterns = [
            r'(\d+)\s*car\s*garage',
            r'garage\s*(\d+)',
            r'(\d+)\s*vehicle',
            r'(\d+)\s*bay\s*garage'
        ]
    
    def analyze_property(self, listing_data: Dict) -> PropertyCharacteristics:
        """
        Main function to analyze property characteristics
        
        Args:
            listing_data: Dictionary containing NWMLS listing information
            
        Returns:
            PropertyCharacteristics object with detection results
        """
        # Initialize results
        is_multi_family = False
        is_detached = False
        has_large_garage = False
        confidence_scores = {'multi_family': 0.0, 'detached': 0.0, 'large_garage': 0.0}
        detection_reasons = {'multi_family': [], 'detached': [], 'large_garage': []}
        
        # Analyze multi-family characteristics
        multi_family_result = self._detect_multi_family(listing_data)
        is_multi_family = multi_family_result[0]
        confidence_scores['multi_family'] = multi_family_result[1]
        detection_reasons['multi_family'] = multi_family_result[2]
        
        # Analyze detached characteristics
        detached_result = self._detect_detached(listing_data)
        is_detached = detached_result[0]
        confidence_scores['detached'] = detached_result[1]
        detection_reasons['detached'] = detached_result[2]
        
        # Analyze garage characteristics
        garage_result = self._detect_large_garage(listing_data)
        has_large_garage = garage_result[0]
        confidence_scores['large_garage'] = garage_result[1]
        detection_reasons['large_garage'] = garage_result[2]
        
        return PropertyCharacteristics(
            is_multi_family=is_multi_family,
            is_detached=is_detached,
            has_large_garage=has_large_garage,
            confidence_scores=confidence_scores,
            detection_reasons=detection_reasons
        )
    
    def _detect_multi_family(self, listing_data: Dict) -> Tuple[bool, float, List[str]]:
        """Detect if property is multi-family"""
        confidence = 0.0
        reasons = []
        
        # Check property type field
        property_type = listing_data.get('property_type', '').upper()
        if property_type in self.multi_family_types:
            confidence += 0.8
            reasons.append(f"Property type: {property_type}")
        
        # Check sub-type field
        sub_type = listing_data.get('sub_type', '').lower()
        for keyword in self.multi_family_keywords:
            if keyword in sub_type:
                confidence += 0.6
                reasons.append(f"Sub-type contains: {keyword}")
                break
        
        # Check property description/remarks
        remarks = listing_data.get('remarks', '').lower()
        marketing_remarks = listing_data.get('marketing_remarks', '').lower()
        combined_text = f"{remarks} {marketing_remarks}"
        
        for keyword in self.multi_family_keywords:
            if keyword in combined_text:
                confidence += 0.3
                reasons.append(f"Description contains: {keyword}")
        
        # Check number of units field
        units = listing_data.get('number_of_units', 0)
        if units and units > 1:
            confidence += 0.7
            reasons.append(f"Number of units: {units}")
        
        # Check for multiple kitchens (indicator of multi-family)
        if 'kitchen' in combined_text:
            kitchen_count = combined_text.count('kitchen')
            if kitchen_count > 1:
                confidence += 0.4
                reasons.append(f"Multiple kitchens mentioned: {kitchen_count}")
        
        # Check for rental income mentions
        if any(term in combined_text for term in ['rental income', 'rent', 'tenant']):
            confidence += 0.3
            reasons.append("Rental income mentioned")
        
        # Cap confidence at 1.0
        confidence = min(confidence, 1.0)
        
        return confidence >= 0.5, confidence, reasons
    
    def _detect_detached(self, listing_data: Dict) -> Tuple[bool, float, List[str]]:
        """Detect if property is detached"""
        confidence = 0.0
        reasons = []
        
        # Check property type
        property_type = listing_data.get('property_type', '').upper()
        if property_type == 'RESI':  # Residential typically means detached
            confidence += 0.6
            reasons.append("Property type: Residential")
        elif property_type in ['COND', 'CONDO']:
            confidence = 0.0  # Condos are not detached
            reasons.append("Property type: Condo (not detached)")
            return False, confidence, reasons
        
        # Check style field
        style = listing_data.get('style', '').lower()
        if any(indicator in style for indicator in self.attached_indicators):
            confidence = 0.0
            reasons.append(f"Style indicates attached: {style}")
            return False, confidence, reasons
        
        # Check for detached keywords in description
        remarks = listing_data.get('remarks', '').lower()
        marketing_remarks = listing_data.get('marketing_remarks', '').lower()
        combined_text = f"{remarks} {marketing_remarks}"
        
        for keyword in self.detached_keywords:
            if keyword in combined_text:
                confidence += 0.4
                reasons.append(f"Description contains: {keyword}")
        
        # Check for attached indicators in description
        for indicator in self.attached_indicators:
            if indicator in combined_text:
                confidence -= 0.5
                reasons.append(f"Description contains attached indicator: {indicator}")
        
        # Check lot size (detached homes typically have larger lots)
        lot_size = listing_data.get('lot_size', 0)
        if lot_size and lot_size > 0.15:  # > 0.15 acres suggests detached
            confidence += 0.3
            reasons.append(f"Large lot size: {lot_size} acres")
        
        # Check for HOA (condos/townhomes typically have HOA)
        hoa_dues = listing_data.get('hoa_dues', 0)
        if hoa_dues and hoa_dues > 0:
            confidence -= 0.2
            reasons.append(f"HOA dues present: ${hoa_dues}")
        
        # Default assumption for residential properties
        if property_type == 'RESI' and confidence < 0.3:
            confidence = 0.7  # Most residential properties are detached
            reasons.append("Default assumption for residential property")
        
        confidence = max(0.0, min(confidence, 1.0))
        
        return confidence >= 0.5, confidence, reasons
    
    def _detect_large_garage(self, listing_data: Dict) -> Tuple[bool, float, List[str]]:
        """Detect if property has large garage (2+ cars)"""
        confidence = 0.0
        reasons = []
        
        # Check garage spaces field
        garage_spaces = listing_data.get('garage_spaces', 0)
        if garage_spaces and garage_spaces >= 2:
            confidence += 0.8
            reasons.append(f"Garage spaces: {garage_spaces}")
        elif garage_spaces == 1:
            confidence = 0.1  # Single car garage is not "large"
            reasons.append("Single car garage")
        
        # Check parking type field
        parking_type = listing_data.get('parking_type', '').lower()
        if 'garage' in parking_type:
            # Look for size indicators in parking description
            for keyword in self.large_garage_keywords:
                if keyword in parking_type:
                    confidence += 0.6
                    reasons.append(f"Parking type contains: {keyword}")
                    break
        
        # Check property description for garage mentions
        remarks = listing_data.get('remarks', '').lower()
        marketing_remarks = listing_data.get('marketing_remarks', '').lower()
        combined_text = f"{remarks} {marketing_remarks}"
        
        # Look for garage size patterns using regex
        for pattern in self.garage_size_patterns:
            matches = re.findall(pattern, combined_text, re.IGNORECASE)
            for match in matches:
                try:
                    car_count = int(match)
                    if car_count >= 2:
                        confidence += 0.7
                        reasons.append(f"Description mentions {car_count} car garage")
                except ValueError:
                    continue
        
        # Look for large garage keywords
        for keyword in self.large_garage_keywords:
            if keyword in combined_text:
                confidence += 0.4
                reasons.append(f"Description contains: {keyword}")
        
        # Check property price (higher-end properties more likely to have large garages)
        price = listing_data.get('list_price', 0)
        if price and price > 800000:  # Properties over $800k more likely to have large garages
            confidence += 0.2
            reasons.append("High-value property (likely large garage)")
        
        # Check square footage (larger homes more likely to have large garages)
        sqft = listing_data.get('square_feet', 0)
        if sqft and sqft > 2500:
            confidence += 0.2
            reasons.append("Large home (likely large garage)")
        
        confidence = min(confidence, 1.0)
        
        return confidence >= 0.5, confidence, reasons
    
    def analyze_from_nwmls_fields(self, nwmls_data: Dict) -> Dict:
        """
        Analyze property using standard NWMLS field names
        
        Args:
            nwmls_data: Raw NWMLS data with standard field names
            
        Returns:
            Dictionary with analysis results
        """
        # Map NWMLS fields to our standard format
        standardized_data = self._standardize_nwmls_fields(nwmls_data)
        
        # Perform analysis
        characteristics = self.analyze_property(standardized_data)
        
        return {
            'is_multi_family': characteristics.is_multi_family,
            'is_detached': characteristics.is_detached,
            'has_large_garage': characteristics.has_large_garage,
            'confidence_scores': characteristics.confidence_scores,
            'detection_reasons': characteristics.detection_reasons
        }
    
    def _standardize_nwmls_fields(self, nwmls_data: Dict) -> Dict:
        """Convert NWMLS field names to standardized format"""
        field_mapping = {
            # Property type mappings
            'PropertyType': 'property_type',
            'PropertySubType': 'sub_type',
            'Style': 'style',
            
            # Description fields
            'PublicRemarks': 'remarks',
            'MarketingRemarks': 'marketing_remarks',
            'PrivateRemarks': 'private_remarks',
            
            # Garage/Parking fields
            'GarageSpaces': 'garage_spaces',
            'ParkingType': 'parking_type',
            'ParkingSpaces': 'parking_spaces',
            
            # Property details
            'ListPrice': 'list_price',
            'LotSize': 'lot_size',
            'SquareFeet': 'square_feet',
            'NumberOfUnits': 'number_of_units',
            'HOADues': 'hoa_dues',
            
            # Alternative field names
            'Type': 'property_type',
            'SubType': 'sub_type',
            'Remarks': 'remarks',
            'Price': 'list_price',
            'SqFt': 'square_feet',
            'Garage': 'garage_spaces'
        }
        
        standardized = {}
        for nwmls_field, standard_field in field_mapping.items():
            if nwmls_field in nwmls_data:
                standardized[standard_field] = nwmls_data[nwmls_field]
        
        # Also copy any fields that are already in standard format
        for key, value in nwmls_data.items():
            if key.lower() in ['property_type', 'sub_type', 'style', 'remarks', 
                              'marketing_remarks', 'garage_spaces', 'parking_type',
                              'list_price', 'lot_size', 'square_feet', 'number_of_units', 'hoa_dues']:
                standardized[key.lower()] = value
        
        return standardized

def analyze_property_characteristics(listing_data: Dict) -> Dict:
    """
    Convenience function to analyze property characteristics
    
    Args:
        listing_data: NWMLS listing data
        
    Returns:
        Dictionary with boolean results for each characteristic
    """
    analyzer = NWMLSPropertyAnalyzer()
    result = analyzer.analyze_from_nwmls_fields(listing_data)
    
    return {
        'isMultiFamily': result['is_multi_family'],
        'isDetached': result['is_detached'],
        'hasLargeGarage': result['has_large_garage'],
        'confidence': result['confidence_scores'],
        'reasons': result['detection_reasons']
    }

# Example usage and testing
if __name__ == "__main__":
    # Test with sample NWMLS data
    sample_listing = {
        'PropertyType': 'RESI',
        'ListPrice': 875000,
        'SquareFeet': 1850,
        'GarageSpaces': 2,
        'PublicRemarks': 'Beautiful single family home with detached 2 car garage and spacious yard.',
        'LotSize': 0.25,
        'Style': 'Traditional'
    }
    
    analyzer = NWMLSPropertyAnalyzer()
    result = analyzer.analyze_from_nwmls_fields(sample_listing)
    
    print("Analysis Results:")
    print(f"Multi-Family: {result['is_multi_family']} (confidence: {result['confidence_scores']['multi_family']:.2f})")
    print(f"Detached: {result['is_detached']} (confidence: {result['confidence_scores']['detached']:.2f})")
    print(f"Large Garage: {result['has_large_garage']} (confidence: {result['confidence_scores']['large_garage']:.2f})")
    
    print("\nDetection Reasons:")
    for category, reasons in result['detection_reasons'].items():
        if reasons:
            print(f"{category}: {', '.join(reasons)}") 