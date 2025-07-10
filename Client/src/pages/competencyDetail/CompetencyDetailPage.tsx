import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@Layouts/Layout";
import { 
  FaArrowLeft, 
  FaCode, 
  FaRocket, 
  FaGraduationCap, 
  FaTools, 
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaRedo
} from "react-icons/fa";
import { 
  useSfiaJobDetail, 
  useTpqiUnitDetail 
} from './hooks/useCompetencyDetail';
import { useCompetencyDetailError } from './hooks/useCompetencyDetailError';

/**
 * CompetencyDetailPage - A comprehensive page for displaying detailed competency information
 * 
 * Features:
 * - Beautiful gradient background similar to HomeHeroSection
 * - Responsive design with Framer Motion animations
 * - Error handling with user-friendly messages
 * - Support for both SFIA and TPQI competency frameworks
 * - Retry functionality and caching
 * - Loading states and progress indicators
 */
const CompetencyDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { source, id } = useParams<{ source: 'sfia' | 'tpqi'; id: string }>();
  const [retryCount, setRetryCount] = useState(0);

  // Error handling hook (must be called before any conditional returns)
  const {
    addError,
    clearErrors
  } = useCompetencyDetailError();

  // Specialized hooks based on source (must be called before any conditional returns)
  const sfiaHook = useSfiaJobDetail({
    cacheDuration: 5 * 60 * 1000,
    maxRetries: 3,
    autoRetryOnNetworkError: true,
  });

  const tpqiHook = useTpqiUnitDetail({
    cacheDuration: 5 * 60 * 1000,
    maxRetries: 3,
    autoRetryOnNetworkError: true,
  });

  // Select the appropriate hook based on source
  const currentHook = source === 'sfia' ? sfiaHook : tpqiHook;
  const { loading, error, lastFetched, resetState } = currentHook;

  // Get competency data with memoization
  const competencyData = useMemo(() => {
    if (source === 'sfia') {
      return sfiaHook.jobDetail;
    } else if (source === 'tpqi') {
      return tpqiHook.unitDetail;
    }
    return null;
  }, [source, sfiaHook.jobDetail, tpqiHook.unitDetail]);

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (source && id) {
      if (source === 'sfia') {
        sfiaHook.fetchJobDetail(id);
      } else if (source === 'tpqi') {
        tpqiHook.fetchUnitDetail(id);
      }
    }
  }, [source, id, retryCount]);

  // Error tracking
  useEffect(() => {
    if (error) {
      addError({
        message: typeof error === 'string' ? error : 'Failed to fetch competency data',
        timestamp: new Date(),
        source: source || 'unknown',
        competencyId: id || 'unknown'
      });
    }
  }, [error, addError, source, id]);

  // Validate URL parameters (after all hooks have been called)
  if (!source || !id || (source !== 'sfia' && source !== 'tpqi')) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-25 pt-20 flex items-center justify-center">
          <div className="text-center p-8">
            <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid URL</h1>
            <p className="text-gray-600 mb-6">Please check the competency source and ID.</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle retry
  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    clearErrors();
    resetState();
    
    try {
      if (source === 'sfia') {
        await sfiaHook.fetchJobDetail(id);
      } else {
        await tpqiHook.fetchUnitDetail(id);
      }
    } catch (err) {
      addError(err, source, id);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Helper function to get framework icon
  const getFrameworkIcon = (framework: string) => {
    switch (framework.toLowerCase()) {
      case 'sfia':
        return <FaCode className="w-5 h-5" />;
      case 'tpqi':
        return <FaGraduationCap className="w-5 h-5" />;
      default:
        return <FaTools className="w-5 h-5" />;
    }
  };

  // Helper function to get framework color
  const getFrameworkColor = (framework: string) => {
    switch (framework.toLowerCase()) {
      case 'sfia':
        return 'from-blue-500 to-blue-600';
      case 'tpqi':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-25 pt-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>

        <div className="relative z-10 px-4 pb-16 md:px-8 lg:px-16 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading State
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-96"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-teal-700 text-lg font-medium mt-6">
                  Loading {source?.toUpperCase()} competency details...
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Fetching information for code: {id}
                </p>
              </motion.div>
            ) : error ? (
              // Error State
              <motion.div
                key="error"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto text-center py-16"
              >
                <motion.div variants={itemVariants}>
                  <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-6" />
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-4">
                  Oops! Something went wrong
                </motion.h1>
                
                <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <p className="text-red-700 font-medium mb-2">
                    {typeof error === 'string' ? error : 'An error occurred while loading competency data'}
                  </p>
                  <p className="text-red-600 text-sm">
                    Failed to load {source?.toUpperCase()} competency: {id}
                  </p>
                </motion.div>

                {/* Error recommendations */}
                <motion.div variants={itemVariants}>
                  <h3 className="font-medium text-gray-800 mb-3">What you can try:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 mb-6">
                    {['Check your internet connection', 'Verify the competency code is correct', 'Try again in a few moments'].map((rec, index) => (
                      <li key={`rec-${index}`} className="flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    <FaRedo className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                  
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                  </button>
                </motion.div>

                {/* Debug info for developers */}
                {retryCount > 0 && (
                  <motion.div variants={itemVariants} className="mt-6 text-xs text-gray-500">
                    Retry attempts: {retryCount} | Last error: {new Date().toLocaleTimeString()}
                  </motion.div>
                )}
              </motion.div>
            ) : competencyData ? (
              // Success State
              <motion.div
                key="success"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Back button */}
                <motion.button
                  variants={itemVariants}
                  onClick={() => navigate(-1)}
                  className="flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors group"
                >
                  <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to results
                </motion.button>

                {/* Header section */}
                <motion.header variants={itemVariants} className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* Framework badge */}
                      <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getFrameworkColor(source)} text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg`}>
                        {getFrameworkIcon(source)}
                        <span>{source?.toUpperCase()} Framework</span>
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-3">
                        {competencyData.competency?.competency_name || `${source?.toUpperCase()} Competency`}
                      </h1>

                      {/* Competency ID */}
                      <p className="text-gray-600 text-lg mb-2">
                        <span className="font-medium">Code:</span> {id}
                      </p>

                      {/* Last updated */}
                      {lastFetched && (
                        <p className="text-gray-500 text-sm flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          Last updated: {lastFetched.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Stats card */}
                    <motion.div 
                      variants={itemVariants}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200 shadow-lg min-w-64"
                    >
                      <h3 className="font-semibold text-gray-800 mb-4">Overview</h3>
                      <div className="space-y-3">
                        {source === 'sfia' && 'totalLevels' in competencyData && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Levels:</span>
                              <span className="font-medium text-blue-600">{competencyData.totalLevels}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Skills:</span>
                              <span className="font-medium text-blue-600">{competencyData.totalSkills}</span>
                            </div>
                          </>
                        )}
                        {source === 'tpqi' && 'totalOccupational' in competencyData && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Skills:</span>
                              <span className="font-medium text-green-600">{competencyData.totalSkills}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Knowledge:</span>
                              <span className="font-medium text-green-600">{competencyData.totalKnowledge}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Occupational:</span>
                              <span className="font-medium text-green-600">{competencyData.totalOccupational}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.header>

                {/* Content sections */}
                <div className="space-y-8">
                  {/* Description section */}
                  {competencyData.competency?.overall && (
                    <motion.section variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-teal-100 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaRocket className="w-6 h-6 mr-3 text-teal-600" />
                        Overview
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {competencyData.competency.overall}
                      </p>
                    </motion.section>
                  )}

                  {/* Notes section */}
                  {competencyData.competency?.note && (
                    <motion.section variants={itemVariants} className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaExclamationTriangle className="w-6 h-6 mr-3 text-amber-600" />
                        Important Notes
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {competencyData.competency.note}
                      </p>
                    </motion.section>
                  )}

                  {/* SFIA specific content */}
                  {source === 'sfia' && 'competency' in competencyData && competencyData.competency?.levels && (
                    <motion.section variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaGraduationCap className="w-6 h-6 mr-3 text-blue-600" />
                        Skill Levels
                      </h2>
                      <div className="space-y-6">
                        {competencyData.competency.levels.map((level, index) => (
                          <div key={level.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                {index + 1}
                              </span>
                              {level.level_name}
                            </h3>
                            
                            {level.descriptions && level.descriptions.map((desc) => (
                              <div key={desc.id} className="mb-4">
                                {desc.description_text && (
                                  <p className="text-gray-700 mb-3">{desc.description_text}</p>
                                )}
                                
                                {desc.skills && desc.skills.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Skills:</h4>
                                    <ul className="space-y-1">
                                      {desc.skills.map((skill) => (
                                        <li key={skill.id} className="flex items-start">
                                          <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700">{skill.skill_text}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {/* TPQI specific content */}
                  {source === 'tpqi' && 'competency' in competencyData && (
                    <>
                      {/* Skills section */}
                      {competencyData.competency?.skills && competencyData.competency.skills.length > 0 && (
                        <motion.section variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-green-100 shadow-lg">
                          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaTools className="w-6 h-6 mr-3 text-green-600" />
                            Skills
                          </h2>
                          <div className="grid gap-4 md:grid-cols-2">
                            {competencyData.competency.skills.map((skill) => (
                              <div key={skill.id} className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <FaCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-800">{skill.name_skill}</span>
                              </div>
                            ))}
                          </div>
                        </motion.section>
                      )}

                      {/* Knowledge section */}
                      {competencyData.competency?.knowledge && competencyData.competency.knowledge.length > 0 && (
                        <motion.section variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 shadow-lg">
                          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaGraduationCap className="w-6 h-6 mr-3 text-purple-600" />
                            Knowledge Areas
                          </h2>
                          <div className="grid gap-4 md:grid-cols-2">
                            {competencyData.competency.knowledge.map((knowledge) => (
                              <div key={knowledge.id} className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <FaCheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-800">{knowledge.name_knowledge}</span>
                              </div>
                            ))}
                          </div>
                        </motion.section>
                      )}

                      {/* Occupational areas */}
                      {competencyData.competency?.occupational && competencyData.competency.occupational.length > 0 && (
                        <motion.section variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-lg">
                          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaRocket className="w-6 h-6 mr-3 text-indigo-600" />
                            Occupational Areas
                          </h2>
                          <div className="grid gap-4 md:grid-cols-2">
                            {competencyData.competency.occupational.map((occ) => (
                              <div key={occ.id} className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <FaCheckCircle className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-800">{occ.name_occupational}</span>
                              </div>
                            ))}
                          </div>
                        </motion.section>
                      )}
                    </>
                  )}
                </div>

                {/* Cache info */}
                {lastFetched && (
                  <motion.div 
                    variants={itemVariants}
                    className="mt-12 text-center text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm rounded-xl p-4"
                  >
                    <p>Data cached at {lastFetched.toLocaleString()}</p>
                    <p>Cache expires in {Math.max(0, Math.ceil((300000 - (Date.now() - lastFetched.getTime())) / 60000))} minutes</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // No data state
              <motion.div
                key="nodata"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FaExclamationTriangle className="text-gray-400 text-6xl mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">No Data Found</h1>
                <p className="text-gray-600 mb-6">
                  We couldn't find any information for {source?.toUpperCase()} competency: {id}
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default CompetencyDetailPage;
