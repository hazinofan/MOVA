import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCarousel } from "@/components/ProductsCaroussel";

function ProductDetails() {
  const images = [
    "/assets/image1.png",
    "/assets/image2.png",
    "/assets/image3.png",
    "/assets/image4.png",
    "/assets/image5.png",
    "/assets/image6.png",
  ];
  return (
    <div>
      <ProductCarousel images={images} />
      <section className="w-full border-t border-neutral-200 py-10 md:py-16">
        <div className="mx-8 lg:px-0">
          <div className="relative flex flex-col gap-10 md:flex-row md:gap-16">
            {/* DESCRIPTION */}
            <div className="md:w-1/2 max-w-xl">
              <h3 className="mb-4 text-[16px] font-semibold tracking-[0.2em] text-black uppercase">
                DESCRIPTION
              </h3>
              <p className="text-base leading-relaxed">
                Mid-rise slightly oversized fit. Sport meets sophistication.
                Your perfectly polished everyday pant crafted from luxury-grade
                Supima cotton terry. A vintage-inspired straight leg that moves
                seamlessly from morning workout to meetings to dinner plans. The
                rare blend of athletic heritage and modern refinement,
                enzyme-washed for the kind of softness that makes these an MVP
                in your daily wardrobe. Model is 5'7&quot; and a size 24&quot;
                and is wearing an XS.
              </p>
            </div>

            {/* DETAILS */}
            <div className="md:w-1/2 max-w-xl">
              <h3 className="mb-4 text-[16px] font-semibold tracking-[0.2em] text-black uppercase">
                DETAILS
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed">
                <li>Premium 27 oz Supima cotton terry</li>
                <li>Mid-rise with athletic-inspired straight leg</li>
                <li>Clean waistband for studio-to-street style</li>
                <li>Deep side pockets for essentials</li>
                <li>Vintage sportswear silhouette, refined</li>
                <li>MOVA embroidered signature</li>
                <li>Enzyme-washed for lived-in comfort</li>
                <li>100% Supima cotton</li>
                <li>Care: machine wash cold, tumble dry low</li>
                <li>(Oversized fit; if in between sizes, please size down)</li>
                <li>Model is 5'7&quot; wearing a size S</li>
              </ul>
            </div>

            {/* SIZE CHART BUTTON */}
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 inline-block w-full rounded-none bg-black px-6 py-3 text-center text-[11px] font-semibold tracking-[0.2em] text-white hidden cursor-pointer"
                  >
                    SIZE CHART
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Name</Label>
                      <Input
                        id="name-1"
                        name="name"
                        defaultValue="Pedro Duarte"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Username</Label>
                      <Input
                        id="username-1"
                        name="username"
                        defaultValue="@peduarte"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
