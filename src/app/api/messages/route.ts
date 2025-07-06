import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/messages - Get messages for a listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a message to seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_email, seller_email, message } = body;

    // Debug logging
    console.log('Received message data:', { listing_id, buyer_email, seller_email, message });

    // Validation
    if (!listing_id || !buyer_email || !seller_email || !message) {
      console.log('Validation failed - missing fields:', { 
        has_listing_id: !!listing_id, 
        has_buyer_email: !!buyer_email, 
        has_seller_email: !!seller_email, 
        has_message: !!message 
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          listing_id,
          buyer_email,
          seller_email,
          message: message.trim()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 