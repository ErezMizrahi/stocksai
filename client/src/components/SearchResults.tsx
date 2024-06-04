import React from 'react'
import { Ticker } from '../types/Ticker'
import { SearchResultsContainer } from './styled/Input.styled'
import TickerRow from './TickerRow'

interface SearchResultsProps {
    tickers: Ticker[] | undefined;
}

const SearchResults = ({ tickers }: SearchResultsProps) => {
 
  return (
    <SearchResultsContainer onFocus={() => console.log('focus...')}>
    { 
        tickers?.map((ticker: Ticker) => (
            <TickerRow key={ticker.symbol} ticker={ticker} />
        ))
    }
  </SearchResultsContainer>

)
}


export default SearchResults