import React, { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface LoginProps {
  open: boolean;
  onClose: () => void;
  handleLogin: (response: CredentialResponse | { credential: string }) => void;
}

const GOOGLE_CLIENT_ID = "170385751378-bbtp2rf09iorhsustgqors4r1tc7hf6n.apps.googleusercontent.com";

const Login: React.FC<LoginProps> = ({ open, onClose, handleLogin }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) return null;

  const handleGoogleSuccess = (response: CredentialResponse) => {
    handleLogin(response);
    onClose();
  };

  const handleGoogleError = () => {
    console.error("Google login error");
  };

  const handleGitHubLogin = () => {
    handleLogin({ credential: "MOCK_GITHUB_TOKEN" });
    onClose();
  };

  const handleLinkedInLogin = () => {
    handleLogin({ credential: "MOCK_LINKEDIN_TOKEN" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        role="presentation"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[380px]">
          <div className="md:w-5/12 w-full bg-blue-100 flex items-center justify-center p-6">
            <div className="text-center text-blue-800 ">
              <h2 className="text-2xl font-bold mb-2">Competency Database</h2>
              <p className="text-sm opacity-80">Accurate Competency Assessment System</p>
            </div>
          </div>

          <div className="md:w-7/12 w-full flex items-center justify-center p-6">
            <div className="w-full max-w-xs">
              <h3 className="text-2xl font-bold text-center mb-4">Sign In</h3>

              <div className="flex justify-center mb-4 relative w-[300px] h-[40px] mx-auto">
                {/* Custom-looking Google button */}
                <div className="absolute inset-0 z-10 flex items-center justify-center border border-gray-600 text-gray-700 rounded-3xl bg-white hover:bg-gray-100 transition cursor-pointer">
                  <FcGoogle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Sign in with Google</span>
                </div>

                {/* Transparent GoogleLogin underlay */}
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <div className="absolute inset-0 opacity-1 z-20 ">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      width="300"
                      useOneTap={false}
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>

              <button
                onClick={handleGitHubLogin}
                className="flex items-center justify-center w-[300px] mb-3 px-4 py-2 border border-gray-600 text-gray-700 rounded-3xl hover:bg-gray-100 transition mx-auto"
              >
                <FaGithub className="h-5 w-5 mr-2" />
                <span className="text-sm">Sign in with GitHub</span>
              </button>

              <button
                onClick={handleLinkedInLogin}
                className="flex items-center justify-center w-[300px] px-4 py-2 border border-gray-700 text-gray-700 rounded-3xl hover:bg-blue-50 transition mx-auto"
              >
                <FaLinkedin className="h-5 w-5 mr-2" />
                <span className="text-sm">Sign in with LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
