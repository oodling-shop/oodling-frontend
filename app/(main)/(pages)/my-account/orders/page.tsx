export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-8">Orders history</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8ECEF]">
              <th className="py-4 font-semibold text-[#6C7275] text-sm uppercase">Number</th>
              <th className="py-4 font-semibold text-[#6C7275] text-sm uppercase">Date</th>
              <th className="py-4 font-semibold text-[#6C7275] text-sm uppercase">Status</th>
              <th className="py-4 font-semibold text-[#6C7275] text-sm uppercase">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#F3F5F7]">
              <td className="py-6 text-[#141718]">#3456_768</td>
              <td className="py-6 text-[#141718]">October 17, 2023</td>
              <td className="py-6 text-[#141718]">Delivered</td>
              <td className="py-6 text-[#141718]">$1,234.00</td>
            </tr>
            <tr className="border-b border-[#F3F5F7]">
              <td className="py-6 text-[#141718]">#3456_987</td>
              <td className="py-6 text-[#141718]">October 19, 2023</td>
              <td className="py-6 text-[#141718]">Delivered</td>
              <td className="py-6 text-[#141718]">$845.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
