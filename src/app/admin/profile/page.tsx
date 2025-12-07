"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Camera,
  Eye,
  EyeOff,
  FileText,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiEdit,
  FiLock,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

const AdminProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
    adminRole: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  });

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
        phone: data.phone || "",
        department: data.department || "",
        notifications: data.notifications || {
          email: true,
          push: false,
          sms: false,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to load profile");
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

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("Image size must be less than 5MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload-file", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
      const { url } = await uploadRes.json();
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

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
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
        phone: formData.phone,
        department: formData.department,
        notifications: formData.notifications,
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
      update({
        name: updatedUser.name,
        image: updatedUser.image,
        email: updatedUser.email,
      });
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner className="animate-spin text-primary w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchUserProfile}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Profile Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Unable to load profile information.
            </p>
            <Button onClick={fetchUserProfile}>Load Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {!isEditMode && (
          <Button
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FiEdit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5" />
                {isEditMode ? "Edit Profile" : "Profile Information"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Update your personal information and profile settings"
                  : "View your account details and information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                        {userProfile.image ? (
                          <Image
                            src={userProfile.image}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-full h-full"
                          />
                        ) : (
                          getInitials(userProfile.name || "Admin User")
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {userProfile.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base truncate">
                          {userProfile.email}
                        </p>
                      </div>
                      {userProfile.adminRole && (
                        <Badge
                          variant="secondary"
                          className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {userProfile.adminRole}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {userProfile.bio && (
                    <div className="space-y-2">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bio
                      </Label>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        {userProfile.bio}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Role
                      </Label>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {userProfile.role?.toLowerCase() || "admin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Member Since
                      </Label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userProfile.createdAt
                          ? new Date(userProfile.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Image Upload */}
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg sm:text-xl relative overflow-hidden">
                        {formData.image ? (
                          <Image
                            src={formData.image}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-full h-full"
                          />
                        ) : (
                          getInitials(formData.name || "Admin User")
                        )}
                        <Label
                          htmlFor="image-upload"
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full"
                        >
                          <Camera className="w-6 h-6 text-white" />
                        </Label>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Click on the image to upload a new profile picture
                      </p>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-base font-semibold"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="adminRole"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Role
                      </Label>
                      <Input
                        id="adminRole"
                        name="adminRole"
                        value={formData.adminRole}
                        onChange={handleInputChange}
                        placeholder="e.g., Accountant, Consultant"
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-base font-semibold"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-base font-semibold"
                      >
                        Department
                      </Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Finance, Operations"
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-semibold">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="bg-white dark:bg-gray-700 resize-vertical min-h-[120px]"
                    />
                  </div>

                  {/* Password Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiLock className="w-5 h-5" />
                      Change Password
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Leave blank to keep your current password
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-base font-semibold"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            className="bg-white dark:bg-gray-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-base font-semibold"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            className="bg-white dark:bg-gray-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditMode(false)}
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <CgSpinner className="animate-spin w-4 h-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Notifications Settings - Only in Edit Mode */}
          {isEditMode && (
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationSettings />
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-50 pointer-events-none">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-50 pointer-events-none">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive text message alerts
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("sms", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FiAward className="w-5 h-5" />
                Profile Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    12
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Projects
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    98%
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Satisfaction
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    3
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Years
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Verified
                </span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                >
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  2FA
                </span>
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-300"
                >
                  Not Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last Login
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Today
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FiAward className="w-5 h-5" />
                Approval Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">⭐</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon!
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Client approval ratings and performance metrics will be
                  available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
