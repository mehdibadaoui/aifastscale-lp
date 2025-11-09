import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { botToken, chatId, message } = await req.json()

    if (!botToken || !chatId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: botToken, chatId, or message' },
        { status: 400 }
      )
    }

    // Send message via Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Telegram API error:', data)
      return NextResponse.json(
        { error: 'Failed to send Telegram message', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error sending Telegram notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification', message: error.message },
      { status: 500 }
    )
  }
}
