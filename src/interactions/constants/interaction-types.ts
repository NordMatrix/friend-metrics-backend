export const InteractionTypes = {
  MEETING: 'meeting',
  CALL: 'call',
  MESSAGE: 'message',
  ACTIVITY: 'activity',
  GIFT: 'gift',
  HELP: 'help',
  CONFLICT: 'conflict',
  CELEBRATION: 'celebration',
  OTHER: 'other',
} as const;

export type InteractionType = typeof InteractionTypes[keyof typeof InteractionTypes]; 