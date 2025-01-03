import { Interaction } from './interaction.entity';
import { Friend } from '../../friends/entities/friend.entity';

describe('Interaction Entity', () => {
  let interaction: Interaction;
  const mockFriend = { id: '1' } as Friend;

  beforeEach(() => {
    interaction = new Interaction();
    interaction.id = '1';
    interaction.type = 'meeting';
    interaction.scoreChange = 5;
    interaction.friend = mockFriend;
    interaction.metadata = {};
    interaction.createdAt = new Date();
  });

  it('should create an interaction instance', () => {
    expect(interaction).toBeDefined();
    expect(interaction.id).toBe('1');
    expect(interaction.type).toBe('meeting');
    expect(interaction.scoreChange).toBe(5);
    expect(interaction.friend).toBe(mockFriend);
    expect(interaction.metadata).toEqual({});
    expect(interaction.createdAt).toBeInstanceOf(Date);
  });

  it('should allow null metadata', () => {
    interaction.metadata = null;
    expect(interaction.metadata).toBeNull();
  });
});
