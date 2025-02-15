import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
export async function middleware(request: NextRequest) {
    let token
    token = request.cookies.get("session_token")?.value
    console.log("middleware says: ",token);
    
    if (!token) {
        const cookieHeader = request.headers.get("cookie")
        token = cookieHeader?.split("; ").find((row) => row.startsWith("session_token="))?.split("=")[1];
        console.log("middleware says headers got: ",token);
        
        if(!token){
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    try {
        await jwtVerify(token, secret)
        return NextResponse.next()
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: ['/profile/:path*', '/home/:path*']
}