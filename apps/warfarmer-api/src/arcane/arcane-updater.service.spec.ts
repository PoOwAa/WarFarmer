import { Test, TestingModule } from '@nestjs/testing';
import { ArcaneUpdaterService } from './arcane-updater.service';
import { ArcaneService } from './arcane.service';
import { WfmarketService } from '../wfmarket/wfmarket.service';
import { DbService } from '../db/db.service';

describe('ArcaneUpdaterService', () => {
  let service: ArcaneUpdaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArcaneUpdaterService,
        {
          provide: ArcaneService,
          useValue: {},
        },
        {
          provide: WfmarketService,
          useValue: {},
        },
        {
          provide: DbService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ArcaneUpdaterService>(ArcaneUpdaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
