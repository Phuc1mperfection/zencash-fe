import * as z from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
 
  fullname: z.string({
    required_error: "Please enter your full name.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
