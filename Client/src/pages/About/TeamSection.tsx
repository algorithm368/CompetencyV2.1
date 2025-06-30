import React from "react";

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
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "kornkanok@example.com",
        tel: "+66 966751529",
      },
      {
        name: "นาย ธนบดี บุณรักษ์",
        englishName: "Mr. Tanabodee Boonrak",
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "tanabodee@example.com",
        tel: "+66 979343104",
      },
      {
        name: "นางสาว พัณณิตา คำแสน",
        englishName: "Ms. Phannita Khamsaem",
        image: TEMP_IMAGE_URL,
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
        image: TEMP_IMAGE_URL,
        education: "ระดับการศึกษาปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์",
        faculty: "คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร",
        email: "phatnarin@example.com",
        tel: "+66 979464760",
      },
      {
        name: "นางสาว สุกัญญา วันดี",
        englishName: "Ms. Sukanya Wandi",
        image: TEMP_IMAGE_URL,
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

const TeamSection: React.FC<MemberProps> = ({
  name,
  englishName,
  image,
  education,
  faculty,
  email,
  tel,
}) => (
<<<<<<< Updated upstream
  <div className="bg-white/90 backdrop-blur-sm border border-teal-200 rounded-2xl p-6 flex flex-col items-center hover:shadow-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 group h-full">
    <img
      src={image}
      alt={name}
      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-teal-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
    />
    <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center group-hover:text-teal-800 transition-colors">
      {name}
    </h3>
    <p className="text-sm text-teal-600 mb-3 text-center font-medium">
      {englishName}
    </p>
    <p className="text-gray-700 text-center text-sm mb-1 leading-relaxed">
      {education}
    </p>
    <p className="text-gray-700 text-center text-sm mb-4 leading-relaxed">
      {faculty}
    </p>

    <div className="mt-auto space-y-1">
      {email && (
        <p className="text-gray-600 text-xs text-center">
          <span className="text-teal-600 font-medium">Email:</span> {email}
        </p>
      )}
      <p className="text-gray-600 text-xs text-center">
        <span className="text-teal-600 font-medium">Tel:</span> {tel}
      </p>
    </div>
=======
  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 flex flex-col items-center hover:shadow-lg hover:border-cyan-400 transition-all duration-300 group h-full">
    <img
      src={image}
      alt={name}
      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-cyan-400 shadow-md group-hover:scale-105 transition-transform duration-300"
    />
    <h3 className="text-lg font-medium text-cyan-100 mb-1 text-center">
      {name}
    </h3>
    <p className="text-sm text-cyan-300 mb-2 text-center">{englishName}</p>
    <p className="text-slate-200 text-center text-sm mb-1">{education}</p>
    <p className="text-slate-200 text-center text-sm mb-3">{faculty}</p>
    {email && (
      <p className="text-slate-400 text-xs text-center mb-1">
        <span className="text-cyan-300">Email:</span> {email}
      </p>
    )}
    <p className="text-slate-400 text-xs text-center">
      <span className="text-cyan-300">Tel:</span> {tel}
    </p>
>>>>>>> Stashed changes
  </div>
);

const TeamMember: React.FC = () => {
  return (
    <section
      id="team-section"
<<<<<<< Updated upstream
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-teal-50 to-white w-full py-20 overflow-hidden"
    >
      {/* Decorative elements matching Home theme */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
=======
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 w-full py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
>>>>>>> Stashed changes
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 transition-all duration-700 opacity-100 translate-y-0">
<<<<<<< Updated upstream
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent pb-6 tracking-tight">
            ทีมผู้พัฒนา
          </h1>
          <div className="w-12 h-px bg-teal-400 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
            ข้อมูลทีมผู้พัฒนาและผู้มีส่วนร่วมในโครงการนี้
          </p>
        </div>

        {Object.keys(groupedTeams)
          .sort((a, b) => parseInt(b) - parseInt(a)) // Sort by year descending
          .map((year) => (
            <div key={year} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
                ปี {year}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mb-12 rounded-full shadow-sm"></div>

              {groupedTeams[year].map((team, teamIdx) => (
                <div key={teamIdx} className="mb-12">
                  {team.teamName && (
                    <div className="text-center mb-8">
                      <h3 className="text-xl md:text-2xl font-semibold text-teal-700 mb-2">
                        {team.teamName}
                      </h3>
                      <div className="w-8 h-px bg-teal-300 mx-auto"></div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.members.map((member, memberIdx) => (
                      <TeamSection key={memberIdx} {...member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
=======
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight pt-10">
            ทีมผู้พัฒนา
          </h1>
          <div className="mb-16">
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
              ข้อมูลทีมผู้พัฒนาและผู้มีส่วนร่วมในโครงการนี้
            </p>
          </div>

          {Object.keys(groupedTeams)
            .sort((a, b) => parseInt(b) - parseInt(a)) // Sort by year descending
            .map((year) => (
              <div key={year} className="mb-16">
                <h2 className="text-3xl font-semibold text-cyan-200 mb-2 text-center">
                  ปี {year}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-8 rounded-full"></div>

                {groupedTeams[year].map((team, teamIdx) => (
                  <div key={teamIdx} className="mb-12">
                    {team.teamName && (
                      <h3 className="text-2xl font-medium text-cyan-100 mb-6 text-center">
                        {team.teamName}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {team.members.map((member, memberIdx) => (
                        <TeamSection key={memberIdx} {...member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
>>>>>>> Stashed changes
      </div>
    </section>
  );
};

export default TeamMember;
