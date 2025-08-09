import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('bg-red-500', 'text-white');
      expect(result).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toBe('base-class conditional-class');
    });

    it('should override conflicting Tailwind classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'final-class');
      expect(result).toBe('base-class final-class');
    });

    it('should handle empty strings', () => {
      const result = cn('', 'class-name', '');
      expect(result).toBe('class-name');
    });
  });
});
