import * as tf from '@tensorflow/tfjs-node';
import { Stock } from '../types/stock';

class TensorService {
    private getModel() {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [1], units: 50, activation: 'relu' }),
                tf.layers.dense({ units: 50, activation: 'relu' }),
                tf.layers.dense({ units: 1 }),
            ],
          });
          
        model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
        return model;
    }

    private normalize(num1: number, min: number, max: number) {
        return (num1 - min) / (max - min);
    }

    private getMinMax(numbers: number[]) {
        return [ Math.min(...numbers), Math.max(...numbers) ]
    }

    private getTrainingData(timestamps: number[], prices: number[]) {
        const [ minTimestamp, maxTimestamp ] = this.getMinMax(timestamps);
        const [ minPrice, maxPrice ] = this.getMinMax(prices);
        const xs = tf.tensor1d(timestamps.map(timestamp => this.normalize(timestamp, minTimestamp, maxTimestamp)));
        const ys = tf.tensor1d(prices.map(price => this.normalize(price, minPrice, maxPrice)));
        return {xs, ys};
    }

    private getPredictionData(timestamps: number[], prices: number[]) {
        const [ minTimestamp, maxTimestamp ] = this.getMinMax(timestamps);
        
        const futureDates = ['2024-04-11T04:00:00Z'].map(date => this.normalize(new Date(date).getTime(), minTimestamp, maxTimestamp));
        const futureTensor = tf.tensor1d(futureDates);
        return futureTensor;
    }

    async predict(stocks: Record<string, Stock[]>) {
        const model = this.getModel();

        for(let [_, value] of Object.entries(stocks)) {
            const timestamps = value.map((stock: Stock) => new Date(stock.timestamp).getTime());
            const prices = value.map((stock: Stock) => stock.close);

            const { xs, ys } = this.getTrainingData(timestamps, prices);
            await model.fit(xs, ys, { epochs: 200 });
        
            const futureTensor = this.getPredictionData(timestamps, prices);
        
            const predictions = Array.from((model.predict(futureTensor) as tf.Tensor).dataSync());

            const [ minPrice, maxPrice ] = this.getMinMax(prices);
            const denormalizedPredictions = predictions.map(prediction => prediction * (maxPrice - minPrice) + minPrice);
            return denormalizedPredictions;
        }
    }
}


const tensorService = new TensorService();
export default tensorService;