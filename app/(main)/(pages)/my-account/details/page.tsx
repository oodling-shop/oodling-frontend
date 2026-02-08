"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountDetailsPage() {
  return (
    <div className="max-w-[720px]">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">First name *</label>
            <Input 
              placeholder="First name" 
              defaultValue="Omar"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Last name *</label>
            <Input 
              placeholder="Last name" 
              defaultValue="Bruce"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Display name *</label>
            <Input 
              placeholder="Display name" 
              defaultValue="Omar Bruce"
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
            <p className="text-sm text-[#6C7275] mt-2">This will be how your name will be displayed in the account section and in reviews</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Email address *</label>
            <Input 
              placeholder="Email address" 
              defaultValue="omar.bruce@gmail.com"
              type="email" 
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
        </div>
        
        <div className="pt-10 space-y-6">
          <h3 className="text-xl font-semibold text-[#141718]">Password change</h3>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Old password</label>
            <Input 
              placeholder="Old password" 
              type="password" 
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">New password</label>
            <Input 
              placeholder="New password" 
              type="password" 
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-base font-semibold text-[#141718]">Repeat new password</label>
            <Input 
              placeholder="Repeat new password" 
              type="password" 
              className="h-12 border-[#E8ECEF] bg-white text-[#141718] placeholder:text-[#6C7275] focus-visible:ring-black/5 rounded-[6px] px-4" 
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button className="bg-[#141718] text-white hover:bg-[#141718]/90 px-10 py-3 h-auto text-base font-semibold rounded-[6px] transition-all active:scale-[0.98]">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
