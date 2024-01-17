import { Test, TestingModule } from '@nestjs/testing';
import { ArcaneUpdaterService } from './arcane-updater.service';

describe('ArcaneUpdaterService', () => {
  let service: ArcaneUpdaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArcaneUpdaterService],
    }).compile();

    service = module.get<ArcaneUpdaterService>(ArcaneUpdaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
