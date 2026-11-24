import fs from 'fs';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';
import { ROADMAP_FEATURES } from '@/data/roadmapData';
import { RoadmapFeatureItem } from '@/types';

// File temporary lokal untuk menyimpan data roadmap antar serverless invocations
const TEMP_ROADMAP_FILE = path.join(os.tmpdir(), 'jalur_langit_roadmap_features_v1.json');

function loadRoadmapFromDisk(): RoadmapFeatureItem[] | null {
  try {
    if (fs.existsSync(TEMP_ROADMAP_FILE)) {
      const raw = fs.readFileSync(TEMP_ROADMAP_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca temporary roadmap file:', err);
  }
  return null;
}

function saveRoadmapToDisk(features: RoadmapFeatureItem[]) {
  try {
    fs.writeFileSync(TEMP_ROADMAP_FILE, JSON.stringify(features, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Gagal menyimpan temporary roadmap file:', err);
  }
}

// Global cache in-memory across serverless invocations
declare global {
  var __globalRoadmapFeatures: RoadmapFeatureItem[] | undefined;
}

if (!globalThis.__globalRoadmapFeatures) {
  const fromDisk = loadRoadmapFromDisk();
  globalThis.__globalRoadmapFeatures = fromDisk || [...ROADMAP_FEATURES];
}

export async function GET() {
  if (!globalThis.__globalRoadmapFeatures) {
    const fromDisk = loadRoadmapFromDisk();
    globalThis.__globalRoadmapFeatures = fromDisk || [...ROADMAP_FEATURES];
  }

  const features = globalThis.__globalRoadmapFeatures || ROADMAP_FEATURES;

  return NextResponse.json(
    {
      success: true,
      features,
      total: features.length,
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.features) && body.features.length > 0) {
      globalThis.__globalRoadmapFeatures = body.features;
      saveRoadmapToDisk(body.features);
      return NextResponse.json(
        {
          success: true,
          message: 'Roadmap berhasil diperbarui di server',
          count: body.features.length,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Format data roadmap tidak valid (harus berupa array fitur)' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Error updating roadmap on server:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
