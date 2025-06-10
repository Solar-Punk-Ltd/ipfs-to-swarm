import { Bee } from '@ethersphere/bee-js'
import fs from 'fs'

const bee = new Bee('http://localhost:1633')

const batchId = '8fa037937864850b22220561b42d3b6e700f350f6313ef088e93f9e8b6c4a7db'


export async function uploadToBee(filePath: string): Promise<string> {
  const data = fs.readFileSync(filePath)
  const uploadResult = await bee.uploadData(batchId, data)
  return uploadResult.reference.toString()
}