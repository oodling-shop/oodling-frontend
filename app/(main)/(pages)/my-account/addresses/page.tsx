import { Button } from "@/components/ui/button";

export default function AddressesPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-8">Addresses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-[#E8ECEF] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Billing Address</h3>
            <button className="text-[#6C7275] hover:text-black transition-colors font-medium text-sm">Edit</button>
          </div>
          <div className="text-[#141718] space-y-1">
            <p className="font-semibold">Omar Bruce</p>
            <p>+1 (234) 567-890</p>
            <p>3456 Street Name, City Name, Country</p>
          </div>
        </div>

        <div className="border border-[#E8ECEF] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Shipping Address</h3>
            <button className="text-[#6C7275] hover:text-black transition-colors font-medium text-sm">Edit</button>
          </div>
          <div className="text-[#141718] space-y-1">
            <p className="font-semibold">Omar Bruce</p>
            <p>+1 (234) 567-890</p>
            <p>3456 Street Name, City Name, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
}
