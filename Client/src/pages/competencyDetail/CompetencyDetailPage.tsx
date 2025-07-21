/**
 * @fileoverview CompetencyDetailPage component for displaying detailed information
 * about SFIA and TPQI competency frameworks with interactive features.
 *
 * This component provides:
 * - Dynamic competency data fetching based on framework type
 * - Error handling and retry mechanisms
 * - Interactive actions (bookmark, favorite, share, etc.)
 * - Responsive design with animations
 * - Professional loading and error states
 *
 * @author Siriwat Chairak
 * @version 2.1.0
 * @since 2025-07-20
 */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import Layout from "@Layouts/Layout";
import {
  useSfiaSkillDetail,
  useTpqiUnitDetail,
} from "./hooks/useCompetencyDetail";
import { useCompetencyDetailError } from "./hooks/useCompetencyDetailError";
import { useAnimationVariants } from "./hooks/useAnimationVariants";
import { useCompetencyActions } from "./hooks/useCompetencyActions";
import { getFrameworkIcon, getFrameworkColor } from "./utils/frameworkUtils";
import InvalidUrl from "./components/states/InvalidUrl";
import ErrorState from "./components/states/ErrorState";
import LoadingState from "./components/states/LoadingState";
import NoDataState from "./components/states/NoDataState";
import PageHeader from "./components/layouts/PageHeader";
import SfiaSection from "./components/sfia/SfiaSection";
import TpqiSection from "./components/tpqi/TpqiSection";
import PageFooter from "./components/layouts/PageFooter";
import FloatingTooltip from "./components/ui/FloatingTooltip";
import OptimizedBackgroundDecor from "./components/layouts/OptimizedBackgroundDecor";

/**
 * CompetencyDetailPage - A comprehensive detail page for competency frameworks
 *
 * This component handles the display of detailed competency information for both
 * SFIA (Skills Framework for the Information Age) and TPQI frameworks. It provides
 * a rich user interface with loading states, error handling, and interactive features.
 *
 * @component
 * @example
 * // Usage in routing
 * <Route path="/competency/:source/:id" component={CompetencyDetailPage} />
 *
 * // URL examples:
 * // /competency/sfia/123 - Display SFIA competency with ID 123
 * // /competency/tpqi/456 - Display TPQI unit with ID 456
 *
 * @returns {JSX.Element} The rendered competency detail page
 *
 * @throws {Error} When source parameter is not 'sfia' or 'tpqi'
 * @throws {Error} When id parameter is missing or invalid
 *
 * @see {@link useSfiaSkillDetail} For SFIA data fetching
 * @see {@link useTpqiUnitDetail} For TPQI data fetching
 * @see {@link useCompetencyActions} For interactive actions
 *
 * @public
 */

const CompetencyDetailPage: React.FC = () => {
  // Navigation and routing
  // React Router navigation function
  const navigate = useNavigate();

  /**
   * URL parameters extraction from the route
   * @type {{ source: "sfia" | "tpqi"; id: string }}
   */
  const { source, id } = useParams<{ source: "sfia" | "tpqi"; id: string }>();

  /**
   * Counter for tracking retry attempts when data fetching fails
   * @type {number}
   */
  const [retryCount, setRetryCount] = useState(0);

  // Animation variants for Framer Motion
  /**
   * Animation variants for Framer Motion components
   * @see {@link useAnimationVariants}
   */
  const { containerVariants, itemVariants } = useAnimationVariants();

  /**
   * Error management utility for competency detail operations
   * @see {@link useCompetencyDetailError}
   */
  const { addError, clearErrors } = useCompetencyDetailError();

  // Data fetching hooks with comfiguration
  /**
   * SFIA competency data fetching hook with caching and retry logic
   * Configuration:
   * - cacheDuration: 5 minutes (300,000 ms)
   * - maxRetries: 3 attempts
   * - autoRetryOnNetworkError: enabled
   *
   * @see {@link useSfiaSkillDetail}
   */
  const sfiaHook = useSfiaSkillDetail({
    cacheDuration: 5 * 60 * 1000,
    maxRetries: 3,
    autoRetryOnNetworkError: true,
  });

  /**
   * TPQI competency data fetching hooks with caching and retry logic
   * Configuration:
   * - cacheDuration: 5 minutes (300,000 ms)
   * - maxRetries: 3 attempts
   * - autoRetryOnNetworkError: enabled
   *
   * @see {@link useTpqiUnitDetail}
   */
  const tpqiHook = useTpqiUnitDetail({
    cacheDuration: 5 * 60 * 1000,
    maxRetries: 3,
    autoRetryOnNetworkError: true,
  });

  /**
   * Selects the appropriate data fetching hook based on the framework source
   * This allows for polymorphic behavior while maintaining type safety
   *
   * @type { typeof sfiaHook | typeof tpqiHook }
   */
  const currentHook = source === "sfia" ? sfiaHook : tpqiHook;

  /**
   * Destructures loading state, error, last fetched time, and reset function
   * from the currently selected data fetching hook
   *
   * @type { boolean } loading - Indicates if data is being fetched
   * @type { Error | null } error - Error object if fetching failed
   * @type { Date | null } lastFetched - Timestamp of the last successful fetch
   * @type { Function } resetState - Function to reset the hook state
   */
  const { loading, error, lastFetched, resetState } = currentHook;

  /**
   * Memoized competency data retrieval with type-safe framework switching
   *
   * This memoization prevents unnecessary re-renders when dependencies haven't changed.
   * The data structure varies between SFIA and TPQI frameworks:
   * - SFIA: Contains skill details with competency information
   * - TPQI: Contains unit-code details with competency information
   *
   * @return { object | null } The competency data object or null if not available
   * @memoized Recalculates only when `source`, `sfiaHook.skillDetail`, or `tpqiHook.unitDetail` change
   */
  const competencyData = useMemo(() => {
    if (source === "sfia") {
      return sfiaHook.skillDetail;
    } else if (source === "tpqi") {
      return tpqiHook.unitDetail;
    }
    return null;
  }, [source, sfiaHook.skillDetail, tpqiHook.unitDetail]);

  /**
   * Memoized competency title based on the framework source
   *
   * This ensures the title is dynamically generated based on the competency data
   * or defaults to a generic title if not available.
   *
   * @return { string } The competency title for display in the header
   * @memoized Recalculates only when `competencyData` or `source` changes
   */
  const competencyTitle = useMemo(
    () =>
      competencyData?.competency?.competency_name ??
      `${source?.toUpperCase()} Competency`,
    [competencyData?.competency?.competency_name, source]
  );

  /**
   * Memoized quick navigation items based on the framework source
   *
   * This provides a dynamic list of navigation links for quick access to different sections
   * of the competency detail page, tailored to the specific framework.
   *
   * @return { Array<{ label: string; href: string }> } The list of quick navigation items
   * @memoized Recalculates only when `source` changes
   */
  const quickNavItems = useMemo(() => {
    if (source === "sfia") {
      return [
        { label: "Overview", href: "#overview" },
        { label: "Skill Levels", href: "#skills" },
      ];
    } else if (source === "tpqi") {
      return [
        { label: "Skills", href: "#skills" },
        { label: "Knowledge", href: "#knowledge" },
        { label: "Occupational", href: "#occupational" },
      ];
    }
    return [];
  }, [source]);

  /**
   * Memoized framework icon and color retrieval functions
   *
   * These functions provide the appropriate icon and color for the competency framework
   * based on the source type, ensuring consistent UI representation.
   *
   * @return { Function } Function to get the framework icon
   * @return { Function } Function to get the framework color
   */
  const {
    isBookmarked,
    isFavorited,
    showTooltip,
    setShowTooltip,
    handleBookmark,
    handleFavorite,
    handleShare,
    handlePrint,
    handleDownload,
  } = useCompetencyActions(source, id, competencyTitle);

  /**
   * Effect hook to fetch competency data when the component mounts
   * or when the source or id parameters change.
   * This ensures that the correct data is fetched based on the URL parameters.
   * @param {Array} dependencies - The effect runs when any of these change:
   *   - source: The framework type ('sfia' or 'tpqi')
   *   - id: The unique identifier for the competency
   *   - retryCount: Incremented on retry attempts to refetch data
   *   - sfiaHook: The SFIA data fetching hook
   *   - tpqiHook: The TPQI data fetching hook
   * @memoized Recalculates only when dependencies change
   */
  useEffect(() => {
    if (source && id) {
      if (source === "sfia") {
        sfiaHook.fetchSkillDetail(id);
      } else if (source === "tpqi") {
        tpqiHook.fetchUnitDetail(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, id, retryCount]);

  /**
   * Effect hook to handle errors by adding them to the error state
   * This ensures that any errors encountered during data fetching are logged
   * and can be displayed to the user.
   *
   * @param {Error | string} error - The error object or message to log
   * @param {string} source - The source of the competency ('sfia' or 'tpqi')
   */
  useEffect(() => {
    if (error) {
      addError({
        message:
          typeof error === "string" ? error : "Failed to fetch competency data",
        source: source ?? "unknown",
      });
    }
  }, [error, addError, source]);

  /**
   * Handles retry functionality for failed competency data fetching operations.
   *
   * This callback function is triggered when the user attempts to retry a failed data fetch operation.
   * It performs a complete reset of the component state and attemps to refetch the competency data
   * based on the current source type.
   *
   * @async
   * @function handleRetry
   *
   * @description
   * The retry process follow these steps:
   * 1. Validates that both `source` and `id` are defined.
   * 2. Increments the `retryCount` state to trigger a refetch.
   * 3. Clears any existing errors to reset the error state.
   * 4. Resets the component state to its initial values.
   * 5. Attempts to refetch the competency data using the appropriate hook based on the `source`.
   * 6. Logs any errors encountered during the retry attempt.
   *
   * @param { void } - This function does not take any parameters.
   * @returns { Promise<void> } - A promise that resolves when the retry operation is successful.
   *
   * @throws { Error } - If the retry operation fails, an error is logged to the console.
   */
  const handleRetry = useCallback(async () => {
    if (!source || !id) return;

    setRetryCount((prev) => prev + 1);
    clearErrors();
    resetState();
    try {
      if (source === "sfia") {
        await sfiaHook.fetchSkillDetail(id);
      } else {
        await tpqiHook.fetchUnitDetail(id);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    }
  }, [clearErrors, resetState, source, id, sfiaHook, tpqiHook]);

  // Validate URL parameters
  if (!source || !id || (source !== "sfia" && source !== "tpqi")) {
    return (
      <Layout>
        <InvalidUrl onGoHome={() => navigate("/home")} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white via-purple-50 to-teal-50 pt-20 overflow-hidden relative">
        <OptimizedBackgroundDecor />
        <div className="relative z-10 px-4 pb-16 md:px-8 lg:px-16 max-w-7xl mx-auto">
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
                  <PageHeader
                    source={source}
                    id={id}
                    competencyTitle={competencyTitle}
                    lastFetched={lastFetched}
                    quickNavItems={quickNavItems}
                    competencyData={competencyData}
                    isBookmarked={isBookmarked}
                    isFavorited={isFavorited}
                    onBack={() => navigate(-1)}
                    onBookmark={handleBookmark}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                    onPrint={handlePrint}
                    onDownload={handleDownload}
                    onTooltip={setShowTooltip}
                    getFrameworkIcon={getFrameworkIcon}
                    getFrameworkColor={getFrameworkColor}
                    itemVariants={itemVariants}
                  />

                  {/* Content Section */}
                  <motion.div variants={itemVariants} className="space-y-8">
                    {source === "sfia" &&
                      "competency" in competencyData &&
                      competencyData.competency && (
                        <SfiaSection competency={competencyData.competency} />
                      )}
                    {source === "tpqi" &&
                      "competency" in competencyData &&
                      competencyData.competency && (
                        <TpqiSection competency={competencyData.competency} />
                      )}
                  </motion.div>

                  <PageFooter
                    source={source}
                    lastFetched={lastFetched}
                    itemVariants={itemVariants}
                  />
                </motion.div>
              )}

              {!loading && !error && !competencyData && lastFetched && (
                <NoDataState
                  source={source}
                  id={id}
                  onGoBack={() => navigate(-1)}
                />
              )}
            </AnimatePresence>
          </LazyMotion>
        </div>

        <FloatingTooltip showTooltip={showTooltip} />
      </div>
    </Layout>
  );
};

export default CompetencyDetailPage;
