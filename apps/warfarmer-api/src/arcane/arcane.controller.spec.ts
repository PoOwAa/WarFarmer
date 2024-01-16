import { Test, TestingModule } from '@nestjs/testing';
import { ArcaneController } from './arcane.controller';

describe('ArcaneController', () => {
  let controller: ArcaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArcaneController],
    }).compile();

    controller = module.get<ArcaneController>(ArcaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
