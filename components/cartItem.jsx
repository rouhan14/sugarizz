import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import useCookieStore from "@/store/cookieStore";

export default function CartItem({ title, price, image, quantity, bgColor }) {
    const increase = useCookieStore((state) => state.increase);
    const decrease = useCookieStore((state) => state.decrease);

    // Remove item from cart if quantity is 0
    if (quantity === 0) return null;

    return (
        <div
            className="flex items-center justify-between p-4 rounded-2xl w-full max-w-4xl mx-auto my-4"
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex items-center gap-4">
                <div className="relative w-[100px] h-[100px]">
                    <Image src={image} alt={title} fill className="object-contain" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
            </div>

            {/* Price per cookie */}
            <div className="mt-5 flex gap-4 items-center justify-center md:justify-start bg-white rounded-lg p-2">
                <div>Price:</div>
                <div>{price}</div>
            </div>

            {/* Buttons made by me using shadcn */}
            <div className="mt-5 flex gap-4 items-center justify-center md:justify-start bg-white rounded-lg p-2">
                <Button variant="outline" onClick={() => decrease(title)}><FaMinus /></Button>
                <span>{quantity}</span>
                <Button onClick={() => increase(title)}><FaPlus /></Button>
            </div>
            {/* Total Price */}
            <div className="mt-5 flex gap-4 items-center justify-center md:justify-start bg-white rounded-lg p-2">
                <div>Total:</div>
                <div>{(price * quantity)}</div>
            </div>


        </div>
    );
}