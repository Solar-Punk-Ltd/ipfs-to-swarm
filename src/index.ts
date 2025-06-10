import { downloadFromIpfs } from './ipfs.js'
import { uploadToBee } from './bee.js'

const cid = process.argv[2]

if (!cid) {
  console.error('Usage: node dist/index.js <CID>')
  process.exit(1)
}

const tempPath = await downloadFromIpfs(cid)
const ref = await uploadToBee(tempPath)
console.log(`IPFS : ${cid}\nSWARM: ${ref}`)
