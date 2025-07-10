import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import Layout from "@Layouts/Layout";
import { 
  FaCode, 
  FaGraduationCap, 
  FaTools, 
  FaClock,
} from "react-icons/fa";
import { 
  useSfiaJobDetail, 
  useTpqiUnitDetail 
} from './hooks/useCompetencyDetail';
import { useCompetencyDetailError } from './hooks/useCompetencyDetailError';
import InvalidUrl from "./components/InvalidUrl";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import NoDataState from "./components/NoDataState";
import BackButton from "./components/BackButton";
import FrameworkBadge from "./components/FrameworkBadge";
import StatsCard from "./components/StatsCard";
import SfiaSection from "./components/SfiaSection";
import TpqiSection from "./components/TpqiSection";
import CacheInfo from "./components/CacheInfo";

// Animation variants (memoized outside component to avoid recreation)
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

// Helper functions (memoized outside component)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, id, retryCount]); // removed sfiaHook, tpqiHook from deps to avoid unnecessary reruns

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

  // --- Move hooks above early return ---
  const handleRetry = useCallback(async () => {
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
  }, [addError, clearErrors, resetState, source, id, sfiaHook, tpqiHook]);

  const BackgroundDecor = React.useMemo(() => (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full blur-xl opacity-30" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full blur-xl opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full blur-xl opacity-40" />
    </div>
  ), []);
  // --- End move ---

  // Validate URL parameters (after all hooks have been called)
  if (!source || !id || (source !== 'sfia' && source !== 'tpqi')) {
    return (
      <Layout>
        <InvalidUrl onGoHome={() => navigate('/home')} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-25 pt-20 overflow-hidden">
        {BackgroundDecor}
        <div className="relative z-10 px-4 pb-16 md:px-8 lg:px-16 max-w-6xl mx-auto">
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-96"
                >
                  <LoadingState source={source} id={id} />
                </motion.div>
              )}
              {!loading && error && (
                <ErrorState
                  error={error}
                  source={source}
                  id={id}
                  retryCount={retryCount}
                  onRetry={handleRetry}
                  onGoBack={() => navigate(-1)}
                />
              )}
              {!loading && !error && competencyData && (
                <motion.div
                  key="success"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <BackButton onClick={() => navigate(-1)} />
                  <motion.header variants={itemVariants} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <FrameworkBadge framework={source} getFrameworkIcon={getFrameworkIcon} getFrameworkColor={getFrameworkColor} />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-3">
                          {competencyData.competency?.competency_name || `${source?.toUpperCase()} Competency`}
                        </h1>
                        <p className="text-gray-600 text-lg mb-2">
                          <span className="font-medium">Code:</span> {id}
                        </p>
                        {lastFetched && (
                          <p className="text-gray-500 text-sm flex items-center">
                            <FaClock className="w-4 h-4 mr-1" />
                            Last updated: {lastFetched.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <motion.div 
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200 shadow-lg min-w-64"
                      >
                        <StatsCard source={source} competencyData={competencyData} />
                      </motion.div>
                    </div>
                  </motion.header>
                  <div className="space-y-8">
                    {source === 'sfia' && 'competency' in competencyData && competencyData.competency && (
                      <SfiaSection competency={competencyData.competency} />
                    )}
                    {source === 'tpqi' && 'competency' in competencyData && competencyData.competency && (
                      <TpqiSection competency={competencyData.competency} />
                    )}
                  </div>
                  {lastFetched && <CacheInfo lastFetched={lastFetched} />}
                </motion.div>
              )}
              {!loading && !error && !competencyData && (
                <NoDataState source={source} id={id} onGoBack={() => navigate(-1)} />
              )}
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </Layout>
  );
};

export default CompetencyDetailPage;
