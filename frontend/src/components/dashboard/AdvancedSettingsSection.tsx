import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function AdvancedSettingsSection() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
      <div className="col-span-8 lg:col-span-4">
        <h2 className="mb-1 text-lg font-semibold">
          Advanced settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure detailed account preferences and security options.
        </p>
      </div>
      <div className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
        <div className="items-top flex space-x-2">
          <Checkbox id="data-export" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="data-export"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Data Export Access
            </label>
            <p className="text-muted-foreground text-sm">
              Allow export of personal data and backups.
            </p>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="admin-add" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="admin-add"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Allow Admin to Add Members
            </label>
            <p className="text-muted-foreground text-sm">
              Admins can invite and manage members.
            </p>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="two-factor" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="two-factor"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable Two-Factor Authentication
            </label>
            <p className="text-muted-foreground text-sm">
              Require 2FA for added account security.
            </p>
          </div>
        </div>
        <Button>Save</Button>
      </div>
    </section>
  );
}
