import { NextResponse } from 'next/server';
import { ROADMAP_FEATURES } from '@/data/roadmapData';
import { RoadmapFeatureItem } from '@/types';
import { readCloudJson, writeCloudJson, detectStorageMode } from '@/lib/cloudStorage';

const ROADMAP_CLOUD_KEY = 'jalur_langit_roadmap_v1';
const ROADMAP_TEMP_FILE = 'jalur_langit_roadmap_features_v2.json';

interface RoadmapServerRecord {
  features: RoadmapFeatureItem[];
  updatedAt: number;
  source: 'persisted';
}

declare global {
  var __globalRoadmapRecord: RoadmapServerRecord | undefined;
}

export async function GET() {
  const storageMode = detectStorageMode();

  // 1. Jika ada di cloud storage (Redis / Supabase) atau disk container, baca terlebih dahulu
  const cloudRes = await readCloudJson<RoadmapServerRecord | RoadmapFeatureItem[]>(
    ROADMAP_CLOUD_KEY,
    ROADMAP_TEMP_FILE
  );

  if (cloudRes.data) {
    // Mendukung format baru { features, updatedAt } maupun format array lama
    const record: RoadmapServerRecord = Array.isArray(cloudRes.data)
      ? { features: cloudRes.data, updatedAt: Date.now(), source: 'persisted' }
      : {
          features: Array.isArray(cloudRes.data.features) ? cloudRes.data.features : ROADMAP_FEATURES,
          updatedAt: cloudRes.data.updatedAt || Date.now(),
          source: 'persisted',
        };

    globalThis.__globalRoadmapRecord = record;

    return NextResponse.json(
      {
        success: true,
        features: record.features,
        total: record.features.length,
        source: 'persisted',
        updatedAt: record.updatedAt,
        storageMode: cloudRes.mode,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }

  // 2. Gunakan cache memory warm container jika sudah pernah di-POST pada sesi container ini
  if (globalThis.__globalRoadmapRecord) {
    const rec = globalThis.__globalRoadmapRecord;
    return NextResponse.json(
      {
        success: true,
        features: rec.features,
        total: rec.features.length,
        source: 'persisted',
        updatedAt: rec.updatedAt,
        storageMode,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }

  // 3. Fallback default statis (ketika container cold-start tanpa cloud DB)
  return NextResponse.json(
    {
      success: true,
      features: ROADMAP_FEATURES,
      total: ROADMAP_FEATURES.length,
      source: 'default',
      updatedAt: 0,
      storageMode,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.features)) {
      const updatedAt = typeof body.updatedAt === 'number' ? body.updatedAt : Date.now();
      const record: RoadmapServerRecord = {
        features: body.features,
        updatedAt,
        source: 'persisted',
      };

      globalThis.__globalRoadmapRecord = record;
      const writeRes = await writeCloudJson(ROADMAP_CLOUD_KEY, ROADMAP_TEMP_FILE, record);

      return NextResponse.json(
        {
          success: true,
          message: writeRes.savedToCloud
            ? 'Roadmap & Mode Draf tersimpan permanen di Cloud Server.'
            : 'Roadmap & Mode Draf tersimpan di memori sementara server.',
          count: body.features.length,
          source: 'persisted',
          updatedAt,
          savedToCloud: writeRes.savedToCloud,
          storageMode: writeRes.mode,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
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
