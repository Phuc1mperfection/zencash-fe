import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Use Label component
import { Switch } from "@/components/ui/switch";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import authService from "@/services/authService";

export function SecuritySettings() {
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add state for 2FA if implementing
  // const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      // Reset form after successful password change
      form.reset();
    } catch (error) {
      // Error handling is done in the service
      console.error("Password change failed:", error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // const handleTwoFactorToggle = (checked: boolean) => {
  //   // --- TODO: Add actual 2FA enable/disable logic ---
  //   console.log("2FA toggled:", checked);
  //   toast({
  //     title: `Two-Factor Authentication ${checked ? "Enabled" : "Disabled"}`,
  //     description: `(Simulation)`,
  //   });
  //   // setIsTwoFactorEnabled(checked); // Update state if needed
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Change Password Section */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h3 className="text-base font-medium">Change Password</h3>
          <div className="grid gap-4">
            <div className="relative">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>

        {/* Two-Factor Authentication Section */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="text-base font-medium">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account. (Not
                implemented)
              </p>
            </div>
            {/* Add state and onCheckedChange when implementing 2FA */}
            <Switch
              // checked={isTwoFactorEnabled}
              // onCheckedChange={handleTwoFactorToggle}
              disabled // Disable until implemented
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SecuritySettings;
