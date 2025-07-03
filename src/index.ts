import { downloadFromIpfs } from './ipfs.js'
import { uploadToBee } from './bee.js'

const cid = process.argv[2]
const batchId = process.argv[3]

if (!cid || !batchId) {
  console.error('Usage: node dist/index.js <CID> <batchId>')
  process.exit(1)
}

const tempPath = await downloadFromIpfs(cid)
const ref = await uploadToBee(tempPath, batchId)
console.log(`IPFS : ${cid}\nSWARM: ${ref}`)
