import { downloadFromIpfs, downloadAllPinnedContent } from './ipfs.js'
import { uploadToBee } from './bee.js'

const args = process.argv.slice(2)

function showUsage() {
  console.log(`
Usage:
  Single file:    node dist/index.js <CID> <batchId>
  All pinned:     node dist/index.js --all <batchId>
  
Examples:
  node dist/index.js QmHash123... bzz_batch_id_456
  node dist/index.js --all bzz_batch_id_456
  `)
}

async function main() {
  if (args.length === 0) {
    showUsage()
    process.exit(1)
  }

  // Check if downloading all pinned content
  if (args[0] === '--all' || args[0] === '-a') {
    if (args.length !== 2) {
      console.error('Error: --all option requires exactly one batchId parameter')
      showUsage()
      process.exit(1)
    }

    const batchId = args[1]
    console.log('🚀 Starting download of all pinned IPFS content...\n')

    try {
      // Download all pinned content
      const downloadDir = await downloadAllPinnedContent()
      console.log(`\n✅ All content downloaded to: ${downloadDir}`)
      
      console.log(`\n📁 Download completed successfully!`)
      console.log(`📍 Location: ${downloadDir}`)
      console.log(`🔖 BatchId: ${batchId}`)
      console.log(`\n💡 Next: Implement bulk upload to Swarm using batchId: ${batchId}`)
      
      // Explicitly exit
      process.exit(0)
      
    } catch (error) {
      console.error('❌ Error downloading pinned content:', error)
      process.exit(1)
    }
  } 
  // Single file download
  else {
    if (args.length !== 2) {
      console.error('Error: Single file download requires CID and batchId')
      showUsage()
      process.exit(1)
    }

    const cid = args[0]
    const batchId = args[1]

    console.log(`Starting single file download...`)
    console.log(` CID: ${cid}`)
    console.log(`  BatchId: ${batchId}\n`)

    try {
      const tempPath = await downloadFromIpfs(cid)
      console.log(` Downloaded: ${tempPath}`)
      
      const ref = await uploadToBee(tempPath, batchId)
      console.log(`\nMigration completed!`)
      console.log(` IPFS CID: ${cid}`)
      console.log(` Swarm REF: ${ref}`)
      
    } catch (error) {
      console.error(' Error during migration:', error)
      process.exit(1)
    }
  }
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})
