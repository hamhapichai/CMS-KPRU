import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    
    console.log('🔍 Fetching tracking for ticket:', ticketId);
    
    // Forward to backend API with correct endpoint
    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/complaints/ticket/${ticketId}/tracking`;
    console.log('📡 Backend URL:', backendUrl);
    
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: 'Complaint not found with this ticket ID' },
          { status: 404 }
        );
      }
      const errorText = await backendResponse.text();
      console.log('❌ Backend error response:', errorText);
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    console.log('✅ Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching complaint tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
