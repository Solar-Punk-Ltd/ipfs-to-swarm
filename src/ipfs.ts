import { create } from 'ipfs-http-client'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' })

export async function downloadFromIpfs(cid: string): Promise<string> {
  const outputPath = path.resolve(__dirname, 'output.jpg')
  const stream = ipfs.cat(cid)
  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  const fileBuffer = Buffer.concat(chunks)
  fs.writeFileSync(outputPath, fileBuffer)
  return outputPath
}
