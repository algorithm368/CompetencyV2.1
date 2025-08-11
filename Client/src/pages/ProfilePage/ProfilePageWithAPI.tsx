import React, { useState, useEffect, useContext } from "react";
import Layout from "@Layouts/Layout";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";
import AuthContext from "@Contexts/AuthContext";
import profileService, { ProfileFormData } from "@Services/competency/profileService";
import {
  ProfileHeader,
  ProfileAvatar,
  InputField,
  SectionCard,
  FormCard,
  ConfirmationDialog,
  SuccessToast,
  SaveButton,
} from "./Components";
import "./ProfilePage.css";

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  
  // Get the same firstName that ProfileDisplay uses for consistency
  const userFirstName = auth?.user?.firstName || auth?.user?.email?.split("@")[0] || "User";
  
  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    firstNameTh: "",
    lastNameTh: "",
    firstNameEn: "",
    lastNameEn: "",
    lineId: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("บันทึกข้อมูลสำเร็จ!");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsInitialLoading(true);
        const profileData = await profileService.getUserProfile();
        const convertedData = profileService.convertToFormData(profileData);
        setFormData(convertedData);
        
        // Set last updated time
        setLastUpdated(
          new Date(profileData.updatedAt).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error("Error loading user profile:", error);
        setToastMessage("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        // Set default last updated time if loading fails
        setLastUpdated(
          new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (auth?.user) {
      loadUserProfile();
    } else {
      setIsInitialLoading(false);
    }
  }, [auth?.user]);

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const requiredFields = {
      firstNameTh: "กรุณากรอกชื่อ (ไทย)",
      lastNameTh: "กรุณากรอกนามสกุล (ไทย)",
      firstNameEn: "กรุณากรอกชื่อ (อังกฤษ)",
      lastNameEn: "กรุณากรอกนามสกุล (อังกฤษ)",
      phone: "กรุณากรอกหมายเลขโทรศัพท์",
      address: "กรุณากรอกที่อยู่",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field as keyof ProfileFormData].trim()) {
        newErrors[field] = message;
      }
    });

    // Phone validation
    if (formData.phone.trim() && !/^[0-9-+\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setShowDialog(true);
    }
  };

  const confirmSave = async () => {
    setIsLoading(true);
    setShowDialog(false);

    try {
      const updateData = profileService.convertFromFormData(formData);
      const updatedProfile = await profileService.updateUserProfile(updateData);
      
      setToastMessage("บันทึกข้อมูลส่วนตัวสำเร็จ!");
      setShowToast(true);

      // Update timestamp
      setLastUpdated(
        new Date(updatedProfile.updatedAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setToastMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while fetching initial data
  if (isInitialLoading) {
    return (
      <Layout>
        <WhiteTealBackground>
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-teal-700 font-medium">กำลังโหลดข้อมูลโปรไฟล์...</p>
              </div>
            </div>
          </div>
        </WhiteTealBackground>
      </Layout>
    );
  }

  return (
    <Layout>
      <WhiteTealBackground>
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <ProfileHeader lastUpdated={lastUpdated} />

          {/* Main Profile Card */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/30 overflow-hidden">
              {/* Card Header with Avatar */}
              <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 px-8 py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800"></div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 mb-8 lg:mb-0">
                    {/* Avatar */}
                    <ProfileAvatar
                      size="lg"
                      firstName={formData.firstNameTh || formData.firstNameEn || userFirstName}
                    />

                    <div className="text-white text-center lg:text-left">
                      <h2 className="text-3xl lg:text-4xl font-bold pb-3">
                        แก้ไขข้อมูลส่วนบุคคล
                      </h2>
                      <p className="text-white/90 text-lg mb-4">
                        กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-medium">พร้อมแก้ไข</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  {/* Email Section - Left Column */}
                  <div className="lg:col-span-1">
                    <FormCard highlight={true} className="sticky top-8">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                          <i className="fas fa-envelope text-teal-600 mr-3"></i>{" "}
                          ข้อมูลบัญชี
                        </h3>
                        <InputField
                          label="อีเมล"
                          field="email"
                          type="email"
                          value={formData.email}
                          disabled={true}
                          icon="fas fa-envelope text-gray-400"
                          onChange={handleInputChange}
                        />
                      </div>
                    </FormCard>
                  </div>

                  {/* Form Fields - Right Columns */}
                  <div className="lg:col-span-3 space-y-12">
                    {/* Thai Names Section */}
                    <SectionCard
                      icon="fas fa-id-card text-teal-600"
                      title="ชื่อ-นามสกุล (ไทย)"
                      description="กรุณากรอกชื่อ-นามสกุลภาษาไทย"
                      borderColor="border-teal-500"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormCard>
                          <InputField
                            label="ชื่อ (ไทย)"
                            field="firstNameTh"
                            placeholder="กรอกชื่อภาษาไทย"
                            required={true}
                            value={formData.firstNameTh}
                            error={errors.firstNameTh}
                            onChange={handleInputChange}
                          />
                        </FormCard>
                        <FormCard>
                          <InputField
                            label="นามสกุล (ไทย)"
                            field="lastNameTh"
                            placeholder="กรอกนามสกุลภาษาไทย"
                            required={true}
                            value={formData.lastNameTh}
                            error={errors.lastNameTh}
                            onChange={handleInputChange}
                          />
                        </FormCard>
                      </div>
                    </SectionCard>

                    {/* English Names Section */}
                    <SectionCard
                      icon="fas fa-globe text-blue-600"
                      title="ชื่อ-นามสกุล (อังกฤษ)"
                      description="กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษ"
                      borderColor="border-blue-500"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormCard>
                          <InputField
                            label="First Name"
                            field="firstNameEn"
                            placeholder="Enter your first name"
                            required={true}
                            value={formData.firstNameEn}
                            error={errors.firstNameEn}
                            onChange={handleInputChange}
                          />
                        </FormCard>
                        <FormCard>
                          <InputField
                            label="Last Name"
                            field="lastNameEn"
                            placeholder="Enter your last name"
                            required={true}
                            value={formData.lastNameEn}
                            error={errors.lastNameEn}
                            onChange={handleInputChange}
                          />
                        </FormCard>
                      </div>
                    </SectionCard>

                    {/* Contact Information Section */}
                    <SectionCard
                      icon="fas fa-address-book text-emerald-600"
                      title="ข้อมูลการติดต่อ"
                      description="ข้อมูลสำหรับการติดต่อกลับ"
                      borderColor="border-emerald-500"
                    >
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormCard>
                            <InputField
                              label="Line ID"
                              field="lineId"
                              placeholder="กรอก Line ID (ถ้ามี)"
                              icon="fab fa-line text-green-500"
                              value={formData.lineId}
                              onChange={handleInputChange}
                            />
                          </FormCard>
                          <FormCard>
                            <InputField
                              label="หมายเลขโทรศัพท์"
                              field="phone"
                              type="tel"
                              placeholder="กรอกหมายเลขโทรศัพท์"
                              required={true}
                              icon="fas fa-mobile-alt text-blue-500"
                              value={formData.phone}
                              error={errors.phone}
                              onChange={handleInputChange}
                            />
                          </FormCard>
                        </div>

                        <FormCard>
                          <InputField
                            label="ที่อยู่"
                            field="address"
                            type="textarea"
                            rows={4}
                            placeholder="กรอกที่อยู่ของคุณ"
                            required={true}
                            icon="fas fa-map-marker-alt text-red-500"
                            value={formData.address}
                            error={errors.address}
                            onChange={handleInputChange}
                          />
                        </FormCard>
                      </div>
                    </SectionCard>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <SaveButton
                    onClick={handleSave}
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </WhiteTealBackground>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={confirmSave}
        title="ยืนยันการบันทึก"
        message="คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลส่วนบุคคลนี้ใช่หรือไม่?"
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </Layout>
  );
};

export default ProfilePage;
