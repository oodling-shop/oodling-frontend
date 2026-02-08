import { Button } from "@/components/ui/button";

const orders = [
  {
    id: "#98224",
    date: "July 24, 2022",
    status: "Delivered",
    price: "$28.00",
  },
  {
    id: "#98222",
    date: "July 24, 2022",
    status: "Delivered",
    price: "$28.00",
  },
  {
    id: "#98224",
    date: "July 24, 2022",
    status: "Delivered",
    price: "$28.00",
  },
];

export default function OrdersPage() {
  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b border-[#E8ECEF]">
              <td className="py-6 pr-4 text-[#141718] font-semibold text-base">
                {order.id}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {order.date}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {order.status}
              </td>
              <td className="py-6 px-4 text-[#141718] text-base">
                {order.price}
              </td>
              <td className="py-6 pl-4 text-right">
                <Button 
                  className="bg-[#141718] text-white hover:bg-black px-8 h-10 rounded-[6px] font-medium text-sm transition-colors"
                >
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


