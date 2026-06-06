import { getUserInvoicesAction } from "@/src/actions/invoice-actions";
import { getAllUserPurchasedAssetsAction } from "@/src/actions/payment-actions";
import { Button } from "@/src/components/ui/button";
import { auth } from "@/src/lib/auth"
import { Download } from "lucide-react";
import { headers } from "next/headers"
import Image from "next/image";
import { redirect } from "next/navigation";



export default async function UserPurchasePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null) return null;
  if (!session.user) redirect("/login");
  if (session?.user?.role === 'admin') redirect("/");

  const purchaseResult = await getAllUserPurchasedAssetsAction();
  const invoicesResult = await getUserInvoicesAction();

  const purchases = Array.isArray(purchaseResult) ? purchaseResult : [];
  const invoices = invoicesResult.success && invoicesResult.invoices
    ? invoicesResult.invoices
    : [];

  console.log("ALL PURCHASES:", purchases);
  console.log("ALL INVOICES:", invoices);

  const purchaseToInvoiceMap=new Map();
  invoices.forEach((inv)=>purchaseToInvoiceMap.set(inv.purchaseId,inv.id));

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6 ">My Purchases</h1>
      {
        purchases.length===0?
        <p>You have not purchased any asset yet</p>:
        <div className="space-y-4">
          {
            purchases.map(({purchase,asset})=>(
              <div key={purchase.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-sm">
                <div className=" relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image 
                  src={asset.fileUrl}
                  alt={asset.title}
                  fill
                  className="object-cover"
                  >
                  </Image>
                </div>
                <div className="grow min-w-0">
                  <h3 className="font-medium truncate">{asset?.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Purchased at{" "}
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Button size="sm" asChild className="bg-black text-white">
                    <a href={`/api/download/${asset.id}`} download>
                      <Download className="mr-2 w-4 h-4">
                      </Download>
                      Download
                    </a>
                  </Button>
                  {
                    " "
                  }
                  {
                    purchaseToInvoiceMap.has(purchase.id) && (
                      <Button variant={'outline'} size="sm" asChild>
                        <a 
                        href={`/api/invoices/${purchaseToInvoiceMap.get(purchase.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                          View Invoice
                        </a>
                      </Button>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}
