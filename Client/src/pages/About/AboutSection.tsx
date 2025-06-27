import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Target,
  User,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "ประเมินทักษะตามมาตรฐาน TPQI และ SFIA",
      description:
        "ช่วยวิเคราะห์ศักยภาพของบุคคล และเปรียบเทียบกับเกณฑ์มาตรฐานในสายอาชีพที่เกี่ยวข้อง",
      icon: Target,
    },
    {
      title: "สร้างโปรไฟล์สมรรถนะส่วนบุคคล",
      description:
        "รวบรวมข้อมูลทักษะ ความสามารถ และแฟ้มสะสมผลงาน เพื่อใช้สมัครงานหรือพัฒนาตัวเอง",
      icon: User,
    },
    {
      title: "แสดงผลการวิเคราะห์ด้วยแผนภาพ",
      description:
        "ช่วยให้เห็นจุดแข็ง จุดที่ต้องพัฒนา และแนวทางการพัฒนาทักษะอย่างเป็นระบบ",
      icon: BarChart3,
    },
    {
      title: "รองรับการอัปเดตข้อมูลทักษะและอาชีพ",
      description:
        "สามารถปรับปรุงข้อมูลส่วนตัว และเชื่อมโยงกับมาตรฐานสมรรถนะที่อัปเดตล่าสุด",
      icon: RefreshCw,
    },
  ];

  const standards = [
    {
      label: "TPQI (Thailand Professional Qualification Institute)",
      link: "https://www.tpqi.go.th/th/standard/rQNWewEb3Q",
      description:
        "มาตรฐานสมรรถนะระดับชาติที่ใช้เป็นเกณฑ์วัดความสามารถในแต่ละสาขาอาชีพ",
      lastUpdated: "อัปเดตล่าสุดเมื่อ 5 มกราคม พ.ศ. 2564",
    },
    {
      label: "SFIA (Skills Framework for the Information Age) Version 9",
      link: "https://sfia-online.org",
      description: "มาตรฐานทักษะด้านดิจิทัลและไอทีที่ได้รับการยอมรับทั่วโลก",
      lastUpdated: "เผยแพร่เมื่อเดือนตุลาคม พ.ศ. 2564",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight">
            About Us
          </h1>
          <div className="w-12 h-px bg-blue-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            ระบบนี้ถูกออกแบบมาเพื่อช่วยให้บุคคลสามารถประเมินและพัฒนาทักษะของตนเอง
            <br />
            ตามเกณฑ์มาตรฐานที่ได้รับการยอมรับในระดับประเทศและสากล
          </p>
        </div>

        {/* Standards */}
        <div
          className={`mb-20 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="space-y-8">
            {standards.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 delay-${
                  index * 100 + 300
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 group">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-3 group-hover:gap-3 transition-all duration-300"
                  >
                    {item.label}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-400">{item.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div
          className={`mb-20 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              วัตถุประสงค์ของระบบ
            </h2>
            <div className="w-8 h-px bg-blue-600 mx-auto"></div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              ระบบนี้มีเป้าหมายในการช่วยให้บุคคลสามารถประเมินสมรรถนะของตนเองได้อย่างแม่นยำ
              โดยอ้างอิงจากมาตรฐาน{" "}
              <span className="font-medium text-blue-600">TPQI</span> และ{" "}
              <span className="font-medium text-blue-600">SFIA</span>
              เพื่อสนับสนุนการพัฒนาทักษะให้สอดคล้องกับความต้องการของตลาดแรงงาน
              ทั้งในระดับประเทศและระดับสากล
            </p>
          </div>
        </div>

        {/* Features */}
        <div
          className={`transition-all duration-700 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              คุณสมบัติของระบบ
            </h2>
            <div className="w-8 h-px bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-500 delay-${
                    index * 100 + 700
                  } ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-sm hover:border-blue-300 transition-all duration-300 group h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
