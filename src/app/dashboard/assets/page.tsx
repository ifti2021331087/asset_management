import { getCategoriesAction, getUserAssetsAction } from "@/src/actions/dashboard-actions";
import AssetGrid from "@/src/components/dashboard/asset-grid";
import UploadAsset from "@/src/components/dashboard/upload-asset";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";



export default async function UserAssetsPage() {

  const session=await auth.api.getSession({
    headers:await headers()
  }) 
  if(session===null)return null;

  const [categories,assets]=await Promise.all([
    getCategoriesAction(),
    getUserAssetsAction(session?.user?.id)
  ]);
  console.log(assets);
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">My Assets</h1>
        <UploadAsset categories={categories || []}></UploadAsset>
      </div>
      <AssetGrid assets={assets}></AssetGrid>
    </div>
  )
}  
