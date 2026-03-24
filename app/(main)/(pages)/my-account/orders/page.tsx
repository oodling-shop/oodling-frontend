import { cookies } from 'next/headers';
import { getOrders } from '@/lib/shopify/customer';
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shopify_customer_token')?.value ?? '';
  const orders = await getOrders(token);

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-[#6C7275]">
        <p className="text-lg">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[#E8ECEF]">
              <td className="py-6 pr-4 text-[#141718] font-semibold text-base">
                #{order.orderNumber}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {new Date(order.processedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base capitalize">
                {order.fulfillmentStatus.toLowerCase()}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: order.totalPrice.currencyCode,
                }).format(parseFloat(order.totalPrice.amount))}
              </td>
              <td className="py-6 pl-4 text-right">
                <Button className="bg-[#141718] text-white hover:bg-black px-8 h-10 rounded-[6px] font-medium text-sm transition-colors">
                  Track
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
