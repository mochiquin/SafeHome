import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function BasicInfoSection() {
  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <div className="col-span-8 lg:col-span-4">
          <h2 className="mb-1 text-lg font-semibold">
            Basic information
          </h2>
          <p className="text-muted-foreground text-sm">
            View and update your personal details and account information.
          </p>
        </div>
        <div className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value="nicol43" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" defaultValue="Stephanie" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" defaultValue="Nicol" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              defaultValue="stephanie_nicol@mail.com"
            />
          </div>
          <Button>Save</Button>
        </div>
      </section>

      <Separator className="my-6" />
    </>
  );
}
