import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { ChipsUL } from './styled/Chips.styled';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { queryKeys } from '../utils/queryKeys';
import stocksApi from '../api/stocks.api';
import { Ticker } from '../types/Ticker';
import { updateLikeStatus } from '../utils/filter-tickers-likes';

const ChipsContainer = () => {
    const { user } = useAuth();

    

  return (
    <ChipsUL>
        {user.likedSymbols?.map((symbol: string) => (
          <Chip key={symbol} symbol={symbol}/>
        ))}
    </ChipsUL>

  )
}

const Chip = ({ symbol }: {symbol : string}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['idontknow'],
    mutationFn: (symbols: string[]) => {
        return stocksApi.likeStock(symbols);
    },
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: [queryKeys.whoami]});
      }
  });


  const updateStatus = (symbol : string) => {
    const likedSymbols = updateLikeStatus({ symbol , name: '', liked: true }, user.likedSymbols);
    console.log('likedSymbols', likedSymbols);
    mutation.mutate(likedSymbols);
  }
  
  return (
    <li>
      <span 
        onMouseEnter={() => setIsHover(true)} 
        onMouseLeave={() => setIsHover(false)} 
        onClick={() => updateStatus(symbol)}> 
        { symbol }
        { isHover && <FontAwesomeIcon icon={faHeartBroken} />}
       </span>
    </li>
  )
}

export default ChipsContainer