import React, { useState } from 'react';
import { 
  useCompetencyDetail, 
  useSfiaJobDetail, 
  useTpqiUnitDetail 
} from './useCompetencyDetail';
import { useCompetencyDetailError } from './useCompetencyDetailError';

/**
 * Example component demonstrating the usage of competency detail hooks
 */
export const CompetencyDetailExample: React.FC = () => {
  const [jobCode, setJobCode] = useState('');
  const [unitCode, setUnitCode] = useState('');
  
  // Main hook with all features
  const {
    state,
    multipleState,
    fetchSfiaDetail,
    fetchTpqiDetail,
    fetchMultipleDetails,
    clearCache,
    resetState,
    isLoading,
    hasError,
    hasData,
  } = useCompetencyDetail({
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    maxRetries: 3,
    autoRetryOnNetworkError: true,
  });

  // Specialized SFIA hook
  const {
    jobDetail,
    loading: sfiaLoading,
    error: sfiaError,
    fetchJobDetail,
    isInCache: isSfiaInCache,
  } = useSfiaJobDetail();

  // Specialized TPQI hook
  const {
    unitDetail,
    loading: tpqiLoading,
    error: tpqiError,
    fetchUnitDetail,
    isInCache: isTpqiInCache,
  } = useTpqiUnitDetail();

  // Error handling hook
  const {
    validateCompetencyCode,
    getErrorMessage,
    getErrorRecommendations,
    errorHistory,
    addError,
    clearErrors,
  } = useCompetencyDetailError();

  // Example: Fetch SFIA job detail
  const handleFetchSfiaJob = async () => {
    const validation = validateCompetencyCode(jobCode, 'sfia');
    
    if (!validation.isValid) {
      validation.errors.forEach(error => addError(error, 'sfia', jobCode));
      return;
    }

    try {
      await fetchSfiaDetail(jobCode);
    } catch (error) {
      addError(error, 'sfia', jobCode);
    }
  };

  // Example: Fetch TPQI unit detail
  const handleFetchTpqiUnit = async () => {
    const validation = validateCompetencyCode(unitCode, 'tpqi');
    
    if (!validation.isValid) {
      validation.errors.forEach(error => addError(error, 'tpqi', unitCode));
      return;
    }

    try {
      await fetchTpqiDetail(unitCode);
    } catch (error) {
      addError(error, 'tpqi', unitCode);
    }
  };

  // Example: Fetch multiple competencies
  const handleFetchMultiple = async () => {
    const requests = [
      { source: 'sfia' as const, code: 'PROG' },
      { source: 'sfia' as const, code: 'DBAD' },
      { source: 'tpqi' as const, code: 'ICT-LIGW-404B' },
    ];

    try {
      await fetchMultipleDetails(requests);
    } catch (error) {
      addError(error);
    }
  };

  // Example: Use specialized hooks
  const handleFetchWithSpecializedHooks = async () => {
    try {
      await Promise.all([
        fetchJobDetail('ARCH'),
        fetchUnitDetail('ICT-TEST-123')
      ]);
    } catch (error) {
      addError(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Competency Detail Hooks Example</h1>
      
      {/* SFIA Job Detail Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">SFIA Job Detail</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={jobCode}
            onChange={(e) => setJobCode(e.target.value)}
            placeholder="Enter SFIA job code (e.g., PROG)"
            className="px-3 py-2 border rounded flex-1"
          />
          <button
            onClick={handleFetchSfiaJob}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? 'Loading...' : 'Fetch SFIA Job'}
          </button>
          <span className="text-sm text-gray-500 self-center">
            {jobCode && isSfiaInCache(jobCode) ? '(Cached)' : ''}
          </span>
        </div>
        
        {/* SFIA Results */}
        {hasData && state.data && 'competency' in state.data && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium">SFIA Job Details:</h3>
            <p><strong>Name:</strong> {state.data.competency?.competency_name}</p>
            <p><strong>Total Levels:</strong> {state.data.totalLevels}</p>
            <p><strong>Total Skills:</strong> {state.data.totalSkills}</p>
          </div>
        )}
      </div>

      {/* TPQI Unit Detail Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">TPQI Unit Detail</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            placeholder="Enter TPQI unit code (e.g., ICT-LIGW-404B)"
            className="px-3 py-2 border rounded flex-1"
          />
          <button
            onClick={handleFetchTpqiUnit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? 'Loading...' : 'Fetch TPQI Unit'}
          </button>
          <span className="text-sm text-gray-500 self-center">
            {unitCode && isTpqiInCache(unitCode) ? '(Cached)' : ''}
          </span>
        </div>
        
        {/* TPQI Results */}
        {hasData && state.data && 'totalOccupational' in state.data && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium">TPQI Unit Details:</h3>
            <p><strong>Name:</strong> {state.data.competency?.competency_name}</p>
            <p><strong>Skills:</strong> {state.data.totalSkills}</p>
            <p><strong>Knowledge:</strong> {state.data.totalKnowledge}</p>
            <p><strong>Occupational:</strong> {state.data.totalOccupational}</p>
          </div>
        )}
      </div>

      {/* Multiple Fetch Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Multiple Competencies</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleFetchMultiple}
            disabled={multipleState.loading}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
          >
            {multipleState.loading ? 'Loading...' : 'Fetch Multiple (PROG, DBAD, ICT-LIGW-404B)'}
          </button>
          {multipleState.loading && (
            <div className="self-center text-sm text-gray-600">
              Progress: {multipleState.completedRequests}/{multipleState.totalRequests}
            </div>
          )}
        </div>
        
        {/* Multiple Results */}
        {multipleState.results.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Results:</h3>
            {multipleState.results.map((result) => (
              <div 
                key={`${result.source}-${result.code}`}
                className={`p-2 rounded ${
                  result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}
              >
                <span className="font-medium">{result.source.toUpperCase()} {result.code}:</span>
                {result.data ? (
                  <span className="ml-2 text-green-600">✓ Success</span>
                ) : (
                  <span className="ml-2 text-red-600">✗ {result.error?.message}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialized Hooks Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Specialized Hooks</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleFetchWithSpecializedHooks}
            disabled={sfiaLoading || tpqiLoading}
            className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
          >
            {sfiaLoading || tpqiLoading ? 'Loading...' : 'Fetch with Specialized Hooks'}
          </button>
        </div>
        
        {/* Specialized Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {jobDetail && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium">SFIA Job (Specialized Hook):</h4>
              <p>{jobDetail.competency?.competency_name}</p>
            </div>
          )}
          {unitDetail && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <h4 className="font-medium">TPQI Unit (Specialized Hook):</h4>
              <p>{unitDetail.competency?.competency_name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {(hasError || sfiaError || tpqiError || errorHistory.length > 0) && (
        <div className="mb-8 p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Errors</h2>
          
          {state.error && (
            <div className="mb-4">
              <h3 className="font-medium text-red-700">Main Hook Error:</h3>
              <p className="text-red-600">{getErrorMessage(state.error)}</p>
              <div className="mt-2 text-sm">
                <strong>Recommendations:</strong>
                <ul className="list-disc list-inside ml-4">
                  {getErrorRecommendations(state.error).map((rec) => (
                    <li key={rec}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {errorHistory.length > 0 && (
            <div>
              <h3 className="font-medium text-red-700">Recent Errors:</h3>
              <div className="space-y-2 mt-2">
                {errorHistory.slice(0, 3).map((error) => (
                  <div key={`${error.source}-${error.code}-${error.timestamp.getTime()}`} className="text-sm">
                    <span className="font-medium">[{error.source?.toUpperCase()} {error.code}]</span>
                    <span className="ml-2">{error.message}</span>
                    <span className="ml-2 text-gray-500">({error.timestamp.toLocaleTimeString()})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={clearErrors}
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Clear Errors
          </button>
        </div>
      )}

      {/* Cache Management */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Cache Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => clearCache()}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear All Cache
          </button>
          <button
            onClick={resetState}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Reset State
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
        <div className="text-sm space-y-1">
          <p><strong>Main Hook Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Main Hook Has Data:</strong> {hasData ? 'Yes' : 'No'}</p>
          <p><strong>Main Hook Has Error:</strong> {hasError ? 'Yes' : 'No'}</p>
          <p><strong>SFIA Hook Loading:</strong> {sfiaLoading ? 'Yes' : 'No'}</p>
          <p><strong>TPQI Hook Loading:</strong> {tpqiLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error History Count:</strong> {errorHistory.length}</p>
          <p><strong>Last Fetched:</strong> {state.lastFetched?.toLocaleString() || 'Never'}</p>
        </div>
      </div>
    </div>
  );
};

export default CompetencyDetailExample;
