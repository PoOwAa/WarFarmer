import { Test, TestingModule } from '@nestjs/testing';
import { ArcaneController } from './arcane.controller';
import { ArcaneService } from './arcane.service';
import { ArcaneCleanupService } from './arcane-cleanup.service';

describe('ArcaneController', () => {
  let controller: ArcaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArcaneController],
      providers: [
        {
          provide: ArcaneService,
          useValue: {},
        },
        {
          provide: ArcaneCleanupService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ArcaneController>(ArcaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
