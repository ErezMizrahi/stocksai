import { Injectable, Inject, Logger } from '@nestjs/common';

const HfInferenceApi = Function('return import("@huggingface/inference")')();
const { HfInference } = HfInferenceApi;

@Injectable()
export class HFService {
  private readonly logger = new Logger(HFService.name);

  constructor(@Inject('HF') private readonly hf: typeof HfInference) {}

  async generateResponse(prompt: string): Promise<any> {
    try {
      const response = this.hf.textGenerationStream({
        model: 'tiiuae/falcon-7b-instruct',
        inputs: `${prompt}`,
        parameters: {
            max_new_tokens: 512,
            // max_new_tokens: 100,
            return_full_text: false,
            temperature: 1.0,
        }
    });

      // return response.generated_text
      return response
    } catch (error) {
      this.logger.error('Error generating response', error);
      throw new Error('Failed to generate response from huggingface');
    }
  }
}
