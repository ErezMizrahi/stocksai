import dotenv from 'dotenv'
import { connect } from './app';
dotenv.config();

if(!process.env.ALPACA_KEY) throw new Error('ALPACA_KEY must be defiend!');
if(!process.env.ALPACA_SECRET) throw new Error('ALPACA_SECRET must be defiend!');

connect();