import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/ProfileForm";
import SecuritySettings from "@/components/profile/SecuritySettings";
import { useAuth } from "@/hooks/use-Auth"; // Import useAuth
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user } = useAuth(); // Get user context
  const { t } = useTranslation();

  // Optional: Add a loading state while user is being fetched
  if (user === undefined) {
     // Or null, depending on how your AuthContext initializes
    return <div>Loading profile...</div>; // Or a spinner component
  }

  // Handle case where user is explicitly null (not logged in)
  if (user === null) {
    return (
      <div className="container max-w-4xl mx-auto py-6 space-y-6 text-center">
         <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
         <p className="text-muted-foreground">Please log in to manage your account settings.</p>
         {/* Optionally add a login button/link here */}
      </div>
    );
  }


  return (
    // Use container and max-width for better layout on larger screens
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">   
      {t("profile.title")}
      </h1>

      <Tabs defaultValue="profile" className="space-y-6">
        {/* Make TabsList responsive */}
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
           {/* ProfileForm doesn't need Card wrapper as it's inside TabsContent */}
           {/* Pass user data if needed, though ProfileForm now uses useAuth directly */}
          <ProfileForm />
        </TabsContent>



        {/* Security Tab */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
