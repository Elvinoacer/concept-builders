import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { google, Auth } from 'googleapis';
import { parseGoogleDoc } from '@/lib/doc-parser';
import { renderGoogleDoc } from '@/lib/doc-renderer';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function downloadImage(url: string, auth: Auth.OAuth2Client) {
  const response = await auth.request({ url, responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data as any);
  const imageName = `${uuidv4()}.png`; // Assume png for simplicity, can be improved
  const imagePath = path.join(process.cwd(), 'public', 'imported-images', imageName);

  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.writeFile(imagePath, imageBuffer);

  return `/imported-images/${imageName}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { docUrl } = await req.json();

  if (!docUrl) {
    return new NextResponse('Missing Google Doc URL', { status: 400 });
  }

  const docIdMatch = docUrl.match(/document\/d\/([a-zA-Z0-9-_]+)/);
  if (!docIdMatch || !docIdMatch[1]) {
    return new NextResponse('Invalid Google Doc URL', { status: 400 });
  }
  const docId = docIdMatch[1];

  // @ts-ignore
  const accessToken = session.accessToken;

  if (!accessToken) {
    return new NextResponse('Access token not found', { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  try {
    const res = await docs.documents.get({
      documentId: docId,
      fields: 'body,inlineObjects,positionedObjects',
    });

    const docData = res.data;
    const urlMapping: { [key: string]: string } = {};

    // Process inline objects
    if (docData.inlineObjects) {
      for (const id in docData.inlineObjects) {
        const inlineObject = docData.inlineObjects[id];
        const embeddedObject = inlineObject.inlineObjectProperties?.embeddedObject;
        if (embeddedObject?.imageProperties?.contentUri) {
          const contentUri = embeddedObject.imageProperties.contentUri;
          const newUrl = await downloadImage(contentUri, oauth2Client);
          urlMapping[contentUri] = newUrl;
        }
      }
    }

    // Process positioned objects
    if (docData.positionedObjects) {
      for (const id in docData.positionedObjects) {
        const positionedObject = docData.positionedObjects[id];
        const embeddedObject = positionedObject.positionedObjectProperties?.embeddedObject;
        if (embeddedObject?.imageProperties?.contentUri) {
          const contentUri = embeddedObject.imageProperties.contentUri;
          if (!urlMapping[contentUri]) { // Avoid re-downloading
            const newUrl = await downloadImage(contentUri, oauth2Client);
            urlMapping[contentUri] = newUrl;
          }
        }
      }
    }

    const parsedDoc = parseGoogleDoc(docData);
    let htmlContent = renderGoogleDoc(parsedDoc);

    // Replace temporary URLs with permanent ones
    for (const oldUrl in urlMapping) {
      const escapedOldUrl = escapeRegExp(oldUrl);
      htmlContent = htmlContent.replace(new RegExp(escapedOldUrl, 'g'), urlMapping[oldUrl]);
    }

    return NextResponse.json({ html: htmlContent });
  } catch (error) {
    console.error('Error fetching Google Doc:', error);
    return new NextResponse('Error fetching Google Doc', { status: 500 });
  }
}