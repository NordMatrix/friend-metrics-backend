import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = controller.getHello();
      expect(result).toBe('Hello World!');
    });

    it('should call appService.getHello', () => {
      jest.spyOn(service, 'getHello');
      controller.getHello();
      expect(service.getHello).toHaveBeenCalled();
    });

    it('should return custom message from service', () => {
      const customMessage = 'Custom Hello!';
      jest.spyOn(service, 'getHello').mockReturnValue(customMessage);

      const result = controller.getHello();

      expect(result).toBe(customMessage);
      expect(service.getHello).toHaveBeenCalled();
    });
  });
});
