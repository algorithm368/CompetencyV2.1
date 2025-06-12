import React, { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaGithub, FaLinkedin } from "react-icons/fa";

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

      {/* 3. Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[380px]">
          <div className="md:w-5/12 w-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center p-6">
            <div className="text-center text-blue-800 dark:text-blue-200">
              <h2 className="text-2xl font-bold mb-2">Competency Database</h2>
              <p className="text-sm opacity-80">Accurate Competency Assessment System</p>
            </div>
          </div>

          <div className="md:w-7/12 w-full flex items-center justify-center p-6">
            <div className="w-full max-w-xs">
              <h3 className="text-2xl font-bold text-center mb-4 dark:text-gray-100">Sign In</h3>
              <div className="flex justify-center mb-4">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <div className="w-[300px]">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      shape="rectangular"
                      width="300"
                      useOneTap={false}
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>

              <button
                onClick={handleGitHubLogin}
                className="flex items-center justify-center w-[300px] mb-3 px-4 py-2 border border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition mx-auto"
              >
                <FaGithub className="h-5 w-5 mr-2" />
                <span className="text-sm">Sign in with GitHub</span>
              </button>

              <button
                onClick={handleLinkedInLogin}
                className="flex items-center justify-center w-[300px] px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-700 transition mx-auto"
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
