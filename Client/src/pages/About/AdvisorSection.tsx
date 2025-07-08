import React, { useEffect, useRef, useState } from "react";

import AdvisorIMG from "../../assets/AboutPage/Advisor.jpeg";

// Custom Hook for Intersection Observer
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isInView];
};

const AdvisorSection = () => {
  const [headerRef, headerInView] = useInView(0.1);
  const [cardRef, cardInView] = useInView(0.1);

  return (
    <section
      id="advisor-section"
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-teal-50 to-white w-full py-20 overflow-hidden"
    >
      {/* Decorative elements with subtle animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-20 right-20 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transform transition-all duration-1000 ${
            headerInView
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent py-6 tracking-tight">
            อาจารย์ที่ปรึกษา
          </h1>
          <div
            className={`w-12 h-px bg-teal-400 mx-auto mb-8 transform transition-all duration-800 ${
              headerInView ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transitionDelay: headerInView ? "400ms" : "0ms" }}
          ></div>
        </div>

        {/* Advisor Card */}
        <div
          ref={cardRef}
          className={`bg-white/90 backdrop-blur-sm border border-teal-200 rounded-2xl p-8 hover:shadow-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-700 group transform ${
            cardInView
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
          style={{
            transitionDelay: cardInView ? "200ms" : "0ms",
          }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <div
              className={`transform transition-all duration-500 ${
                cardInView ? "scale-100 rotate-0" : "scale-0 rotate-12"
              }`}
              style={{
                transitionDelay: cardInView ? "400ms" : "0ms",
              }}
            >
              <img
                src={AdvisorIMG}
                alt="ดร.สุรเดช จิตประไพกุลศาล"
                className="w-48 h-48 rounded-full object-cover mb-6 border-4 border-teal-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Name and Title */}
            <div
              className={`transform transition-all duration-500 mb-8 ${
                cardInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: cardInView ? "600ms" : "0ms",
              }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-teal-800 transition-colors">
                ดร.สุรเดช จิตประไพกุลศาล
              </h2>
              <p className="text-xl text-teal-600 font-medium">
                DR. Suradet Jitprapaikulsarn
              </p>
            </div>

            {/* Affiliation Section */}
            <div
              className={`w-full mb-8 transform transition-all duration-500 ${
                cardInView
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: cardInView ? "800ms" : "0ms",
              }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-teal-700">
                สังกัด
              </h3>
              <div className="space-y-2">
                <a
                  href="https://ecpe.nu.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-600 hover:text-teal-800 hover:underline transition-colors text-lg"
                >
                  ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ (ECPE)
                </a>
                <a
                  href="http://www.eng.nu.ac.th/eng2022/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-600 hover:text-teal-800 hover:underline transition-colors text-lg"
                >
                  คณะวิศวกรรมศาสตร์
                </a>
                <a
                  href="https://www.nu.ac.th/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-600 hover:text-teal-800 hover:underline transition-colors text-lg"
                >
                  มหาวิทยาลัยนเรศวร
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-teal-200 mb-8"></div>

            {/* Contact Information */}
            <div
              className={`w-full transform transition-all duration-500 ${
                cardInView
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: cardInView ? "1000ms" : "0ms",
              }}
            >
              <h3 className="text-xl font-semibold text-teal-700 mb-6 text-center">
                ช่องทางการติดต่อ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-700 text-center">
                    99 หมู่ 9 ตำบลท่าโพธิ์ อำเภอเมือง พิษณุโลก พิษณุโลก 65000
                    ประเทศไทย
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-gray-700">
                    suradet.j@gmail.com / suradet@nu.ac.th
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p className="text-gray-700">
                    Office: 055-96-4391 / Mobile: 089-451-8144
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href="http://tinyurl.com/SJ-appointment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-800 hover:underline transition-colors"
                  >
                    นัดหมาย (Appointment)
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div
              className={`flex justify-center gap-4 mt-8 transform transition-all duration-500 ${
                cardInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: cardInView ? "1200ms" : "0ms",
              }}
            >
              <a
                href="https://www.facebook.com/suradetj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 hover:text-teal-800 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://suradetj.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 hover:text-teal-800 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisorSection;
