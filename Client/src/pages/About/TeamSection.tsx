import React, { useEffect, useRef, useState } from "react";

import PhatnarinIMG from "../../assets/AboutPage/Phatnarin.png"
import SukanyaIMG from "../../assets/AboutPage/Sukanya.png"
import TanabodeeIMG from "../../assets/AboutPage/Tanabodee.png"
import KornkanokIMG from "../../assets/AboutPage/Kornkanok.png"
import PhannitaIMG from "../../assets/AboutPage/Phannita.png";

const TEMP_IMAGE_URL =
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80";



interface MemberProps {
  name: string;
  englishName: string;
  image: string;
  education: string;
  faculty: string;
  email?: string;
  tel: string;
}

interface Team {
  teamName?: string;
  teamYear: string;
  members: MemberProps[];
}

const teams: Team[] = [
  {
    teamName: "Team SFIA",
    teamYear: "2024",
    members: [
      {
        name: "นางสาว กรกนก รินพล",
        englishName: "Ms. Kornkanok Rinphon",
        image: KornkanokIMG,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "kornkanok@example.com",
        tel: "+66 966751529",
      },
      {
        name: "นาย ธนบดี บุณรักษ์",
        englishName: "Mr. Tanabodee Boonrak",
        image: TanabodeeIMG,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "tanabodee@example.com",
        tel: "+66 979343104",
      },
      {
        name: "นางสาว พัณณิตา คำแสน",
        englishName: "Ms. Phannita Khamsaem",
        image: PhannitaIMG,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "phannita.forwork16@gmail.com",
        tel: "+66 618267404",
      },
    ],
  },
  {
    teamName: "Team TPQI",
    teamYear: "2024",
    members: [
      {
        name: "นางสาว ภัทร์นรินทร์ แซ่ว่าง",
        englishName: "Ms. Phatnarin Saewang",
        image: PhatnarinIMG,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "phatnarin@example.com",
        tel: "+66 979464760",
      },
      {
        name: "นางสาว สุกัญญา วันดี",
        englishName: "Ms. Sukanya Wandi",
        image: SukanyaIMG,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "sukanyawandi@gmail.com",
        tel: "+66 655297192",
      },
    ],
  },
  {
    teamName: "Team Current",
    teamYear: "2025",
    members: [
      {
        name: "นาย จีรพัฒน์ ขยายเสียง",
        englishName: "Mr. Jeerapat Kahyaisiang",
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "jeerapat5870@gmail.com",
        tel: "+66 656089783",
      },
      {
        name: "นาย ณัฎฐภัทร ใจเชื้อ",
        englishName: "Mr. Natthaphat Jaichue",
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "natthaphat@example.com",
        tel: "+66 987654321",
      },
      {
        name: "นาย สิริวัฒน์ ไชยรักษ์",
        englishName: "Mr. Siriwat Chairak",
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "siriwat@example.com",
        tel: "+66 912345678",
      },
    ],
  },
];

const groupedTeams = teams.reduce((acc: Record<string, Team[]>, team) => {
  if (!acc[team.teamYear]) acc[team.teamYear] = [];
  acc[team.teamYear].push(team);
  return acc;
}, {} as Record<string, Team[]>);

// Custom Hook for Intersection Observer
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isInView] as const;
};

const TeamSection: React.FC<MemberProps & { delay?: number }> = ({
  name,
  englishName,
  image,
  education,
  faculty,
  email,
  tel,
  delay = 0,
}) => {
  const [ref, isInView] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`bg-white/90 backdrop-blur-sm border border-teal-200 rounded-2xl p-4 flex flex-col items-center hover:shadow-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-700 group h-full transform ${
        isInView
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
      style={{
        transitionDelay: isInView ? `${delay}ms` : "0ms",
      }}
    >
      <div
        className={`transform transition-all duration-500 ${
          isInView ? "scale-100 rotate-0" : "scale-0 rotate-12"
        }`}
        style={{
          transitionDelay: isInView ? `${delay + 200}ms` : "0ms",
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full object-cover mb-3 border-3 border-teal-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div
        className={`transform transition-all duration-500 ${
          isInView ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: isInView ? `${delay + 300}ms` : "0ms",
        }}
      >
        <h3 className="text-base font-semibold text-gray-900 mb-1 text-center group-hover:text-teal-800 transition-colors">
          {name}
        </h3>
      </div>

      <div
        className={`transform transition-all duration-500 ${
          isInView ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: isInView ? `${delay + 400}ms` : "0ms",
        }}
      >
        <p className="text-sm text-teal-600 mb-2 text-center font-medium">
          {englishName}
        </p>
      </div>

      <div
        className={`transform transition-all duration-500 ${
          isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{
          transitionDelay: isInView ? `${delay + 500}ms` : "0ms",
        }}
      >
        <p className="text-gray-700 text-center text-sm mb-1 leading-snug">
          {education}
        </p>
        <p className="text-gray-700 text-center text-sm mb-3 leading-snug">
          {faculty}
        </p>
      </div>

      <div
        className={`mt-auto space-y-0.5 transform transition-all duration-500 ${
          isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{
          transitionDelay: isInView ? `${delay + 600}ms` : "0ms",
        }}
      >
        {email && (
          <p className="text-gray-600 text-xs text-center">
            <span className="text-teal-600 font-medium">Email:</span> {email}
          </p>
        )}
        <p className="text-gray-600 text-xs text-center">
          <span className="text-teal-600 font-medium">Tel:</span> {tel}
        </p>
      </div>
    </div>
  );
};

const AnimatedTitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const [ref, isInView] = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-800 ${
        isInView
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-6 opacity-0 scale-95"
      }`}
      style={{
        transitionDelay: isInView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

const AnimatedDivider: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const [ref, isInView] = useInView(0.3);

  return (
    <div
      ref={ref}
      className={`w-16 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-12 rounded-full shadow-sm transform transition-all duration-600 ${
        isInView ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
      }`}
      style={{
        transitionDelay: isInView ? `${delay}ms` : "0ms",
      }}
    />
  );
};

const TeamMember: React.FC = () => {
  const [headerRef, headerInView] = useInView(0.1);

  return (
    <section
      id="team-section"
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transform transition-all duration-1000 ${
            headerInView
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent pb-6 tracking-tight">
            ทีมผู้พัฒนา
          </h1>
          <div
            className={`w-12 h-px bg-teal-400 mx-auto mb-8 transform transition-all duration-800 ${
              headerInView ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transitionDelay: headerInView ? "400ms" : "0ms" }}
          ></div>
          <p
            className={`text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium transform transition-all duration-800 ${
              headerInView
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: headerInView ? "600ms" : "0ms" }}
          >
            ข้อมูลทีมผู้พัฒนาและผู้มีส่วนร่วมในโครงการนี้
          </p>
        </div>

        {Object.keys(groupedTeams)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map((year, yearIndex) => (
            <div key={year} className="mb-16">
              <AnimatedTitle delay={yearIndex * 100}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
                  ปี {year}
                </h2>
              </AnimatedTitle>

              <AnimatedDivider delay={yearIndex * 100 + 200} />

              {groupedTeams[year].map((team, teamIndex) => (
                <div
                  key={`${team.teamName ?? "team"}-${team.teamYear}`}
                  className="mb-12"
                >
                  {team.teamName && (
                    <AnimatedTitle
                      delay={yearIndex * 100 + teamIndex * 50 + 300}
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-teal-700 mb-2">
                          {team.teamName}
                        </h3>
                        <div className="w-8 h-px bg-teal-300 mx-auto"></div>
                      </div>
                    </AnimatedTitle>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.members.map((member, memberIndex) => (
                      <TeamSection
                        key={member.email ?? member.tel}
                        {...member}
                        delay={memberIndex * 150}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
};

export default TeamMember;
