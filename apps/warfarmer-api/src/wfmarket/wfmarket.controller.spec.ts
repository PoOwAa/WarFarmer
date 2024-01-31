import { Test, TestingModule } from '@nestjs/testing';
import { WfmarketController } from './wfmarket.controller';
import { WfmarketService } from './wfmarket.service';

describe('WfmarketController', () => {
  let controller: WfmarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfmarketController],
      providers: [
        {
          provide: WfmarketService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WfmarketController>(WfmarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
