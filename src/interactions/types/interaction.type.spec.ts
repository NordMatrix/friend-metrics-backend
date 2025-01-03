import { InteractionType } from './interaction.type';

describe('InteractionType', () => {
  it('should have correct values', () => {
    expect(InteractionType.POSITIVE).toBe('positive');
    expect(InteractionType.NEGATIVE).toBe('negative');
    expect(InteractionType.NEUTRAL).toBe('neutral');
  });

  it('should have all required interaction types', () => {
    const types = Object.values(InteractionType);
    expect(types).toHaveLength(3);
    expect(types).toContain('positive');
    expect(types).toContain('negative');
    expect(types).toContain('neutral');
  });

  it('should have correct keys', () => {
    const keys = Object.keys(InteractionType);
    expect(keys).toHaveLength(3);
    expect(keys).toContain('POSITIVE');
    expect(keys).toContain('NEGATIVE');
    expect(keys).toContain('NEUTRAL');
  });

  it('should have correct key-value mapping', () => {
    expect(Object.entries(InteractionType)).toEqual([
      ['POSITIVE', 'positive'],
      ['NEGATIVE', 'negative'],
      ['NEUTRAL', 'neutral'],
    ]);
  });
}); 