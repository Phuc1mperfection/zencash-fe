import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-Auth";
import authService from "@/services/authService";
import { ProfileFormValues } from "@/schemas/profileFormSchema";
import axios from "axios";

export function useProfileUpdate() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    console.log("Updating profile data:", data);

    // Show loading toast
    const loadingToast = toast({
      title: "Updating profile",
      description: "Please wait while we update your profile...",
      duration: 5000,
    });

    try {
      // Call the API to update profile
      const updatedUser = await authService.updateProfile({
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        currency: data.currency
      });

      console.log("Profile updated successfully:", updatedUser);

      // Dismiss loading toast
      loadingToast.dismiss();

      // Show success toast
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
        duration: 5000,
      });

      // Update the user data in the AuthContext directly
      if (setUser && updatedUser) {
        setUser({
          username: updatedUser.username || user?.username || "",
          email: updatedUser.email || user?.email || "",
          fullname: updatedUser.fullname || user?.fullname || "",
          currency: updatedUser.currency || user?.currency || "",
          language: user?.language || "" // Keep the existing language
        });

        // Also update localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUserData = {
          ...currentUser,
          username: updatedUser.username || currentUser.username || "",
          email: updatedUser.email || currentUser.email || "",
          fullname: updatedUser.fullname || currentUser.fullname || "",
          currency: updatedUser.currency || currentUser.currency || "",
          language: currentUser.language || "" // Keep the existing language
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }

      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile:", error);

      // Dismiss loading toast
      loadingToast.dismiss();

      // Show error toast with more details
      let errorMessage = "Failed to update your profile. Please try again.";
      if (axios.isAxiosError(error)) {
        // Server responded with an error
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        // Request was made but no response received
        errorMessage = error.message || errorMessage;
      }

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
}
