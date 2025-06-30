import React, { useState, useEffect } from "react";
import { ExternalLink, Target, User, BarChart3, RefreshCw } from "lucide-react";

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
    <section
      id="about-section"
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-teal-50 to-white w-full py-20 overflow-hidden"
    >
      {/* Decorative elements matching Home theme */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-6 pt-5 tracking-tight">
            เกี่ยวกับพวกเรา
          </h1>
          <div className="w-12 h-px bg-teal-400 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
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
                <div className="bg-white/80 backdrop-blur-sm border border-teal-200 rounded-2xl p-8 hover:bg-teal-50 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-2 mb-3 group-hover:gap-3 transition-all duration-300"
                  >
                    {item.label}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <p className="text-gray-700 leading-relaxed mb-3 text-base">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-500">{item.lastUpdated}</p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              วัตถุประสงค์ของระบบ
            </h2>
            <div className="w-8 h-px bg-teal-400 mx-auto"></div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-800 leading-relaxed text-center">
              ระบบนี้มีเป้าหมายในการช่วยให้บุคคลสามารถประเมินสมรรถนะของตนเองได้อย่างแม่นยำ
              โดยอ้างอิงจากมาตรฐาน{" "}
              <span className="font-semibold text-teal-700">TPQI</span> และ{" "}
              <span className="font-semibold text-teal-700">SFIA</span>{" "}
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              คุณสมบัติของระบบ
            </h2>
            <div className="w-8 h-px bg-teal-400 mx-auto"></div>
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
                  <div className="bg-white/90 backdrop-blur-sm border border-teal-200 rounded-2xl p-8 hover:shadow-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 group h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:from-teal-600 group-hover:to-teal-700 transition-all duration-300 shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight group-hover:text-teal-800 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
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
    </section>
  );
};

export default AboutSection;
