import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-Auth";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/schemas/profileFormSchema";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { AvatarSection } from "./AvatarSection";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
// Currency options

export function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isLoading } = useProfileUpdate();
  const { t } = useTranslation();

  // Set default values from AuthContext or fallbacks
  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username || "",
    email: user?.email || "",
    fullname: user?.fullname || "",
    avatar: user?.avatar || "hinh-cute-meo.jpg", // Default avatar
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange", // Validate on change
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
  }

  // Handle avatar change
  const handleAvatarChange = (filename: string) => {
    form.setValue("avatar", filename);
    // Auto-submit the form when avatar changes
    form.handleSubmit((data) => {
      updateProfile(data);
    })();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Avatar Section */}
        <AvatarSection
          username={user?.username}
          onAvatarChange={handleAvatarChange}
        />

        {/* Profile Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {/* Username Field */}
              <FormFieldWrapper
                control={form.control}
                name="username"
                label={t("common.username")}
                placeholder={t("common.username")}
              />

              {/* Email Field */}
              <FormFieldWrapper
                control={form.control}
                name="email"
                label={t("common.email")}
                placeholder={t("common.email")}
              />

              {/* Full Name Field */}
              <FormFieldWrapper
                control={form.control}
                name="fullname"
                label={t("common.fullname")}
                placeholder={t("common.fullname")}
              />

              {/* Hidden avatar field */}
              <input type="hidden" {...form.register("avatar")} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("common.loading") : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default ProfileForm;
