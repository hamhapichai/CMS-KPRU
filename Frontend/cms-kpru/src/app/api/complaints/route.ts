import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check if the request is FormData (multipart/form-data) or JSON
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (with file uploads)
      const formData = await req.formData();
      
      // Forward FormData directly to backend
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: formData, // Send FormData as-is
      });
      
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      // Handle JSON data
      const body = await req.json();
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const res = await fetch("http://localhost:5000/api/complaints", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
