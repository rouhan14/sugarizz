// Updated CartItem.js
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import useCookieStore from "@/store/cookieStore";

export default function CartItem({ title, price, image, quantity, bgColor }) {
  const increase = useCookieStore((state) => state.increase);
  const decrease = useCookieStore((state) => state.decrease);

  if (quantity === 0) return null;

  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl w-full max-w-4xl mx-auto my-4 sm:flex-row flex-col"
      style={{
        background: `linear-gradient(to bottom right, ${bgColor}22, ${bgColor}44)`,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex items-center gap-4 w-full sm:w-200">
        <div className="relative w-[100px] h-[100px]">
          <Image src={image} alt={title} fill className="object-contain rounded-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      </div>

      <div className="flex gap-5">
        <div
          className="mt-5 flex gap-4 items-center justify-center rounded-lg p-2 text-white"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>Price:</div>
          <div>{price}</div>
        </div>

        <div className="mt-5 flex gap-4 justify-center">
          <div className="relative min-w-[120px]">
            {quantity === 0 ? (
              <Button
                onClick={() => increase(title)}
                className="w-full bg-green-500/50 hover:bg-green-500/30 border border-white/10 text-white font-semibold py-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                Order Now
              </Button>
            ) : (
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl shadow-[inset_0_0_4px_rgba(255,255,255,0.05),_0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300">
                <button
                  onClick={() => decrease(title)}
                  className="text-white p-4 rounded-l-xl hover:bg-white/10 transition cursor-pointer"
                  style={{ lineHeight: 0 }}
                >
                  <FaMinus size={14} />
                </button>
                <span className="font-semibold w-4 text-center text-white">{quantity}</span>
                <button
                  onClick={() => increase(title)}
                  className="text-white p-4 rounded-r-xl hover:bg-white/10 transition cursor-pointer"
                  style={{ lineHeight: 0 }}
                >
                  <FaPlus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ps-5 w-50">
        <div
          className="mt-5 flex gap-4 items-center justify-center rounded-lg p-2 text-white"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>Total:</div>
          <div>{price * quantity}</div>
        </div>
      </div>
    </div>
  );
}
