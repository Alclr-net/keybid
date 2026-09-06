import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadedPath = 'C:\\Users\\rachi\\.gemini\\antigravity-ide\\brain\\725c6ec6-0459-44a6-9c76-90cf185eaa65\\.user_uploaded\\media_1788719727320.png';
    const publicPath = path.join(process.cwd(), 'public', 'rachit.png');

    if (fs.existsSync(uploadedPath)) {
      const fileBuffer = fs.readFileSync(uploadedPath);
      // Also sync to public folder for static serving
      try {
        if (!fs.existsSync(publicPath)) {
          fs.writeFileSync(publicPath, fileBuffer);
        }
      } catch (err) {
        console.warn('Could not write to public directory:', err);
      }

      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (fs.existsSync(publicPath)) {
      const fileBuffer = fs.readFileSync(publicPath);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error loading avatar:', error);
  }

  return new Response('Avatar not found', { status: 404 });
}
