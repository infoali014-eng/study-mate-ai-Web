import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "mrowl-study-library";

/**
 * Returns a configured AWS S3 Client instance targeting Cloudflare R2 API.
 */
export function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads a physical file buffer directly to Cloudflare R2 bucket.
 */
export async function uploadFileToR2(
  fileKey: string,
  body: Buffer | Uint8Array,
  mimeType: string
): Promise<{ success: boolean; fileKey: string }> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: body,
    ContentType: mimeType,
  });

  await client.send(command);

  return {
    success: true,
    fileKey,
  };
}

/**
 * Deletes a physical file object from Cloudflare R2.
 */
export async function deleteFileFromR2(fileKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error(`[R2 Storage] Error deleting key "${fileKey}":`, error);
    return false;
  }
}

/**
 * Dynamically generates a temporary signed URL for securely downloading or previewing R2 assets on-demand.
 * Expiration defaults to 1 hour (3600 seconds).
 */
export async function generateR2SignedUrl(
  fileKey: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  try {
    const client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: expiresInSeconds,
    });
    return signedUrl;
  } catch (error) {
    console.error(`[R2 Storage] Error generating signed URL for "${fileKey}":`, error);
    throw error;
  }
}

/**
 * Checks if a file exists in R2 bucket metadata by Key.
 */
export async function checkFileExistsInR2(fileKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}
