import { createHelia } from 'helia'
import { unixfs, } from '@helia/unixfs'
import { CID } from 'multiformats/cid'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const IPFS_HOST = '127.0.0.1'
const IPFS_PORT = 5001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DOWNLOAD_DIR = path.resolve(__dirname, '../tmp_ipfs_download')

let heliaInstance: any = null
let unixfsInstance: any = null

async function getHeliaFs() {
  if (!heliaInstance) {
    heliaInstance = await createHelia() 
    unixfsInstance = unixfs(heliaInstance)
  }
  return unixfsInstance
}

/**
 * Downloads a file from IPFS using the provided CID and saves it to the local filesystem.
 *
 * <p>
 * This function retrieves the file associated with the given CID from IPFS,
 * determines the file name (using a helper or defaulting to the CID with a `.bin` extension),
 * and writes the file to disk in the current directory.
 * </p>
 *
 * @param cid - The IPFS Content Identifier (CID) of the file to download.
 * @returns A promise that resolves to the absolute path of the downloaded file.
 * @throws If the file cannot be retrieved or written to disk.
 */
export async function downloadFileFromIpfs(cid: string): Promise<string> {
  const heliaFs = await getHeliaFs()

  const parsedCid = CID.parse(cid)
  const fileName = (await findFileName(parsedCid)) ?? `${parsedCid.toString()}.bin`
  const outputPath = path.resolve(__dirname, fileName)
  const chunks: Uint8Array[] = []

  for await (const chunk of heliaFs.cat(parsedCid)) {
    chunks.push(chunk)
  }

  const fileBuffer = Buffer.concat(chunks)
  fs.writeFileSync(outputPath, fileBuffer)
  return outputPath
}

async function fetchIpfsApiJson(uri: string): Promise<any> {
  const res = await fetch(uri, { method: 'POST' })
  if (!res.ok) throw new Error(`Failed to fetch: ${uri}`)
  return await res.json()
}

async function findFileName(cid: CID): Promise<string | undefined> {
  async function listDir(mfsPath: string, indent = ''): Promise<string | undefined> {
    const { Entries = [] } = await fetchIpfsApiJson(`http://${IPFS_HOST}:${IPFS_PORT}/api/v0/files/ls?arg=${encodeURIComponent(mfsPath)}`)
    for (const entry of Entries) {
      const path = `${mfsPath}/${entry.Name}`
      const { Hash: entrycid, Type: type } = await fetchIpfsApiJson(`http://${IPFS_HOST}:${IPFS_PORT}/api/v0/files/stat?arg=${encodeURIComponent(path)}`)
      if (cid.toString() === entrycid) {
        return entry.Name
      }
      if (type === 'directory') {
        const found = await listDir(`${mfsPath}/${entry.Name}`, indent + '  ')
        if (found) return found
      }
    }
    return undefined
  }
  return await listDir('/')
}

/**
 * Downloads all pinned content from the IPFS MFS root directory to a local download directory.
 *
 * <p>
 * This function performs the following steps:
 * <ul>
 *   <li>Removes the existing download directory if it exists.</li>
 *   <li>Creates a new download directory.</li>
 *   <li>Lists all entries in the IPFS MFS root directory.</li>
 *   <li>For each entry, determines if it is a file or directory.</li>
 *   <li>Downloads files directly, or recursively downloads directories and their contents.</li>
 * </ul>
 * </p>
 *
 * @returns {Promise<string>} The path to the local download directory containing all downloaded content.
 * @throws {Error} If any file system or network operation fails.
 */
export async function downloadAllPinnedContent(): Promise<string> {
  if (fs.existsSync(DOWNLOAD_DIR)) fs.rmSync(DOWNLOAD_DIR, { recursive: true, force: true })
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })

  const { Entries = [] } = await fetchIpfsApiJson(`http://${IPFS_HOST}:${IPFS_PORT}/api/v0/files/ls?arg=/`)
  for (const { Name } of Entries) {
    const mfsPath = `/${Name}`
    const { Hash: cid, Type: type } = await fetchIpfsApiJson(`http://${IPFS_HOST}:${IPFS_PORT}/api/v0/files/stat?arg=${encodeURIComponent(mfsPath)}`)
    const targetPath = path.join(DOWNLOAD_DIR, Name)
    const cidParsed = CID.parse(cid)
    if (type === 'directory') {
      fs.mkdirSync(targetPath, { recursive: true })
      await downloadDirectoryFromCid(cidParsed, targetPath)
    } else {
      await downloadFile(cidParsed, targetPath)
    }
  }
  return DOWNLOAD_DIR
}

function pathDisplay(p: string): string {
  const t = p.indexOf(DOWNLOAD_DIR)
  return t === -1 ? p : p.slice(t + DOWNLOAD_DIR.length + 1)
}

// Download a directory recursively from a CID
async function downloadDirectoryFromCid(cid: CID, targetDir: string) {
  const heliaFs = await getHeliaFs()
  for await (const entry of heliaFs.ls(cid)) {
    const entryPath = path.join(targetDir, entry.name)
    if (entry.type === 'file') {
      await downloadFile(entry.cid, entryPath)
    } else if (entry.type === 'directory') {
      fs.mkdirSync(entryPath, { recursive: true })
      await downloadDirectoryFromCid(entry.cid, entryPath)
    }
  }
}

async function downloadFile(cid: CID, outputPath: string): Promise<void> {
  console.log(`File  ${pathDisplay(outputPath)} - CID: ${cid}`)
  const heliaFs = await getHeliaFs()
  const chunks: Uint8Array[] = []
  
  for await (const chunk of heliaFs.cat(cid)) {
    chunks.push(chunk)
  }
  
  const fileBuffer = Buffer.concat(chunks)
  
  // Ensure directory exists
  const dir = path.dirname(outputPath)
  fs.mkdirSync(dir, { recursive: true })
  
  fs.writeFileSync(outputPath, fileBuffer)
}

// Add function to properly close Helia
async function closeHelia(): Promise<void> {
  if (heliaInstance) {
    console.log('Closing Helia instance...')
    try {
      await heliaInstance.stop()
      heliaInstance = null
      unixfsInstance = null
      console.log('Helia instance closed successfully')
    } catch (error) {
      console.error('Error closing Helia:', error)
    }
  }
}

// Update the process exit handler
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, closing Helia...')
  await closeHelia()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, closing Helia...')
  await closeHelia()
  process.exit(0)
})

process.on('exit', async () => {
  await closeHelia()
})
