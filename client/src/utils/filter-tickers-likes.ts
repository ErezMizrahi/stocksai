import { Ticker } from "../types/Ticker";

export const updateLikeStatus = (ticker: Ticker, userLikedSymbols: string[]) => {
    const { symbol, liked } = ticker;
    let likedSymbols: string[] = userLikedSymbols ?? [];
    if(liked) {
      likedSymbols = likedSymbols.filter(s => s.toUpperCase().trim() !== symbol.toUpperCase().trim());
    } else {
      likedSymbols.push(symbol.toUpperCase());
    }
    return likedSymbols;
  }
