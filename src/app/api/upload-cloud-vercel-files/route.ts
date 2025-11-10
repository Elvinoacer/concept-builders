
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No file to upload.' }, { status: 400 });
  }

  const file = request.body;
  const contentType = request.headers.get('content-type') || '';
  const isImage = contentType.startsWith('image/');

  try {
    if (isImage) {
      // Upload to Cloudinary
      const chunks = [];
      const reader = file.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const buffer = Buffer.concat(chunks);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(NextResponse.json({ message: 'Cloudinary upload failed.' }, { status: 500 }));
            } else if (result) {
              resolve(NextResponse.json({ url: result.secure_url, provider: 'cloudinary', originalFileName: filename }));
            }
          }
        );
        uploadStream.end(buffer);
      });

    } else {
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
        contentType,
      });
      return NextResponse.json({ url: blob.url, provider: 'vercel-blob', originalFileName: filename });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed.' }, { status: 500 });
  }
}
