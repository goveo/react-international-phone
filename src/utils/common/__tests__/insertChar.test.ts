import { insertChar } from '../insertChar';

describe('insertChar', () => {
  test('should insert char in value string', () => {
    expect(insertChar({ value: 'test', char: '1', position: 0 })).toBe('1test');
    expect(insertChar({ value: 'test', char: ' ', position: 4 })).toBe('test ');
    expect(insertChar({ value: '+12345678', char: ' ', position: 2 })).toBe(
      '+1 2345678',
    );
  });

  test('should handle out of bounds position', () => {
    expect(insertChar({ value: 'test', char: '1', position: -1 })).toBe('test');
    expect(insertChar({ value: 'test', char: '1', position: 10 })).toBe('test');
  });
});
