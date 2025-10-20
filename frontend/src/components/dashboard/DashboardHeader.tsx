import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, LogOut } from "lucide-react";
import { authApi } from "@/lib/apis";
import { toast } from "sonner";

export function DashboardHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await authApi.logout();

      // Clear any tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      if (response.success) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        throw new Error(response.message || 'Failed to logout');
      }
    } catch (error: any) {
      // Even if logout API fails, clear local token and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      toast.error(error.message || 'Failed to logout');
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-border bg-background border-b">
      <div className="container mx-auto flex flex-col px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
              <Input type="search" placeholder="Search" className="pl-8" />
            </div>
            {/* Logout Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* Mobile-only dropdown */}
          <div className="md:hidden">
            <Select defaultValue="profile">
              <SelectTrigger>
                <SelectValue placeholder="Select setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="invoices">Invoices</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
