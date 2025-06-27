import { Web3 } from 'web3';

import PostageStampContract from './abis/PostageStampContract.json';
import { Batch } from './batch';

const web3 = new Web3('https://rpc.gnosischain.com/');
const postageStampAbi = PostageStampContract.abi;
const postageStampContractAddress = '0x45a1502382541Cd610CC9068e88727426b696293';
const contract = new web3.eth.Contract(postageStampAbi, postageStampContractAddress);

export async function getCurrentTotalOutPayment(): Promise<bigint> {
  return BigInt(await contract.methods.currentTotalOutPayment().call());
}
export async function getLastPrice(): Promise<bigint> {
  return BigInt(await contract.methods.lastPrice().call());
}
export async function getBatchDataFromContract(batchId: string): Promise<Batch | undefined> {
  try {
    const rawBatchData = (await contract.methods.batches(batchId).call()) as Batch;
    if (rawBatchData && typeof rawBatchData === 'object' && 'owner' in rawBatchData) {
      return {
        owner: String(rawBatchData.owner),
        depth: BigInt(rawBatchData.depth),
        bucketDepth: BigInt(rawBatchData.bucketDepth),
        immutableFlag: Boolean(rawBatchData.immutableFlag),
        normalisedBalance: BigInt(rawBatchData.normalisedBalance),
        lastUpdatedBlockNumber: BigInt(rawBatchData.lastUpdatedBlockNumber),
      };
    }
    console.warn(`Warning: Batch data for ${batchId} is in unexpected format or missing owner.`);
  } catch (error) {
    console.error(`Error fetching batch data for ${batchId}:`, error);
  }
  return undefined;
}