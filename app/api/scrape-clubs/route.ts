// app/api/scrape-clubs/route.ts
import { scrapeAllClubs } from '@/lib/googlePlacesScraper';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Optionnel : ajouter une vérification de sécurité
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SCRAPER_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting club scraping...');
    const clubs = await scrapeAllClubs();

    return NextResponse.json({
      success: true,
      message: `Scraped and saved ${clubs.length} clubs`,
      clubs,
    });
  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST to trigger scraping',
    example: 'POST /api/scrape-clubs with Authorization header',
  });
}
