import { Test, TestingModule } from '@nestjs/testing';
import { WfmarketController } from './wfmarket.controller';

describe('WfmarketController', () => {
  let controller: WfmarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfmarketController],
    }).compile();

    controller = module.get<WfmarketController>(WfmarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
