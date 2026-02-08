import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountDetailsPage() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-8">Account details</h2>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase text-[#6C7275]">First Name *</label>
          <Input placeholder="First Name" defaultValue="Omar" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase text-[#6C7275]">Last Name *</label>
          <Input placeholder="Last Name" defaultValue="Bruce" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase text-[#6C7275]">Display Name *</label>
          <Input placeholder="Display Name" defaultValue="Omar Bruce" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
          <p className="text-sm text-[#6C7275] italic">This will be how your name will be displayed in the account section and in reviews</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase text-[#6C7275]">Email Address *</label>
          <Input placeholder="Email Address" defaultValue="omar@example.com" type="email" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
        </div>
        
        <div className="space-y-8 pt-4">
          <h3 className="text-xl font-semibold">Password Change</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase text-[#6C7275]">Old Password</label>
            <Input placeholder="Old Password" type="password" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase text-[#6C7275]">New Password</label>
            <Input placeholder="New Password" type="password" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase text-[#6C7275]">Repeat New Password</label>
            <Input placeholder="Repeat New Password" type="password" className="h-12 border-[#E8ECEF] bg-white text-base md:text-lg focus-visible:ring-black/5" />
          </div>
        </div>
        
        <Button className="bg-black text-white hover:bg-black/90 px-10 py-6 h-auto text-lg rounded-xl">
          Save changes
        </Button>
      </form>
    </div>
  );
}
