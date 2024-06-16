import { UseQueryOptions, useQuery } from "react-query";
import useLocalstorage from "./useLocalstorage";

export function useApi<
  TQueryKey extends [string, Record<string, unknown>?],
  TQueryFnData,
  TError,
  TData = TQueryFnData
>(
  queryKey: TQueryKey,
  fetcher: (params: TQueryKey[1], token: string) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
) {
  const { getItem } = useLocalstorage();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const token = getItem() || "";
      return fetcher(queryKey[1], token);
    },
    ...options
  });
}