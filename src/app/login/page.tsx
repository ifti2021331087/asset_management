
import LoginButton from "@/src/components/auth/login-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { auth } from "@/src/lib/auth";
import { Package } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";



export default async function LoginPage() {

    const session=await auth.api.getSession({
        headers:await headers()
    })

    if(session)redirect("/");
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow">
                <CardHeader className="text-center">
                    <div className="mx-auto rounded-full bg-teal-500 w-fit">
                        <Package className="w-6 h-6 text-white"></Package>
                    </div>
                    <CardTitle className="text-2xl font-bold text-teal-600">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginButton></LoginButton>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                    <Link href="/"
                    className="text-sm text-slate-500 hover:text-teal-600"
                    >
                        Back to home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
