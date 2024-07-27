import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough, Readable } from "stream";
import { pipeline } from "stream/promises";

const s3Client = new S3Client();

async function getFileType(url: string): Promise<string> {
  const headResponse = await fetch(url, { method: "HEAD" });

  if (!headResponse.ok) {
    throw new Error(`Failed to get file type: ${headResponse.statusText}`);
  }

  const contentType = headResponse.headers.get("content-type");
  if (!contentType) {
    throw new Error("Content-Type not found");
  }

  return contentType;
}

export async function downloadFileAndUploadToS3(
  url: string,
  bucketName: string,
  key: string
): Promise<{ contentType: string; key: string }> {
  const contentType = await getFileType(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const readableStream = Readable.fromWeb(response.body as any);
  const passThroughStream = new PassThrough();

  // Use pipeline to handle backpressure
  pipeline(readableStream, passThroughStream).catch((err) => {
    console.error("Pipeline failed:", err);
  });

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: passThroughStream,
    ContentType: contentType,
  };

  // Check if file already exists, delete if necessary
  const headObjectCommand = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  try {
    await s3Client.send(headObjectCommand);
    console.log(`File ${key} already exists, deleting...`);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    console.log(`File ${key} deleted`);
  } catch (error) {
    console.log(`File ${key} does not exist`);
  }

  const upload = new Upload({
    client: s3Client,
    params: uploadParams,
  });

  await upload.done();

  console.log(`File uploaded successfully to ${bucketName}/${key}`);

  return { contentType, key };
}
