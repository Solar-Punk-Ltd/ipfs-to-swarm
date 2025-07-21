import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let heliaInstance: any = null
let unixfsInstance: any = null

async function getHelia() {
  if (!heliaInstance) {
    heliaInstance = await createHelia() 
    unixfsInstance = unixfs(heliaInstance)
  }
  return { helia: heliaInstance, fs: unixfsInstance }
}

export async function downloadFromIpfs(cid: string): Promise<string> {
  const outputPath = path.resolve(__dirname, 'output.jpg')
  const { fs: heliaFs } = await getHelia()

  const parsedCid = CID.parse(cid)
  const chunks: Uint8Array[] = []

  for await (const chunk of heliaFs.cat(parsedCid)) {
    chunks.push(chunk)
  }

  const fileBuffer = Buffer.concat(chunks)
  fs.writeFileSync(outputPath, fileBuffer)
  return outputPath
}

process.on('exit', async () => {
  if (heliaInstance) {
    await heliaInstance.stop()
  }
})
