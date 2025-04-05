import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

// Schema definition
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
  name: z.string().nullable().optional(),
  // Add avatarUrl if you handle uploads, otherwise keep it simple
  // avatarUrl: z.string().url().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Component Props (optional, if needed)
// interface ProfileFormProps {}

export function ProfileForm() {
  const { toast } = useToast();
  const { user } = useAuth(); // Get user data from context
  const [isLoading, setIsLoading] = useState(false);

  // Set default values from AuthContext or fallbacks
  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username || "",
    email: user?.email || "",
    currency: "USD", // Add logic to fetch user's saved currency later
    language: "en", // Add logic to fetch user's saved language later
    name: user?.name || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange", // Validate on change
  });

  // Calculate fallback initial for Avatar
  const fallbackInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    console.log("Updating profile data:", data);
    // --- TODO: Implement actual API call to update profile ---
    // Example: updateProfile(data).then(...).catch(...);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000); // Simulate network delay
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24">
          {/* Replace with actual avatar URL if available */}
          <AvatarImage src={undefined} alt={user?.username || "User"} />
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile picture</h3>
          <div className="flex flex-wrap gap-2">
            {/* Add upload functionality later */}
            <Button variant="outline" size="sm" disabled>
              Upload new image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              disabled
            >
              Remove
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {/* JPG, GIF or PNG. 1MB max. (Upload not implemented) */}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    {/* Consider making email read-only if it shouldn't be changed */}
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      value={field.value as string}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Currency Field */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your preferred currency.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Field */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Vietnamese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your preferred language.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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

// Default export or named export as preferred
export default ProfileForm;
