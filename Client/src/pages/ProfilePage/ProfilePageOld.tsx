import React, { useState, useEffect } from "react";
import Layout from "@Layouts/Layout";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";
import {
  ProfileHeader,
  ProfileAvatar,
  InputField,
  SectionCard,
  FormCard,
  ConfirmationDialog,
  SuccessToast,
  SaveButton
} from "./Components";

const ProfilePahe = () => {
  const [formData, setFormData] = useState({
    email: "user@example.com",
    firstNameTh: "",
    lastNameTh: "",
    firstNameEn: "",
    lastNameEn: "",
    lineId: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLastUpdated(
      new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  const handleInputChange = (field) => (e) => {
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
    const newErrors = {};

    const requiredFields = {
      firstNameTh: "กรุณากรอกชื่อ (ไทย)",
      lastNameTh: "กรุณากรอกนามสกุล (ไทย)",
      firstNameEn: "กรุณากรอกชื่อ (อังกฤษ)",
      lastNameEn: "กรุณากรอกนามสกุล (อังกฤษ)",
      phone: "กรุณากรอกหมายเลขโทรศัพท์",
      address: "กรุณากรอกที่อยู่",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field].trim()) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Saving profile data:", formData);
      setShowToast(true);

      // Update timestamp
      setLastUpdated(
        new Date().toLocaleDateString("th-TH", {
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
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 px-8 py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/95 to-blue-600/95"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 mb-8 lg:mb-0">
                    {/* Avatar */}
                    <ProfileAvatar size="lg" />
                    
                    <div className="text-white text-center lg:text-left">
                      <h2 className="text-3xl lg:text-4xl font-bold mb-3">แก้ไขข้อมูลส่วนบุคคล</h2>
                      <p className="text-white/90 text-lg mb-4">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
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
        message="บันทึกข้อมูลสำเร็จ!"
        onClose={() => setShowToast(false)}
      />
    </Layout>
  );
};

export default ProfilePahe;

  const SectionHeader = ({ icon, title, description, borderColor }) => (
    <div className={`border-l-4 ${borderColor} pl-4`}>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <i className={`${icon} mr-2`}></i>
        {title}
        <span className="text-red-500 ml-1">*</span>
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <Layout>
      <WhiteTealBackground>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-6 py-5 tracking-tight">
              ข้อมูลส่วนบุคคล
            </h1>
            <div className="w-12 h-px bg-teal-400 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
              จัดการข้อมูลส่วนตัวของคุณเพื่อประสบการณ์การใช้งานที่ดีที่สุด
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
              {/* Card Header with Gradient */}
              <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 px-8 py-12">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/90 to-blue-600/90"></div>
                <div className="relative flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                    {/* Avatar Section */}
                    <div className="relative">
                      <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                        <i className="fas fa-user text-4xl text-white"></i>
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/90 hover:bg-white text-teal-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
                        <i className="fas fa-camera text-sm"></i>
                      </button>
                    </div>
                    
                    <div className="text-white text-center lg:text-left">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2">แก้ไขข้อมูลส่วนบุคคล</h2>
                      <p className="text-white/80 text-lg">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
                    </div>
                  </div>
                  
                  <div className="text-white/70 text-sm">
                    <i className="fas fa-clock mr-2"></i>
                    อัพเดตล่าสุด: <span className="font-medium text-white">{lastUpdated}</span>
                  </div>
                </div>
              </div>

              </div>

              {/* Form Content */}
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Email Section - Left Column */}
                  <div className="lg:col-span-1">
                    <div className="space-y-6">
                      <div className="text-center lg:text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center lg:justify-start">
                          <i className="fas fa-envelope text-teal-600 mr-3"></i>
                          ข้อมูลบัญชี
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                          <InputField
                            label="อีเมล"
                            field="email"
                            type="email"
                            disabled={true}
                            icon="fas fa-envelope text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields - Right Columns */}
                  <div className="lg:col-span-2 space-y-12">
                    {/* Thai Names Section */}
                    <div className="space-y-6">
                      <SectionHeader
                        icon="fas fa-id-card text-teal-600"
                        title="ชื่อ-นามสกุล (ไทย)"
                        description="กรุณากรอกชื่อ-นามสกุลภาษาไทย"
                        borderColor="border-teal-500"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <InputField
                            label="ชื่อ (ไทย)"
                            field="firstNameTh"
                            placeholder="กรอกชื่อภาษาไทย"
                            required={true}
                          />
                        </div>
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <InputField
                            label="นามสกุล (ไทย)"
                            field="lastNameTh"
                            placeholder="กรอกนามสกุลภาษาไทย"
                            required={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* English Names Section */}
                    <div className="space-y-6">
                      <SectionHeader
                        icon="fas fa-globe text-blue-600"
                        title="ชื่อ-นามสกุล (อังกฤษ)"
                        description="กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษ"
                        borderColor="border-blue-500"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <InputField
                            label="First Name"
                            field="firstNameEn"
                            placeholder="Enter your first name"
                            required={true}
                          />
                        </div>
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <InputField
                            label="Last Name"
                            field="lastNameEn"
                            placeholder="Enter your last name"
                            required={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                      <SectionHeader
                        icon="fas fa-address-book text-emerald-600"
                        title="ข้อมูลการติดต่อ"
                        description="ข้อมูลสำหรับการติดต่อกลับ"
                        borderColor="border-emerald-500"
                      />

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <InputField
                              label="Line ID"
                              field="lineId"
                              placeholder="กรอก Line ID (ถ้ามี)"
                              icon="fab fa-line text-green-500"
                            />
                          </div>
                          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <InputField
                              label="หมายเลขโทรศัพท์"
                              field="phone"
                              type="tel"
                              placeholder="กรอกหมายเลขโทรศัพท์"
                              required={true}
                              icon="fas fa-mobile-alt text-blue-500"
                            />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                          <InputField
                            label="ที่อยู่"
                            field="address"
                            type="textarea"
                            rows={4}
                            placeholder="กรอกที่อยู่ของคุณ"
                            required={true}
                            icon="fas fa-map-marker-alt text-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex justify-center">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                    >
                      <i className="fas fa-save mr-3"></i> บันทึกการเปลี่ยนแปลง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </WhiteTealBackground>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-transform duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    ยืนยันการบันทึก
                  </h3>
                  <p className="text-sm text-gray-600">
                    กรุณาตรวจสอบข้อมูลให้ถูกต้อง
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-8 text-lg">
                คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลส่วนบุคคลนี้ใช่หรือไม่?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg"
                >
                  <i className="fas fa-times mr-2"></i>ยกเลิก
                </button>
                <button
                  onClick={confirmSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-check mr-2"></i>ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div
        className={`fixed top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform transition-transform duration-300 z-50 ${
          showToast ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center space-x-3">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-semibold text-lg">บันทึกข้อมูลสำเร็จ!</span>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePahe;
