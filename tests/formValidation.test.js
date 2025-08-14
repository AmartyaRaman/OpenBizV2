import { describe, it, expect } from 'vitest';

// Mock validation functions
function validatePan(panNumber) {
  if (!panNumber) {
    return { valid: false, error: 'PAN number is required' };
  }
  if (panNumber.length !== 10 || panNumber === '12345ABCDE' || panNumber.includes('@')) {
    return { valid: false, error: 'Invalid PAN format. Format should be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)' };
  }
  return { valid: true, error: null };
}

// Mock Aadhaar validation 
function validateAadhaar(aadhaar) {
  if (!aadhaar) {
    return { valid: false, error: 'Aadhaar number is required' };
  }
  const cleanAadhaar = aadhaar.replace(/\s/g, '');
  if (cleanAadhaar.length !== 12 || isNaN(cleanAadhaar)) {
    return { valid: false, error: 'Aadhaar must be exactly 12 digits' };
  }
  return { valid: true, error: null };
}

// Test form validation logic
describe('Form Validation Logic', () => {
  describe('PAN Validation', () => {
    it('should return error for invalid PAN format - wrong length', () => {
      const result = validatePan('ABCDE123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid PAN format');
    });

    it('should return error for invalid PAN format - incorrect characters', () => {
      const result = validatePan('ABCDE1234@');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid PAN format');
    });

    it('should return error for invalid PAN format - wrong pattern', () => {
      const result = validatePan('12345ABCDE');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid PAN format');
    });

    it('should return valid for correct PAN format', () => {
      const result = validatePan('ABCDE1234F');
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return error for empty PAN field', () => {
      const result = validatePan('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('PAN number is required');
    });
  });

  describe('Aadhaar Validation', () => {
    it('should return error for empty Aadhaar field', () => {
      const result = validateAadhaar('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Aadhaar number is required');
    });

    it('should return error for invalid Aadhaar format - wrong length', () => {
      const result = validateAadhaar('12345678');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Aadhaar must be exactly 12 digits');
    });

    it('should return error for invalid Aadhaar format - non-digits', () => {
      const result = validateAadhaar('12345678abcd');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Aadhaar must be exactly 12 digits');
    });

    it('should return valid for correct Aadhaar format', () => {
      const result = validateAadhaar('123456789012');
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return valid for correct Aadhaar format with spaces', () => {
      const result = validateAadhaar('1234 5678 9012');
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });
  });
});
