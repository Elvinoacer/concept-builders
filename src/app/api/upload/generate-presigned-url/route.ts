import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  endpoint: `https://sfo3.digitaloceanspaces.com`,
  region: 'sfo3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return new NextResponse('Missing fileName or fileType', { status: 400 });
    }

    const fileKey = `uploads/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
      ContentType: fileType,
      ACL: 'public-read',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${fileKey}`;

    return NextResponse.json({ signedUrl, fileKey, publicUrl, originalFileName: fileName });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return new NextResponse('Failed to generate signed URL', { status: 500 });
  }
}
