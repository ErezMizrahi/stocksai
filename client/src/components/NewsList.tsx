import React from 'react'
import { useQuery } from 'react-query';
import { queryKeys } from '../utils/queryKeys';
import stocksApi from '../api/stocks.api';
import { Link } from 'react-router-dom';

interface NewsListProps {
    symbol: string;
    days: number;
}

const NewsList = ({ symbol, days }: NewsListProps) => {
    const { data, isLoading } = useQuery({
        queryKey: [ queryKeys.news ],
        queryFn: ({signal}) => { return stocksApi.getNewsHistory(symbol, days, signal) }
      });
      

      if (isLoading) {
        return <>'loading'</>;
      }

  return (
    <ul>
        {data?.map(article => (
           <li key={article.ID}> <Link to={article.URL} target='_blank'> { article.Headline } </Link> </li>
        ))}
    </ul>
  )
}

export default NewsList