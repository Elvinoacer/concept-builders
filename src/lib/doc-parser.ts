import { google } from 'googleapis';

import { docs_v1 } from 'googleapis';

export function parseGoogleDoc(doc: docs_v1.Schema$Document) {
  const { body, inlineObjects, positionedObjects } = doc;

  const content: any[] = [];

  if (body && body.content) {
    body.content.forEach((element) => {
      if (element.paragraph) {
        content.push({
          type: 'paragraph',
          ...element.paragraph,
        });
      } else if (element.table) {
        content.push({
          type: 'table',
          ...element.table,
        });
      }
    });
  }

  return {
    content,
    inlineObjects,
    positionedObjects,
  };
}
