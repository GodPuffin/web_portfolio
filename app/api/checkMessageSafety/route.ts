import { NextResponse } from 'next/server';
import { checkMessageSafety } from '../../../utils/messageSafety';

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  }

  try {
    const isSafe = await checkMessageSafety(message);
    return NextResponse.json({ isSafe });
  } catch (error) {
    console.error('Error in checkMessageSafety API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}