import { NextResponse } from 'next/server';

export async function POST() {
  // ลบ session หรือ token ฝั่ง server ถ้ามี (กรณีนี้ใช้ JWT ฝั่ง client)
  return NextResponse.json({ success: true });
}
