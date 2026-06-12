import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllCoastalClubs } from '@/lib/comprehensiveClubsScraper';

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${process.env.SCRAPER_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting comprehensive clubs scraper...');
    const result = await scrapeAllCoastalClubs();
    
    return NextResponse.json({
      success: true,
      message: 'Scraping completed',
      ...result,
    });
  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json(
      { 
        error: 'Scraping failed',
        details: String(error) 
      },
      { status: 500 }
    );
  }
}
