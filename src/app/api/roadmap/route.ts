import { NextResponse } from 'next/server';
import { ROADMAP_FEATURES } from '@/data/roadmapData';
import { RoadmapFeatureItem } from '@/types';

// Global cache in-memory across serverless invocations
declare global {
  var __globalRoadmapFeatures: RoadmapFeatureItem[] | undefined;
}

if (!globalThis.__globalRoadmapFeatures) {
  globalThis.__globalRoadmapFeatures = [...ROADMAP_FEATURES];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    features: globalThis.__globalRoadmapFeatures || ROADMAP_FEATURES,
    total: (globalThis.__globalRoadmapFeatures || ROADMAP_FEATURES).length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.features) && body.features.length > 0) {
      globalThis.__globalRoadmapFeatures = body.features;
      return NextResponse.json({
        success: true,
        message: 'Roadmap berhasil diperbarui di server',
        count: body.features.length,
        timestamp: new Date().toISOString()
      });
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
