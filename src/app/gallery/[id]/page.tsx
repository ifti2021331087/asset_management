import { getAssetByIdAction } from "@/src/actions/dashboard-actions"
import { createPaypalOrderAction, hasUserPurchasedAssetAction } from "@/src/actions/payment-actions"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { auth } from "@/src/lib/auth"
import { CheckCircle2, Download, Info, Loader2, ShoppingCart, Tag } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface GalleryDetailsPageProps {
  params: Promise<{
    id: string
  }>,
  // 1. Wrap searchParams in a Promise type
  searchParams: Promise<{
    success?: string,
    cancelled?: string,
    error?: string,
  }>
}

export default function GalleryDetailsPage({ params, searchParams }: GalleryDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[65vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      }
    >
      <GalleryContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function GalleryContent({ params, searchParams }: GalleryDetailsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (session && session?.user?.role === 'admin') {
    redirect('/');
  }
  
  // 2. Await the entire searchParams promise before reading values
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams?.success;

  const AssetParams = await params;
  const result = await getAssetByIdAction(AssetParams?.id);
  
  if (!result) {
    notFound();
  }
  
  const { asset, categoryName, userName, userImage, userId } = result;
  const isAuthor = session?.user.id === userId;
  const initials = userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  const hasPurchasedAsset = session?.user?.id ? 
  await hasUserPurchasedAssetAction(AssetParams.id) : false;

  async function handlePurchase() {
    "use server";

    const result = await createPaypalOrderAction(AssetParams?.id);
    if(result.alreadyPurchased){
      redirect(`/gallery/${AssetParams.id}?success=true`)
    }
    if(result.approvalLink){
      redirect(result.approvalLink);
    }
  }

  return (
    <div className="min-h-screen container px-4 bg-white">
      {
        success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 mt-8">
            {/* 3. Fix the Lucide icon usage by self-closing it */}
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Purchase Successful! You can download this asset</p>
          </div>
        )
      }
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden bg-gray-100 border">
              <div className="relative w-full">
                <Image
                  src={asset.fileUrl}
                  alt={asset.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{asset?.title}</h1>
                {
                  categoryName && (
                    <Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                      <Tag className="mr-1 w-4 h-4" />
                      {categoryName}
                    </Badge>
                  )
                }
              </div>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">Creator</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="sticky top-24">
              <Card className="overflow-hidden border-0 shadow-xl rounded-2xl bg-white">
                <div className="bg-[#1e2532] p-6 flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-gray-100">
                    Premium Asset
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      $5.00
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      One Time Purchase
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    {
                      session?.user ? (
                        isAuthor ? (
                          <div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-sm">This is your own asset. You cannot purchase your own asset.</p>
                          </div>
                        ) : (
                          hasPurchasedAsset ? (
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-medium">
                              <a href={`/api/download/${AssetParams.id}`} download>
                                <Download className="mr-2 w-5 h-5" />
                                Download Asset
                              </a>
                            </Button>
                          ) : (
                            <form action={handlePurchase}>
                              <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white h-12 rounded-lg font-medium">
                                <ShoppingCart className="mr-2 w-5 h-5" />
                                Purchase Now
                              </Button>
                            </form>
                          )
                        )
                      ) : (
                        <Button asChild className="w-full bg-black hover:bg-black/90 text-white h-12 rounded-lg font-medium">
                          <Link href={"/login"}>Sign in to purchase</Link>
                        </Button>
                      )
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}