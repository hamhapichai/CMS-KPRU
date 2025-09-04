import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000/api/departments';

export async function GET() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Departments API response:", data); // Debug log
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  });
  const data = await res.json();
  return NextResponse.json(data);
}
