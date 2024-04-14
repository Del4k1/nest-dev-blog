import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategyAuthGuard } from './local-auth.guard';
describe('LocalStrategyAuthGuard', () => {
  let guard: LocalStrategyAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategyAuthGuard],
    }).compile();

    guard = module.get<LocalStrategyAuthGuard>(LocalStrategyAuthGuard);
  });

  it('должен быть определен', () => {
    expect(guard).toBeDefined();
  });
});
