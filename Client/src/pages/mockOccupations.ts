// mockData.ts

// 1. กำหนด SkillType และ OccupationType เหมือนเดิม
export interface SkillType {
  id: number;
  name: string;
  framework: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  levels: string[]; // array ของระดับที่มีให้เลือก
  level: string; // สถานะ “ระดับปัจจุบัน” ของทักษะ (ใช้สำหรับ mock)
}

export interface OccupationType {
  id: number;
  name: string;
  skills: SkillType[];
}

// 2. สร้างชุดข้อมูล mockOccupations (อ้างอิงจากตัวอย่างก่อนหน้า)
export const mockOccupations: OccupationType[] = [
  {
    id: 1,
    name: "Software Developer",
    skills: [
      {
        id: 101,
        name: "Frontend Development",
        framework: "SFIA",
        levels: ["Beginner", "Intermediate", "Advanced"],
        level: "Beginner",
        description: "ทำหน้าที่ออกแบบและพัฒนา UI/UX ของเว็บหรือแอปพลิเคชันโดยใช้ HTML, CSS, JavaScript/TypeScript และ framework เช่น React, Vue หรือ Angular",
        responsibilities: [
          "เขียนโค้ด HTML/CSS/JavaScript ให้ responsive",
          "ใช้งาน React (หรือ Vue/Angular) สร้างคอมโพเนนต์ให้ reusable",
          "เชื่อมต่อกับ API ฝั่งหลังบ้าน (RESTful หรือ GraphQL)",
          "เพิ่มประสิทธิภาพการโหลดหน้าเว็บด้วยเทคนิค Lazy Loading, Code Splitting",
          "ทำงานร่วมกับ UX/UI Designer เพื่อปรับปรุงประสบการณ์ผู้ใช้",
        ],
        requirements: [
          "เข้าใจหลัก HTML5, CSS3, ES6+ เป็นอย่างดี",
          "มีประสบการณ์ใช้งาน React/Vue/Angular อย่างน้อย 1 ปี",
          "รู้จัก Tailwind CSS หรือ CSS-in-JS (เช่น styled-components)",
          "เข้าใจพื้นฐาน Web Performance Optimization",
          "สามารถ debug และแก้ไขปัญหาเบื้องต้นได้ด้วย Chrome DevTools",
        ],
      },
      {
        id: 102,
        name: "Backend Development",
        framework: "SFIA",
        levels: ["Beginner", "Intermediate", "Advanced"],
        level: "Intermediate",
        description: "ดูแลการออกแบบและพัฒนาระบบฝั่งเซิร์ฟเวอร์ เขียน API จัดการฐานข้อมูล และดูแลประสิทธิภาพของระบบที่ส่งข้อมูลให้ frontend",
        responsibilities: [
          "ออกแบบ RESTful API หรือ GraphQL API",
          "ใช้ Node.js/Express (หรือ Python/Django, Ruby on Rails) พัฒนาบริการฝั่งเซิร์ฟเวอร์",
          "ออกแบบโครงสร้างฐานข้อมูล (Relational/NoSQL) เช่น PostgreSQL, MongoDB",
          "ตั้งค่า Authentication & Authorization (เช่น JWT, OAuth)",
          "ดูแล performance และ security ของ API",
        ],
        requirements: [
          "มีประสบการณ์เขียน Node.js/Express (หรือเทคโนโลยี server-side อื่นๆ)",
          "เข้าใจ SQL และการออกแบบฐานข้อมูล Normalization/Denormalization",
          "รู้การทำงานของ RESTful API, HTTP Status Codes, CORS",
          "มีความรู้เบื้องต้นด้าน Security (เช่น XSS, CSRF, SQL Injection)",
          "สามารถใช้ Docker เบื้องต้นในการ containerize แอปได้",
        ],
      },
      {
        id: 103,
        name: "DevOps Basics",
        framework: "SFIA",
        levels: ["Beginner", "Intermediate"],
        level: "Beginner",
        description: "ดูแลกระบวนการ CI/CD, ตั้งค่า Docker/Container, และจัดการสภาพแวดล้อมของเซิร์ฟเวอร์",
        responsibilities: ["เขียน CI/CD pipeline (เช่น GitHub Actions, GitLab CI)", "ตั้งค่า Docker Compose สำหรับ development/environment", "ดูแลการ deploy ระบบขึ้น production", "ตรวจสอบและแก้ไขปัญหาเบื้องต้นของระบบที่ทำงานบน cloud"],
        requirements: ["พื้นฐาน Docker, Kubernetes (optional)", "เข้าใจ Linux Command Line เบื้องต้น", "มีความรู้เรื่อง CI/CD และ Automation Tools", "เคยใช้งาน Cloud Provider เช่น AWS, GCP, Azure (ขั้นต่ำหนึ่งตัว)"],
      },
    ],
  },
  {
    id: 2,
    name: "Data Analyst",
    skills: [
      {
        id: 201,
        name: "Data Wrangling",
        framework: "TPQI",
        levels: ["Beginner", "Intermediate"],
        level: "Intermediate",
        description: "ทำหน้าที่รวบรวมและเตรียมข้อมูลจากหลายแหล่ง เช่น ฐานข้อมูล, CSV, API เพื่อให้สะอาดพร้อมนำไปวิเคราะห์",
        responsibilities: [
          "โหลดข้อมูลจาก MySQL, PostgreSQL หรือไฟล์ CSV/JSON",
          "ใช้ Python (Pandas), R หรือ SQL ทำ Data Cleaning",
          "ตรวจสอบ missing values และ Outliers",
          "แปลงข้อมูลให้อยู่ในรูปแบบที่เหมาะสมสำหรับการวิเคราะห์",
          "ทำ Document ของกระบวนการ ETL เบื้องต้น",
        ],
        requirements: [
          "มีประสบการณ์ใช้งาน Python (Pandas) หรือ R ในการจัดการข้อมูล",
          "เข้าใจ SQL เบื้องต้น เช่น SELECT, JOIN, GROUP BY",
          "รู้จักเทคนิค Data Cleaning, Imputation, Normalization",
          "สามารถเขียนสคริปต์อัตโนมัติ (Automation) ในการทำ ETL",
          "มีความเข้าใจพื้นฐาน Statistical Concepts",
        ],
      },
      {
        id: 202,
        name: "Data Visualization",
        framework: "TPQI",
        levels: ["Beginner", "Intermediate"],
        level: "Beginner",
        description: "สร้างกราฟและ Dashboard เพื่อสื่อสารผลการวิเคราะห์ข้อมูลให้ผู้ใช้งานหรือผู้บริหารเข้าใจได้ง่าย",
        responsibilities: [
          "ใช้เครื่องมือ BI เช่น Tableau, Power BI หรือ Looker สร้าง Dashboard",
          "เขียนโค้ด Python (Matplotlib, Seaborn) หรือ JavaScript (D3.js) สร้าง Visualization",
          "ออกแบบ Chart ที่เหมาะสมกับข้อมูล เช่น Bar, Line, Heatmap, Scatter",
          "ทำ Data Storytelling เพื่อสรุป insight จากข้อมูล",
          "ปรับ Layout ของ Dashboard ให้ตอบโจทย์ UX/UI",
        ],
        requirements: [
          "มีประสบการณ์ใช้งาน Tableau, Power BI หรือเครื่องมือ Visualization อื่น ๆ",
          "รู้หลักการออกแบบ Chart ที่สื่อความหมายชัดเจน (Color, Label, Axis)",
          "สามารถเขียน SQL Query เพื่อดึงข้อมูลมาใช้งาน",
          "มีพื้นฐานการสื่อสารเชิง Data Storytelling",
          "เข้าใจพื้นฐาน Statistical Visualization (เช่น Histogram, Boxplot)",
        ],
      },
      {
        id: 203,
        name: "Statistical Analysis",
        framework: "TPQI",
        levels: ["Intermediate", "Advanced"],
        level: "Intermediate",
        description: "วิเคราะห์เชิงสถิติเพื่อหาความสัมพันธ์และสรุปผลเบื้องต้น ให้เห็น insight ที่สำคัญจากข้อมูล",
        responsibilities: [
          "ใช้ Python (SciPy, Statsmodels) หรือ R ทำการทดสอบสมมติฐาน (Hypothesis Testing)",
          "คำนวณค่า Summary Statistics (เช่น Mean, Median, Std Dev)",
          "สร้างโมเดลเชิงสถิติเบื้องต้น (Linear Regression, Logistic Regression ฯลฯ)",
          "นำเสนอผลลัพธ์ด้วยการเขียนรายงานหรือ Dashboard",
        ],
        requirements: ["เข้าใจพื้นฐาน Probability & Statistics", "มีประสบการณ์ใช้งาน Python หรือ R สำหรับงานสถิติ", "รู้การทำ Hypothesis Testing, p-value, Confidence Interval", "สามารถใช้ SQL เพื่อดึงข้อมูลสำหรับวิเคราะห์"],
      },
    ],
  },
];

// 3. นิยาม interface สำหรับข้อมูล user
export interface UserType {
  id: number;
  name: string;
  occupationId: number; // อ้างอิง mockOccupations[].id
  evidenceUrls: Record<number, string>;
  // key = skill.id, value = URL หลักฐาน ถ้าเป็น "" = ยังไม่ส่งหลักฐาน
}

// 4. สร้างตัวอย่างข้อมูล user สองคน
export const mockUsers: UserType[] = [
  {
    id: 1,
    name: "John Doe",
    occupationId: 1, // Software Developer
    evidenceUrls: {
      101: "https://evidence.example.com/frontend-johndoe", // Frontend Development ทำหลักฐานแล้ว
      102: "", // Backend Development ยังไม่ส่งหลักฐาน
      103: "", // DevOps Basics ยังไม่ส่งหลักฐาน
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    occupationId: 2, // Data Analyst
    evidenceUrls: {
      201: "https://evidence.example.com/wrangling-janesmith", // Data Wrangling ทำหลักฐานแล้ว
      202: "https://evidence.example.com/visualization-janesmith", // Data Visualization ทำหลักฐานแล้ว
      203: "", // Statistical Analysis ยังไม่ส่งหลักฐาน
    },
  },
];
