import { NextResponse } from 'next/server';
import { uploadToR2, generateSlug } from '@/lib/r2';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll('files');
    const folder = formData.get('folder') || 'cars';
    const slug = formData.get('slug') || generateSlug(formData.get('title') || 'untitled');
    const prefix = formData.get('prefix') || ''; // e.g., "thumbnail" ba "related"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === 'string') continue;

      // Validate: image only
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Only images allowed.` },
          { status: 400 }
        );
      }

      // Validate: 10MB max
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max 10MB.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split('.').pop().toLowerCase() || 'webp';
      const filename = prefix
        ? `${prefix}-${i + 1}.${ext}`
        : `${Date.now()}-${i + 1}.${ext}`;
      const key = `${folder}/${slug}/${filename}`;

      const url = await uploadToR2(buffer, key, file.type);
      uploadedUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}