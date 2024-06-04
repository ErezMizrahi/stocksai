import React, { useState } from 'react'
import { Ticker } from '../types/Ticker'
import { RowGap } from './styled/Containers.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../hooks/useAuth'
import { queryKeys } from '../utils/queryKeys'
import stocksApi from '../api/stocks.api'
import { updateLikeStatus } from '../utils/filter-tickers-likes'
import { useNavigate } from 'react-router-dom'

interface TickerRowProps {
  ticker: Ticker;
}

const TickerRow = ({ticker} : TickerRowProps) => {
  const { symbol, name, liked } = ticker;
  const [isLiked, setIsLiked] = useState(liked);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ['idontknow'],
    mutationFn: (symbols: string[]) => {
        return stocksApi.likeStock(symbols);
    },
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: [queryKeys.whoami]});
      }
  });

  const updateStatus = (ticker: Ticker) => {
    const likedSymbols = updateLikeStatus(ticker, user.likedSymbols);
    setIsLiked( prev => !prev );
    mutation.mutate(likedSymbols);
  }

  return (
    <li key={symbol} > 
        <RowGap>
          <FontAwesomeIcon 
            icon={isLiked ? faHeartSolid : faHeart} 
            style={{color: '#a30000'}}
            onClick={() => updateStatus(ticker)} />
           | 
           <div onClick={() => navigate(`/stock`, { state: { stock: {symbol, name} }})}><b>{symbol}</b> | <span>{name}</span> </div>
        </RowGap>
    </li>
  )
}

export default TickerRow