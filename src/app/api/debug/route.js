import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const body = await request.text();
  const filePath = path.join(process.cwd(), 'paypal-debug.txt');
  fs.writeFileSync(filePath, body);
  return NextResponse.json({ success: true });
}
