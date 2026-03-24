import { NextRequest, NextResponse } from 'next/server';
import { Upload } from '@aws-sdk/lib-storage';
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from '@/lib/do-spaces';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const fileKey = req.headers.get('x-file-key');
    const contentType = req.headers.get('content-type');
    const fileName = req.headers.get('x-file-name');

    if (!fileKey || !contentType || !fileName || !req.body) {
      return new NextResponse('Missing file key, content type, file name, or body', { status: 400 });
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: DO_SPACES_BUCKET_NAME,
        Key: fileKey,
        Body: req.body,
        ContentType: contentType,
        ACL: 'public-read',
      },
      queueSize: 4, //
      partSize: 1024 * 1024 * 5, // 5MB
      leavePartsOnError: false, 
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    await upload.done();

    const publicUrl = getDoSpacesPublicUrl(fileKey);
    return NextResponse.json({ publicUrl, originalFileName: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Upload failed', { status: 500 });
  }
}
