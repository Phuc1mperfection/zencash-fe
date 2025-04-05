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

// Currency options
const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "VND", label: "VND - Vietnamese Dong" },
];

// Language options
const languageOptions = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
];

export function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isLoading } = useProfileUpdate();

  // Set default values from AuthContext or fallbacks
  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username || "",
    email: user?.email || "",
    currency: user?.currency || "USD", // Use user's saved currency or default to USD
    language: user?.language || "en", // Use user's saved language or default to English
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
      {/* Avatar Section */}
      <AvatarSection username={user?.username} />

      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Username Field */}
            <FormFieldWrapper
              control={form.control}
              name="username"
              label="Username"
              placeholder="Enter your username"
            />

            {/* Email Field */}
            <FormFieldWrapper
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />

            {/* Full Name Field */}
            <FormFieldWrapper
              control={form.control}
              name="fullname"
              label="Full Name"
              placeholder="Enter your full name"
            />

            {/* Currency Field */}
            <SelectFieldWrapper
              control={form.control}
              name="currency"
              label="Currency"
              placeholder="Select currency"
              options={currencyOptions}
              description="Your preferred currency."
            />

            {/* Language Field */}
            <SelectFieldWrapper
              control={form.control}
              name="language"
              label="Language"
              placeholder="Select language"
              options={languageOptions}
              description="Your preferred language."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ProfileForm;
