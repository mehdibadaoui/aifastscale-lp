import { NextResponse } from 'next/server'

// Apple Pay domain verification file content
// This is the hex-encoded verification from Whop's payment processor
const APPLE_PAY_VERIFICATION = '7b2276657273696f6e223a312c227073704964223a2236343641384242363234393134464232453835354239443531364642353530333338314132444446383545414643463630323336443830413044434235334632222c22637265617465644f6e223a313736303636343737373433327d'

export async function GET() {
  return new NextResponse(APPLE_PAY_VERIFICATION, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
