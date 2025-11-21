import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3Client = new S3Client({
  endpoint: `https://sfo3.digitaloceanspaces.com`,
  region: 'sfo3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) { // Changed to POST
  try {
    const fileKey = req.headers.get('x-file-key');
    const contentType = req.headers.get('content-type');
    const fileName = req.headers.get('x-file-name'); // Added fileName

    if (!fileKey || !contentType || !fileName || !req.body) { // Added fileName to check
      return new NextResponse('Missing file key, content type, file name, or body', { status: 400 });
    }

    // Convert ReadableStream to Buffer
    const chunks = [];
    const reader = req.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const fileBuffer = Buffer.concat(chunks);

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${fileKey}`; // Use fileKey
    return NextResponse.json({ publicUrl, originalFileName: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Upload failed', { status: 500 });
  }
}
