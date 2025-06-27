import { Size } from '@ethersphere/bee-js';
import * as fs from 'fs';

import { getBatchDataFromContract } from './contract';

const MAX_UTILIZATION = 0.9; // General cap on theoretical size for effective size

const GNOSIS_BLOCK_TIME_SECONDS = 5;

/**
 * Based on https://docs.ethswarm.org/docs/learn/technology/contracts/postage-stamp/#effective-utilisation-table
 * Optimised for encrypted, medium erasure coding
 */
const effectiveSizeBreakpoints = [
  [17, 0.00004089],
  [18, 0.00609],
  [19, 0.10249],
  [20, 0.62891],
  [21, 2.38],
  [22, 7.07],
  [23, 18.24],
  [24, 43.04],
  [25, 96.5],
  [26, 208.52],
  [27, 435.98],
  [28, 908.81],
  [29, 1870],
  [30, 3810],
  [31, 7730],
  [32, 15610],
  [33, 31430],
  [34, 63150],
];

export type Port = {
  port: number;
  hash: string;
};

export type Batch = {
  owner: string;
  depth: bigint;
  bucketDepth: bigint;
  immutableFlag: boolean;
  normalisedBalance: bigint;
  lastUpdatedBlockNumber: bigint;
};

export interface StampFinancialStatus {
  isFinanciallyActive: boolean;
  expirationDateString: string;
}

/**
 * Utility function that calculates the theoritical maximum size of a postage batch based on its depth.
 *
 * For smaller depths (up to 22), this may provide less accurate results.
 *
 * @returns {number} The maximum theoretical size of the postage batch in bytes.
 */
function getStampTheoreticalBytes(depth: number): number {
  return 4096 * Math.pow(2, depth); // 4KB per chunk
}

/**
 * Utility function that calculates the effective size of a postage batch based on its depth.
 *
 * Below 22 depth the effective size is 0
 * Above 34 it's always > 99%
 *
 * @returns {number} The effective size of the postage batch in bytes.
 */
function getStampEffectiveBytes(depth: number): number {
  if (depth < 17) {
    return 0;
  }

  const breakpoint = effectiveSizeBreakpoints.find(([d, size]) => {
    if (depth === d) {
      return size;
    }
  });

  if (breakpoint) {
    return breakpoint[1] * 1000 * 1000 * 1000;
  }

  return Math.ceil(getStampTheoreticalBytes(depth) * MAX_UTILIZATION);
}

function calculateStampFinancialDetails(
  batch: Batch,
  currentTotalOutPayment: bigint,
  lastPrice: bigint,
): StampFinancialStatus {
  const remainingBalancePerChunk = batch.normalisedBalance - currentTotalOutPayment;
  //const originalCapacity = Number(batch.normalisedBalance) * Math.pow(2, Number(batch.depth) - Number(batch.bucketDepth));
  //const p = (getStampEffectiveBytes(Number(batch.depth))/getStampTheoreticalBytes(Number(batch.depth)))*Number(batch.normalisedBalance) / Number(lastPrice);
  //const t = (p*4096)/(1000*1000*1000);
  //console.log(`remaining: ${t}, original: ${originalCapacity}, lastPrice: ${lastPrice}, p: ${p}, t: ${t}`);
  if (remainingBalancePerChunk <= 0n) {
    return {
      isFinanciallyActive: false,
      expirationDateString: new Date(Date.now()).toISOString() + ' (Expired Financially)',
    };
  }

  const remainingBlocks = remainingBalancePerChunk / lastPrice;
  const expirationSeconds = Number(remainingBlocks) * GNOSIS_BLOCK_TIME_SECONDS;
  const expirationDate = new Date(Date.now() + 1000 * expirationSeconds);

  return {
    isFinanciallyActive: true,
    expirationDateString: expirationDate.toISOString(),
  };
}

export async function checkAndWriteStampDetails(
  port: Port,
  currentTotalOutPayment: bigint,
  lastPrice: bigint,
  ws: fs.WriteStream,
): Promise<void> {
  const batchId = port.hash.startsWith('0x') ? port.hash : '0x' + port.hash;
  const onChainStampData = await getBatchDataFromContract(batchId);
  /*
  if (onChainStampData) {
    console.log(`Processing batch with properties:`, {
    owner: onChainStampData.owner,
    depth: onChainStampData.depth,
    bucketDepth: onChainStampData.bucketDepth,
    immutableFlag: onChainStampData.immutableFlag,
    normalisedBalance: onChainStampData.normalisedBalance,
    lastUpdatedBlockNumber: onChainStampData.lastUpdatedBlockNumber,
  });
  }
  */
  if (!onChainStampData) {
    console.error(`Failed to get batch data for ${batchId} or data was invalid.`);
    // Write a row indicating failure for this specific stamp
    ws.write(`${batchId},false,N/A (Error or Not Found),0.00,N/A\n`);
    return;
  }

  const { owner, depth, immutableFlag } = onChainStampData;
  const batchDepth = Number(depth);

  const isOnchainValid = owner !== '0x0000000000000000000000000000000000000000';
  const totalCapacityBytes = getStampEffectiveBytes(batchDepth);
  const capacityGB = Size.fromBytes(totalCapacityBytes).toGigabytes().toFixed(2);

  let financialDetails: StampFinancialStatus;
  let isFinanciallyActive: boolean;
  let expirationInfo: string;

  if (!isOnchainValid) {
    isFinanciallyActive = false;
    expirationInfo = 'N/A (Invalid Owner)';
  } else {
    financialDetails = calculateStampFinancialDetails(onChainStampData, currentTotalOutPayment, lastPrice);
    isFinanciallyActive = financialDetails.isFinanciallyActive;
    expirationInfo = financialDetails.expirationDateString;
  }

  ws.write(`${batchId},${isOnchainValid},${expirationInfo},${capacityGB},${immutableFlag},${isFinanciallyActive}\n`);
}