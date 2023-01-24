import { govMyPollsQuery, MyPoll } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

export function useGovMyPollsQuery(): UseQueryResult<MyPoll[]> {
  const { terraWalletAddress } = useAccount();

  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_MYPOLLS,
      terraWalletAddress,
      contractAddress.anchorToken.gov,
    ],
    createQueryFn(govMyPollsQuery, queryClient),
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
      enabled: !!queryClient,
    },
  );

  return result;
}
