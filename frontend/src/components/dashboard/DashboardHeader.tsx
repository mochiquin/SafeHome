import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="border-border bg-background border-b">
      <div className="container mx-auto flex flex-col px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Dashboard
            </h1>
          </div>
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
            <Input type="search" placeholder="Search" className="pl-8" />
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
