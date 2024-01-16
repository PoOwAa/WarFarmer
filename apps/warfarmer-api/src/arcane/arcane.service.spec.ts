import { Test, TestingModule } from '@nestjs/testing';
import { ArcaneService } from './arcane.service';

describe('ArcaneService', () => {
  let service: ArcaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArcaneService],
    }).compile();

    service = module.get<ArcaneService>(ArcaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
