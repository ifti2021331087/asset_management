"use client";

import { signOut, useSession } from "@/src/lib/auth-client";
import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Header() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const isAdminUser = user?.role === 'admin';
    const router = useRouter();
    const pathName = usePathname();
    const isLoginPage: boolean = pathName === '/login';
    if (isLoginPage) return null;

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href={"/"} className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-teal-500">
                            <Package className="w-5 h-5 text-white"></Package>
                        </div>
                        <span className="font-bold text-xl text-teal-600">
                            Asset Platform
                        </span>
                    </Link>
                    <nav className="items-center flex gap-6 ml-6">
                        {
                            !isPending && user && isAdminUser ? null :
                                <Link
                                    href={"/gallery"}
                                    className="text-sm font-medium hover:text-teal-600"
                                >
                                    Gallery
                                </Link>
                        }
                        {
                            !isPending && user && !isAdminUser && (
                                <>
                                    <Link
                                        href={"/dashboard/assets"}
                                        className="text-sm font-medium hover:text-teal-600"
                                    >
                                        Assets
                                    </Link>
                                    <Link
                                        href={"/dashboard/purchases"}
                                        className="text-sm font-medium hover:text-teal-600"
                                    >
                                        Purchases
                                    </Link>
                                </>
                            )
                        }

                        {
                            !isPending && user && isAdminUser && (
                                <>
                                    <Link
                                        href={"/admin/asset-approval"}
                                        className="text-sm font-medium hover:text-teal-600"
                                    >
                                        Asset-approval
                                    </Link>
                                    <Link
                                        href={"/admin/settings"}
                                        className="text-sm font-medium hover:text-teal-600"
                                    >
                                        Settings
                                    </Link>
                                </>
                            )
                        }
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    {
                        isPending ? null : user ?
                            <div className="flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={'ghost'} className="relative w-8 h-8 rounded-full">
                                            <Avatar className="w-8 h-8 border border-slate-300">
                                                <AvatarFallback className="bg-teal-500 text-white">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user.name}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator></DropdownMenuSeparator>
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                                            <LogOut className="mr-2 h-2 w-4"></LogOut>
                                            <span className="font-medium">Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            :
                            <Link
                                href={"/login"}
                            >
                                <Button className="bg-teal-500 hover:bg-teal-600 text-white">Login</Button>
                            </Link>
                    }
                </div>
            </div>
        </header>
    )
}
