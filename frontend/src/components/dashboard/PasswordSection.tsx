import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function PasswordSection() {
  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <div className="col-span-8 lg:col-span-4">
          <h2 className="mb-1 text-lg font-semibold">
            Change password
          </h2>
          <p className="text-muted-foreground text-sm">
            Update your password to keep your account secure.
          </p>
        </div>
        <div className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              Verify current password
            </Label>
            <Input
              id="current-password"
              type="password"
              defaultValue="••••••••••"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                defaultValue="••••••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              defaultValue="••••••••••"
            />
          </div>
          <Button>Save</Button>
        </div>
      </section>

      <Separator className="my-6" />
    </>
  );
}
