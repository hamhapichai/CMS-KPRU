import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    
    
    
    // Forward to backend API
    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/complaints/ticket/${ticketId}/tracking`;
    
    
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: 'Complaint not found with this ticket ID' },
          { status: 404 }
        );
      }
      await backendResponse.text();
      
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);
  } catch {
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
