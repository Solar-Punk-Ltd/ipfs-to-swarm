import { Bee } from '@ethersphere/bee-js'
import fs from 'fs'

const bee = new Bee('http://localhost:1633')

/**
 * Uploads a file to the Bee node using the specified batch ID.
 *
 * @param filePath - The path to the file that should be uploaded.
 * @param batchId - The batch ID to be used for the upload operation.
 * @returns A promise that resolves to the reference string of the uploaded file.
 * @throws Will throw an error if the file cannot be read or the upload fails.
 */
export async function uploadFileToBee(filePath: string, batchId: string): Promise<string> {
  const data = fs.readFileSync(filePath)
  const uploadResult = await bee.uploadData(batchId, data)
  return uploadResult.reference.toString()
}

/**
 * Uploads all files from a specified directory to the Bee node using the given batch ID.
 *
 * @param directoryPath - The path to the directory containing files to upload.
 * @param batchId - The batch ID to use for the upload operation.
 * @returns A promise that resolves to the reference string of the uploaded content.
 * @throws Will throw an error if the upload fails.
 */
export async function uploadDirectoryToBee(directoryPath: string, batchId: string): Promise<string> {
  const uploadResult = await bee.uploadFilesFromDirectory(batchId, directoryPath)
  return uploadResult.reference.toString()
}