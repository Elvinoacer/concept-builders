"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { FiEdit, FiSave, FiX, FiUpload } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const AdminProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
    adminRole: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await res.json();
      setUserProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        image: data.image || "",
        adminRole: data.adminRole || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("You must be logged in to view this page.");
    } else if (status === "loading") {
      setLoading(true);
    }
  }, [session, status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Assuming an API endpoint for file uploads exists
      // This is a placeholder, replace with actual upload logic
      const uploadRes = await fetch("/api/upload", {
        // You might need to create this API
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }
      const { url } = await uploadRes.json(); // Assuming API returns { url: string }
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload profile picture.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        image: formData.image,
        adminRole: formData.adminRole,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await res.json();
      setUserProfile(updatedUser);
      setIsEditMode(false);
      toast.success("Profile updated successfully!");
      // Optionally update session if name/image changed
      update({ name: updatedUser.name, image: updatedUser.image });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-xl font-semibold mb-4">
            Error: {error}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-8">No profile data available.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Profile
        </h1>

        {!isEditMode ? (
          // View Mode
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={
                  userProfile.image ||
                  "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
                }
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xl">
                  {userProfile.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {userProfile.email}
                </p>
              </div>
            </div>
            {userProfile.bio && (
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Bio:
                </p>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {userProfile.bio}
                </p>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Role:
              </p>
              <p className="text-gray-900 dark:text-white capitalize">
                {userProfile.role.toLowerCase()}
              </p>
            </div>
            {userProfile.adminRole && (
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Admin Role:
                </p>
                <p className="text-gray-900 dark:text-white">
                  {userProfile.adminRole}
                </p>
              </div>
            )}
            <Button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2"
            >
              <FiEdit /> Edit Profile
            </Button>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={
                    formData.image ||
                    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
                  }
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <Label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600"
                >
                  <FiUpload size={16} />
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Label>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminRole">Admin Role</Label>
              <Input
                id="adminRole"
                name="adminRole"
                value={formData.adminRole}
                onChange={handleInputChange}
                placeholder="e.g., Accountant, Consultant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                disabled={isSubmitting}
              >
                <FiX className="mr-2" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : (
                  <FiSave className="mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Approval Ratings - Coming Soon */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Approval Ratings
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This feature is coming soon! Here you will be able to see your
          approval ratings from clients.
        </p>
      </div>
    </div>
  );
};

export default AdminProfilePage;
