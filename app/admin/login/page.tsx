import { Button, Input } from "@/components";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="glass p-8 rounded-2xl border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              type="email" 
              className="w-full h-10 rounded-md border border-input bg-background px-3 focus-visible:ring-2 focus-visible:ring-primary-500 shadow-none ring-0"
              placeholder="admin@nayzak.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input 
              type="password" 
              className="w-full h-10 rounded-md border border-input bg-background px-3 focus-visible:ring-2 focus-visible:ring-primary-500 shadow-none ring-0"
            />
          </div>
          <Button className="w-full">Sign In</Button>
        </div>
      </div>
    </main>
  );
}
