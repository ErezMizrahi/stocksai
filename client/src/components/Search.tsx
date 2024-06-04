import { useEffect, useRef, useState } from 'react';
import { Input, InputContainer } from './styled/Input.styled';
import { useQuery, useQueryClient } from 'react-query';
import { useDebounce } from '../hooks/useDebounce';
import stocksApi from '../api/stocks.api';
import SearchResults from './SearchResults';
import { queryKeys } from '../utils/queryKeys';
import { useAuth } from '../hooks/useAuth';
import { mapLikedStocks } from '../utils/mapLikedStocks';
import ChipsContainer from './ChipsContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const Search = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false);
    const searchAreaRef = useRef<HTMLDivElement>(null);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();
    const { user } = useAuth();
    
    const { data, isLoading } = useQuery({
      queryKey: [queryKeys.stocks, debouncedSearchTerm],
      queryFn: async ({signal}) => stocksApi.searchStocks(debouncedSearchTerm, user.likedSymbols, signal),
      enabled: Boolean(debouncedSearchTerm),
      onSuccess: (data) => {
        if(data.length > 0) {
          setIsResultDisplayed(true);
        }
      }
    });


    const handleChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      setSearchTerm(event.target.value)
    }

    useEffect(() => {
      queryClient.setQueryData([queryKeys.stocks], () => {
        if(data) {
          return mapLikedStocks(data, user.likedSymbols);
        }
      });
    }, [user.likedSymbols])

    useEffect(() => {
      document.addEventListener('click', handleOutSideClick, true);
      return () => document.removeEventListener('click', handleOutSideClick, true);

    }, [])

    const handleOutSideClick = (e: MouseEvent) => {
      if(!searchAreaRef.current?.contains(e.target as Node)) {
        setIsResultDisplayed(false);
      } 
    }


  return (
    <div >
      <div style={{width: '50%'}} ref={searchAreaRef}>
        <InputContainer>
            <Input 
              type='text'
              placeholder='search by symbol or name' 
              onChange={handleChange}
              style={{ width: '-webkit-fill-available'}} />

            {isLoading && 
            <FontAwesomeIcon 
              className="fa-spin" 
              icon={faSpinner} 
              style={{position: 'absolute', right: 10}} />
            }
            
        </InputContainer>
          
            
             {(!isLoading && isResultDisplayed) ?
            data && data.length > 0 && 
              <SearchResults tickers={data} />
            : null
            }

            <ChipsContainer/>
           
      </div>
    </div>
  )
}

export default Search