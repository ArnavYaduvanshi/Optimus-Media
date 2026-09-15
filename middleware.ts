import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
const isPublicRoute= createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])
const isPublicApiRoute=createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth,req)=> {
    const { userId } = await auth();
    const currentUrl= new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname==="/home"
    const isApiRequst = currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home", req.url))
    }
    //not logged in
    if(!userId){
        //If user is not logged in and trying to access a protected route
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))

        }
        //If user is not logged in and trying to access a public API route
        if(isApiRequst && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
    }
}
return NextResponse.next()

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}