import React from 'react'
import { RowGrid } from './styled/Containers.styled'
import { Card } from './styled/Card.styled'
import { Stock, StockPageData } from '../types/Ticker';

interface InformationListProps {
    stock: Stock;
    data: StockPageData | undefined
}

const InformationList = ({ stock, data} : InformationListProps) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
    {
        data?.corporateData.cash_dividends &&
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            Dividends:

                {
                <RowGrid>
                    {
                    data?.corporateData.cash_dividends?.map((d: any) => (
                        <Card style={{cursor: 'default'}}>
                        <p>{new Intl.DateTimeFormat('he').format(new Date(d.date))} - {d.rate}$</p>
                        </Card>
                    ))
                    }
                </RowGrid>
                
                }
            </div>
    }
    

    { 
            data?.corporateData.forward_splits &&
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                Splits: <br />

                {
                <RowGrid>
                    {
                    data?.corporateData.forward_splits?.map((d: any) => (
                        <Card style={{cursor: 'default'}}>
                        <p>{new Intl.DateTimeFormat('he').format(new Date(d.date))} - {d.rate}</p>
                        </Card>
                    ))
                    }
                </RowGrid>
                
                }
            </div>
        }
    
        {
            data?.corporateData.cash_mergers && 
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                Merger: <br />
                {
                <RowGrid>
                    {
                    data?.corporateData.cash_mergers?.map((d: any) => (
                        <Card style={{cursor: 'default'}}>
                        <p> {stock.symbol} accuired { d.accuired } in {new Intl.DateTimeFormat('he').format(new Date(d.date))} at rate of {d.rate}</p>
                        </Card>
                    ))
                    }
                </RowGrid>
                
                }
            </div>
        }
    
    </div>
  )
}

export default InformationList