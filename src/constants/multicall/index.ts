import { ChainId } from '@baguette-exchange/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.FUJI]: '0xb465Fd2d9C71d5D6e6c069aaC9b4E21c69aAA78f',
  [ChainId.AVALANCHE]: '0xa108c329bFC39D72e66310f8f33113350E30e3A4',
  [ChainId.CRYPTOSEALS]: '0xDfb690cF42cD1e9af757AEbA482F5171F8643E92',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
