import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ complaintId: string }> }
) {
  try {
    const { departmentId, notes } = await request.json();
    const resolvedParams = await params;
    const complaintId = resolvedParams.complaintId;
    
    const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/forward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify({
        departmentId,
        notes,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to forward complaint';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (e) {
        console.error('Error parsing backend response:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error forwarding complaint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
