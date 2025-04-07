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
import { SelectFieldWrapper } from "./SelectFieldWrapper";
import { AvatarSection } from "./AvatarSection";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";
import { Card } from "@/components/ui/card";
// Currency options
const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "VND", label: "VND - Vietnamese Dong" },
];

export function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isLoading } = useProfileUpdate();
  const { t } = useTranslation();

  // Set default values from AuthContext or fallbacks
  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username || "",
    email: user?.email || "",
    currency: user?.currency || "USD", // Use user's saved currency or default to USD
    fullname: user?.fullname || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange", // Validate on change
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Avatar Section */}
        <AvatarSection username={user?.username} />

        {/* Language Selector */}
        <div className="flex justify-end">
          <div className="w-[180px]">
            <p className="space-y-3 py-1">
           
              <LanguageSelector />
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              {/* Currency Field */}
              <SelectFieldWrapper
                control={form.control}
                name="currency"
                label={t("profile.currency")}
                placeholder={t("profile.selectCurrency")}
                options={currencyOptions}
              />
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
