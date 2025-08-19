import { PrismaClient } from "@prisma/client_competency";

const prisma = new PrismaClient();

// Interface for profile update data
export interface ProfileUpdateData {
  firstNameTH?: string;
  lastNameTH?: string;
  firstNameEN?: string;
  lastNameEN?: string;
  phone?: string;
  line?: string;
  address?: string;
}

// Interface for complete user profile
export interface UserProfileData {
  id: string;
  email: string;
  profileImage: string | null;
  firstNameTH: string | null;
  lastNameTH: string | null;
  firstNameEN: string | null;
  lastNameEN: string | null;
  phone: string | null;
  line: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class UserDataService {
  /**
   * Get user profile data by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfileData | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          profileImage: true,
          firstNameTH: true,
          lastNameTH: true,
          firstNameEN: true,
          lastNameEN: true,
          phone: true,
          line: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Get user profile data by email
   */
  async getUserProfileByEmail(email: string): Promise<UserProfileData | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          profileImage: true,
          firstNameTH: true,
          lastNameTH: true,
          firstNameEN: true,
          lastNameEN: true,
          phone: true,
          line: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error fetching user profile by email:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Update user profile data
   */
  async updateUserProfile(userId: string, profileData: ProfileUpdateData): Promise<UserProfileData> {
    try {
      // Validate input data
      const updateData: Partial<ProfileUpdateData> = {};
      
      if (profileData.firstNameTH !== undefined) updateData.firstNameTH = profileData.firstNameTH.trim();
      if (profileData.lastNameTH !== undefined) updateData.lastNameTH = profileData.lastNameTH.trim();
      if (profileData.firstNameEN !== undefined) updateData.firstNameEN = profileData.firstNameEN.trim();
      if (profileData.lastNameEN !== undefined) updateData.lastNameEN = profileData.lastNameEN.trim();
      if (profileData.phone !== undefined) updateData.phone = profileData.phone.trim();
      if (profileData.line !== undefined) updateData.line = profileData.line.trim();
      if (profileData.address !== undefined) updateData.address = profileData.address.trim();

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          profileImage: true,
          firstNameTH: true,
          lastNameTH: true,
          firstNameEN: true,
          lastNameEN: true,
          phone: true,
          line: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }

  /**
   * Check if user exists by ID
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      return !!user;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }

  /**
   * Get user's basic info (for displaying name/avatar)
   */
  async getUserBasicInfo(userId: string): Promise<Pick<UserProfileData, 'id' | 'email' | 'firstNameEN' | 'firstNameTH' | 'profileImage'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstNameEN: true,
          firstNameTH: true,
          profileImage: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error fetching user basic info:", error);
      throw new Error("Failed to fetch user basic info");
    }
  }

  /**
   * Update profile image
   */
  async updateProfileImage(userId: string, profileImageUrl: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: profileImageUrl },
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw new Error("Failed to update profile image");
    }
  }
}

export default new UserDataService();