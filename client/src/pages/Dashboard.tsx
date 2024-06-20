import { useState } from 'react';
import Search from '../components/Search'
import { useAuth } from '../hooks/useAuth'
import { Stock, Ticker } from '../types/Ticker';
import { DashboardContainer } from '../components/styled/Containers.styled';
import { Card } from '../components/styled/Card.styled';
import { useQuery } from 'react-query';
import stocksApi from '../api/stocks.api';
import { queryKeys } from '../utils/queryKeys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: [ queryKeys.myStocksData ],
    queryFn: ({signal}) => { return stocksApi.getLikedStockData(signal) },
    onError: (e: any) => {
      console.log('ere?')
      if(e.status === 401 || e.response.status === 401) {
        navigate('/login', { replace: true });
      }
    }
  });
  
  const HoverIcon = ({percentage}: {percentage: string}): JSX.Element => {
    const percent = parseFloat(percentage);

    if(percent > 0) { 
     return <FontAwesomeIcon icon={faArrowUp} style={{color: 'green'}} /> 
    }
    
    return <FontAwesomeIcon icon={faArrowDown} style={{color: 'red'}} />
  }

  console.log('data' , data)

  return (
    <div>
      <Search  />
      <DashboardContainer>
        { data?.map((stock: Stock) => {
          return (  
            <Card 
            key={`col-${stock.symbol}`}
            onClick={() => navigate(`/stock`, { state: { stock }}) }> 
              <h3>
                <HoverIcon percentage={stock.percent} />
                &nbsp; 
                { stock.symbol } 
              </h3> 
              <p> {stock.timestamp} </p> 
            </Card>
          )
      })}
      </DashboardContainer>
      
    </div>
  )
}

export default Dashboard