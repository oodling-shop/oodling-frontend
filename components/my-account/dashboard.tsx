export function DashboardContent() {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-[#6C7275] text-lg leading-relaxed">
        Hello <span className="font-semibold text-black">Omar</span> (not <span className="font-semibold text-black">Bruce?</span> <button className="text-[#141718] font-semibold hover:underline decoration-2">Log out</button>)
      </p>
      
      <p className="text-[#6C7275] text-lg leading-relaxed">
        From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
      </p>
    </div>
  );
}
