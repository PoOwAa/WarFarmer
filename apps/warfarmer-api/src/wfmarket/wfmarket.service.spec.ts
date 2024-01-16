import { Test, TestingModule } from '@nestjs/testing';
import { WfmarketService } from './wfmarket.service';

describe('WfmarketService', () => {
  let service: WfmarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfmarketService],
    }).compile();

    service = module.get<WfmarketService>(WfmarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
