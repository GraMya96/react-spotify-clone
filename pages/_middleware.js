import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Using the middleware between the client request and the
// server, we check the JWT token
export const middleware = async req => {
    const token = await getToken({
        req,
        secret: process.env.JWT_SECRET,

        // Added to make production authentication work
        secureCookie:
            process.env.NEXTAUTH_URL?.startsWith("https://") ??
            !!process.env.VERCEL_URL,
     });

    const { pathname } = req.nextUrl; //catching the URL we are making the request to

    // Allow the request is the following is true:
    // 1) It's a request for next-auth session & provider fetching
    // 2) The token exists
    if( pathname.includes('/api/auth') || token ) {
        return NextResponse.next();
        // letting go the request through the middleware
    }

    // Redirect user to login if they don't have token
    // and are requesting a protected route (in this case,
    // any page except for the Login Page)
    if( !token && pathname !== '/login' && !pathname.includes('png')) {
        return NextResponse.redirect('/login');
    }

}