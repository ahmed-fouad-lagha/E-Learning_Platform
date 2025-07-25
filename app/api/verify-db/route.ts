import { NextRequest, NextResponse } from 'next/server';
import { verifyDatabaseSetup } from '@/lib/db-verify';

export async function GET(request: NextRequest) {
  console.log('🚀 Database verification API called');
  
  try {
    await verifyDatabaseSetup();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database verification completed. Check console for details.' 
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
