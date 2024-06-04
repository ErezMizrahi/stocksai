import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const getHF = async (configService: ConfigService) => {
  const hf = await import('@huggingface/inference');
  return new hf.HfInference(configService.get<string>('HF_TOKEN'))
}
export const HFProvider: Provider = {
  provide: 'HF',
  useFactory: (configService: ConfigService) => {
    return getHF(configService);
  },
  inject: [ConfigService],
};
