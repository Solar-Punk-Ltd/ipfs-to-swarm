import { Bee } from '@ethersphere/bee-js'
import fs from 'fs'

const bee = new Bee('http://localhost:1633')

export async function uploadToBee(filePath: string, batchId: string): Promise<string> {
  const data = fs.readFileSync(filePath)
  const uploadResult = await bee.uploadData(batchId, data)
  return uploadResult.reference.toString()
}