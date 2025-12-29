import { useRouter } from "next/router"; 
import { getProduct, type ProductType } from "@/lib/products";
import StudioShell from "@/components/StudioShell";

export default function StudioProductPage() {
  const router = useRouter();
  const productId = router.query.productId as ProductType;

  if (!productId) return null;

  getProduct(productId);

  return <StudioShell productId={productId} />;
}


StudioProductPage.hideNavbar = true;
StudioProductPage.hideFooter = true;