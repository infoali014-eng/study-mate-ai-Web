import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Credentials() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || "deepcode-files";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

/**
 * Returns a configured AWS S3 Client instance targeting Cloudflare R2 S3 API.
 * Credentials remain strictly on the server-side.
 */
export function getR2Client(): S3Client | null {
  const creds = getR2Credentials();
  if (!creds) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${creds.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
    },
  });
}

export function getR2BucketName(): string {
  const creds = getR2Credentials();
  return creds ? creds.bucketName : "deepcode-files";
}

/**
 * Uploads a physical file buffer directly to Cloudflare R2.
 */
export async function uploadFileToR2(
  fileKey: string,
  body: Buffer | Uint8Array,
  mimeType: string
): Promise<{ success: boolean; fileKey: string } | null> {
  const client = getR2Client();
  if (!client) return null;
  const bucketName = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: body,
    ContentType: mimeType,
  });

  try {
    await client.send(command);
    return {
      success: true,
      fileKey,
    };
  } catch (error: unknown) {
    console.error("[Cloudflare R2] Upload error:", error);
    return null;
  }
}

/**
 * Deletes a physical object from Cloudflare R2.
 */
export async function deleteFileFromR2(fileKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    if (!client) return false;
    const bucketName = getR2BucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error(`[Cloudflare R2] Error deleting object "${fileKey}":`, error);
    return false;
  }
}

/**
 * Generates a short-lived signed URL for safely viewing or downloading R2 assets on demand.
 */
export async function generateR2SignedUrl(
  fileKey: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  try {
    const client = getR2Client();
    if (!client) return fileKey;
    const bucketName = getR2BucketName();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: expiresInSeconds,
    });
    return signedUrl;
  } catch (error) {
    console.error(`[Cloudflare R2] Error generating signed URL for "${fileKey}":`, error);
    return fileKey;
  }
}

/**
 * Checks if an object exists in Cloudflare R2 by fileKey.
 */
export async function checkFileExistsInR2(fileKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    if (!client) return false;
    const bucketName = getR2BucketName();

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}
