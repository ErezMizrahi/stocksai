import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { Stock as StockType } from '../types/Ticker';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Brush, BarChart, Bar } from 'recharts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import stocksApi from '../api/stocks.api';
import { queryKeys } from '../utils/queryKeys';
import NewsList from '../components/NewsList';
import { ChipsUL } from '../components/styled/Chips.styled';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/styled/Card.styled';
import { Grid, RowGrid } from '../components/styled/Containers.styled';
import InformationList from '../components/InformationList';

const possibleDays = [{name: '1D', numberOfDays: 1}, {name: '5D', numberOfDays: 5},{name: '1M', numberOfDays: 30},{name: '6M', numberOfDays: 180}, {name: '1Y', numberOfDays: 365}, {name: '5Y', numberOfDays: 1825},];

const Stock = () => {
    const { state } = useLocation();
    const stock: StockType  = state.stock;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const auth = useAuth();

    const [days, setDays] = useState(possibleDays[4].numberOfDays);
    const [askAiData, setAskAiData] = useState('');
    const [loading, setLoading] = useState(false);
   
    

    useEffect(() => {
      const getData = async () => {
        setLoading(true);
        const response = await fetch(endpoints.askAi.uri, { method: endpoints.askAi.method , headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token?.replace(/\"/g, "")}`
        },
        body: JSON.stringify({ symbol: stock.symbol })
      });

        const reader = response.body?.getReader();

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if(done) {
              console.log('end....');
              setLoading(false);
              return;
            }

            const decoder = new TextDecoder();
            setAskAiData(prev => `${prev}${decoder.decode(value)}`);
            read();
          })
        }

        read();
      }

      getData();
    }, [])
 
    const { data } = useQuery({
        queryKey: [ queryKeys.spesific, days ],
        queryFn: ({signal}) => {
            return stocksApi.getStockHistory(stock.symbol, days, signal)
         },
        keepPreviousData: true,
        onError: (e: any) => {
            if(e.status === 401 || e.response.status === 401) {
              navigate('/login', { replace: true });
            }
          }
      });


      console.log(data)
      

      const mutation = useMutation({
        mutationKey: [ queryKeys.spesific, days ],
        mutationFn: (days: number) => {
            return stocksApi.getStockHistory(stock.symbol, days)
        },
        onSuccess: (newData, variables) => {
            setDays(variables);
            queryClient.setQueryData([queryKeys.spesific, variables], newData);
        },
        onError: (e: any) => {
            if(e.status === 401 || e.response.status === 401) {
              navigate('/login', { replace: true });
            }
          }
      });

  return (
    <div>
        <h2>{stock.symbol}</h2>

        <div>
            <h3> what does stockAI thinks?</h3>
            {askAiData}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', gap: '10px'}}>
            {/* <h3>{stock.close}</h3>  change to websocket get the latest value */}
            <h3>{stock.close}</h3> 
            <ChipsUL>
                { possibleDays.map(({name, numberOfDays}, index) => (
                    <li 
                        key={`day-${name}-index-${index}`}>
                        <span
                        onClick={ () => mutation.mutate(numberOfDays) }
                        style={numberOfDays === days ? {background: '#a30000', color: 'white'} : {}}
                        >{name}</span>
                    </li>
                ))}

                
            </ChipsUL>
          
        </div>
    <div>
        
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                
                data={data?.stockData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis dataKey="close"  />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#a30000" dot={(e) => {
                    return <div key={e.key}></div>
                }}/>
                {/* <Line type="monotone" dataKey="close" stroke="#82ca9d" /> */}
                </LineChart>
                </ResponsiveContainer>
            </div>
            
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                width={500}
                height={300}
                data={data?.stockData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <ReferenceLine y={0} stroke="#000" />
                <Brush dataKey="timestamp" height={30} stroke="#a30000" />
                <Bar dataKey="open" fill="#82ca9d" />
                <Bar dataKey="close" fill="#a30000" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
       
       <InformationList stock={stock} data={data} />
  

        <NewsList symbol={stock.symbol} days={365} />
    </div>
    
  )
}

export default Stock