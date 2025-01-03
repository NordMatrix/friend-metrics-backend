import { validate } from 'class-validator';
import { CreateInteractionDto } from './create-interaction.dto';
import { InteractionTypes } from '../constants/interaction-types';

describe('CreateInteractionDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;
    dto.scoreChange = 1;
    dto.description = 'Test interaction';
    dto.metadata = { location: 'Test location' };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a DTO without optional fields', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;
    dto.scoreChange = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation without required type', async () => {
    const dto = new CreateInteractionDto();
    dto.scoreChange = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('should fail validation without required scoreChange', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('scoreChange');
  });

  it('should fail validation with invalid type', async () => {
    const dto = new CreateInteractionDto();
    dto.type = 'invalid' as any;
    dto.scoreChange = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('should fail validation with invalid scoreChange type', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;
    dto.scoreChange = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('scoreChange');
  });

  it('should fail validation with invalid description type', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;
    dto.scoreChange = 1;
    dto.description = 123 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation with invalid metadata type', async () => {
    const dto = new CreateInteractionDto();
    dto.type = InteractionTypes.MEETING;
    dto.scoreChange = 1;
    dto.metadata = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('metadata');
  });
}); 