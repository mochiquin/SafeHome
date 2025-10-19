"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfileForm } from "@/hooks/use-profile-form";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/apis";
import { toast } from "sonner";
import type { User } from "@/lib/types/user";

export function ProfileSection() {
  const { updateProfile, isLoading } = useProfileForm();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    vaccinated: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.me();
        if (response.success && response.data) {
          setUser(response.data);
          setFormData({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            city: response.data.city || '',
            vaccinated: response.data.vaccinated || false,
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      // Refresh user data
      const response = await authApi.me();
      if (response.success && response.data) {
        setUser(response.data);
      }
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user.username}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Username cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={user.role}
                disabled
                className="bg-muted capitalize"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="vaccinated"
                checked={formData.vaccinated}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, vaccinated: checked as boolean })
                }
                disabled={isLoading}
              />
              <Label htmlFor="vaccinated">I am vaccinated against COVID-19</Label>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

