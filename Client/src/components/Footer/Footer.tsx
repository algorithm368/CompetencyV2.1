import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white text-sm w-full py-6 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-4">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
          {/* Left: Brand */}
          <div className="text-lg font-semibold">
            <Link
              to="/"
              className="no-underline hover:underline"
            >
              Competency
            </Link>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-center">
            <Link
              to="/about"
              className="no-underline hover:underline"
            >
              About
            </Link>
            <Link
              to="/reference"
              className="no-underline hover:underline"
            >
              Reference
            </Link>
            <a
              href="https://www.tpqi.go.th/th/standard/rQNWewEb3Q"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:underline"
            >
              TPQI Standard
            </a>
            <a
              href="https://sfia-online.org/en"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:underline"
            >
              SFIA Online
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="text-left">
          <a
            href="https://ecpe.nu.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline block"
          >
            © {currentYear} Department of Electrical and Computer Engineering, Faculty of Engineering, Naresuan University
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
