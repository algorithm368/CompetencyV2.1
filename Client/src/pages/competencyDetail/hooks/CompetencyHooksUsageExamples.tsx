import React, { useState } from 'react';
import { 
  useCompetencyDetail, 
  useSfiaJobDetail, 
  useTpqiUnitDetail 
} from './useCompetencyDetail';
import { useCompetencyDetailError } from './useCompetencyDetailError';

/**
 * Simple practical examples of using the competency detail hooks
 */

// Example 1: Basic SFIA Job Detail Component
export const SfiaJobDetailComponent: React.FC = () => {
  const [jobCode, setJobCode] = useState('');
  const { 
    jobDetail, 
    loading, 
    error, 
    fetchJobDetail,
    hasData,
    isInCache 
  } = useSfiaJobDetail();

  const handleFetch = async () => {
    if (jobCode.trim()) {
      await fetchJobDetail(jobCode.trim().toUpperCase());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">SFIA Job Detail Lookup</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={jobCode}
          onChange={(e) => setJobCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter SFIA job code (e.g., PROG, DBAD, ARCH)"
          className="px-3 py-2 border rounded flex-1"
          disabled={loading}
        />
        <button
          onClick={handleFetch}
          disabled={loading || !jobCode.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {jobCode && isInCache(jobCode) && (
        <div className="text-sm text-green-600 mb-2">
          ✓ Data available in cache
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error.message}</p>
        </div>
      )}

      {hasData && jobDetail && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-lg mb-2">
            {jobDetail.competency?.competency_name || 'Unnamed Competency'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-2 bg-white rounded">
              <div className="text-2xl font-bold text-blue-600">
                {jobDetail.totalLevels}
              </div>
              <div className="text-sm text-gray-600">Levels</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-2xl font-bold text-green-600">
                {jobDetail.totalSkills}
              </div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-2xl font-bold text-purple-600">
                {jobDetail.competency?.competency_id}
              </div>
              <div className="text-sm text-gray-600">Code</div>
            </div>
          </div>

          {jobDetail.competency?.overall && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Overview:</h4>
              <p className="text-gray-700">{jobDetail.competency.overall}</p>
            </div>
          )}

          {jobDetail.competency?.levels && jobDetail.competency.levels.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Available Levels:</h4>
              <div className="space-y-2">
                {jobDetail.competency.levels.map((level) => (
                  <div key={level.id} className="p-2 bg-white rounded border">
                    <span className="font-medium">{level.level_name}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({level.descriptions?.length || 0} descriptions)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example 2: TPQI Unit Detail Component
export const TpqiUnitDetailComponent: React.FC = () => {
  const [unitCode, setUnitCode] = useState('');
  const { 
    unitDetail, 
    loading, 
    error, 
    fetchUnitDetail,
    hasData 
  } = useTpqiUnitDetail();

  const handleFetch = async () => {
    if (unitCode.trim()) {
      await fetchUnitDetail(unitCode.trim());
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">TPQI Unit Detail Lookup</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={unitCode}
          onChange={(e) => setUnitCode(e.target.value)}
          placeholder="Enter TPQI unit code (e.g., ICT-LIGW-404B)"
          className="px-3 py-2 border rounded flex-1"
          disabled={loading}
        />
        <button
          onClick={handleFetch}
          disabled={loading || !unitCode.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      {hasData && unitDetail && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-lg mb-2">
            {unitDetail.competency?.competency_name || 'Unnamed Unit'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xl font-bold text-blue-600">
                {unitDetail.totalSkills}
              </div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xl font-bold text-green-600">
                {unitDetail.totalKnowledge}
              </div>
              <div className="text-sm text-gray-600">Knowledge</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xl font-bold text-purple-600">
                {unitDetail.totalOccupational}
              </div>
              <div className="text-sm text-gray-600">Occupational</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xl font-bold text-orange-600">
                {unitDetail.totalSector}
              </div>
              <div className="text-sm text-gray-600">Sectors</div>
            </div>
          </div>

          {unitDetail.competency?.overall && (
            <div>
              <h4 className="font-medium mb-2">Overview:</h4>
              <p className="text-gray-700">{unitDetail.competency.overall}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example 3: Competency Search with Validation
export const CompetencySearchWithValidation: React.FC = () => {
  const [code, setCode] = useState('');
  const [source, setSource] = useState<'sfia' | 'tpqi'>('sfia');
  
  const { 
    state, 
    fetchSfiaDetail, 
    fetchTpqiDetail, 
    isLoading,
    hasData,
    clearCache
  } = useCompetencyDetail({
    maxRetries: 2,
    autoRetryOnNetworkError: true
  });

  const { 
    validateCompetencyCode, 
    getErrorMessage, 
    getErrorRecommendations,
    addError,
    errorHistory,
    clearErrors
  } = useCompetencyDetailError();

  const handleSearch = async () => {
    // Clear previous errors
    clearErrors();
    
    // Validate input
    const validation = validateCompetencyCode(code, source);
    if (!validation.isValid) {
      validation.errors.forEach(error => addError(error, source, code));
      return;
    }

    try {
      if (source === 'sfia') {
        await fetchSfiaDetail(code.trim().toUpperCase());
      } else {
        await fetchTpqiDetail(code.trim());
      }
    } catch (error) {
      addError(error, source, code);
    }
  };

  const validation = code ? validateCompetencyCode(code, source) : null;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Smart Competency Search</h2>
      
      <div className="space-y-4">
        {/* Source Selection */}
        <fieldset>
          <legend className="block text-sm font-medium mb-2">Competency Source:</legend>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="sfia"
                checked={source === 'sfia'}
                onChange={(e) => setSource(e.target.value as 'sfia' | 'tpqi')}
                className="mr-2"
              />{' '}
              SFIA (Skills Framework for the Information Age)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="tpqi"
                checked={source === 'tpqi'}
                onChange={(e) => setSource(e.target.value as 'sfia' | 'tpqi')}
                className="mr-2"
              />{' '}
              TPQI (Thai Professional Qualification Institute)
            </label>
          </div>
        </fieldset>

        {/* Code Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {source === 'sfia' ? 'SFIA Job Code:' : 'TPQI Unit Code:'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                source === 'sfia' 
                  ? 'e.g., PROG, DBAD, ARCH' 
                  : 'e.g., ICT-LIGW-404B'
              }
              className="px-3 py-2 border rounded flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !code.trim() || (validation && !validation.isValid)}
              className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Validation Warnings */}
        {validation?.warnings && validation.warnings.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 font-medium">Suggestions:</p>
            {validation.warnings.map((warning) => (
              <p key={warning} className="text-yellow-700 text-sm">• {warning}</p>
            ))}
          </div>
        )}

        {/* Validation Errors */}
        {validation?.errors && validation.errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 font-medium">Validation Errors:</p>
            {validation.errors.map((error) => (
              <p key={error} className="text-red-700 text-sm">• {error}</p>
            ))}
          </div>
        )}

        {/* Runtime Errors */}
        {errorHistory.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex justify-between items-center mb-2">
              <p className="text-red-800 font-medium">Errors:</p>
              <button 
                onClick={clearErrors}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
            {errorHistory.slice(0, 2).map((error) => (
              <div key={`${error.source}-${error.code}-${error.timestamp.getTime()}`} className="mb-2">
                <p className="text-red-700 text-sm">{getErrorMessage(error)}</p>
                <div className="mt-1">
                  <p className="text-xs text-red-600">Recommendations:</p>
                  {getErrorRecommendations(error).slice(0, 2).map((rec) => (
                    <p key={rec} className="text-xs text-red-600 ml-2">• {rec}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {hasData && state.data && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                {state.data.competency?.competency_name || 'Found Competency'}
              </h3>
              <button
                onClick={() => clearCache()}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Cache
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Code: {state.data.competency?.competency_id}
            </p>
            
            {state.data.competency?.overall && (
              <p className="text-gray-700">{state.data.competency.overall}</p>
            )}
            
            <div className="mt-3 flex gap-4 text-sm">
              {'totalLevels' in state.data && (
                <span>Levels: {state.data.totalLevels}</span>
              )}
              <span>Skills: {state.data.totalSkills}</span>
              {'totalKnowledge' in state.data && (
                <span>Knowledge: {state.data.totalKnowledge}</span>
              )}
              {'totalOccupational' in state.data && (
                <span>Occupational: {state.data.totalOccupational}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example 4: Multiple Competencies Dashboard
export const MultipleCompetenciesDashboard: React.FC = () => {
  const { 
    multipleState, 
    fetchMultipleDetails, 
    isMultipleLoading,
    multipleProgress 
  } = useCompetencyDetail();

  const predefinedSets = {
    programming: [
      { source: 'sfia' as const, code: 'PROG' },
      { source: 'sfia' as const, code: 'DBAD' },
      { source: 'sfia' as const, code: 'ARCH' },
    ],
    management: [
      { source: 'sfia' as const, code: 'PRMG' },
      { source: 'sfia' as const, code: 'RLMT' },
    ],
    mixed: [
      { source: 'sfia' as const, code: 'PROG' },
      { source: 'tpqi' as const, code: 'ICT-LIGW-404B' },
      { source: 'sfia' as const, code: 'TEST' },
    ]
  };

  const handleFetchSet = async (setName: keyof typeof predefinedSets) => {
    await fetchMultipleDetails(predefinedSets[setName]);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Multiple Competencies Dashboard</h2>
      
      <div className="flex gap-2 mb-4">
        {Object.keys(predefinedSets).map((setName) => (
          <button
            key={setName}
            onClick={() => handleFetchSet(setName as keyof typeof predefinedSets)}
            disabled={isMultipleLoading}
            className="px-3 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300 capitalize"
          >
            {setName} Set
          </button>
        ))}
      </div>

      {isMultipleLoading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Loading competencies...</span>
            <span>{Math.round(multipleProgress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${multipleProgress * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {multipleState.results.length > 0 && (
        <div className="grid gap-3">
          {multipleState.results.map((result) => (
            <div 
              key={`${result.source}-${result.code}`}
              className={`p-3 rounded border ${
                result.error 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">
                    {result.source.toUpperCase()} {result.code}
                  </span>
                  {result.data && (
                    <p className="text-sm text-gray-700 mt-1">
                      {result.data.competency?.competency_name}
                    </p>
                  )}
                  {result.error && (
                    <p className="text-sm text-red-600 mt-1">
                      {result.error.message}
                    </p>
                  )}
                </div>
                <span className={`text-lg ${result.error ? 'text-red-500' : 'text-green-500'}`}>
                  {result.error ? '✗' : '✓'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main example component that shows all examples
export const CompetencyHooksUsageExamples: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Competency Detail Hooks Usage Examples
      </h1>
      
      <div className="grid gap-6">
        <SfiaJobDetailComponent />
        <TpqiUnitDetailComponent />
        <CompetencySearchWithValidation />
        <MultipleCompetenciesDashboard />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Hook Features Demonstrated:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>useSfiaJobDetail</strong> - Specialized SFIA job details fetching</li>
          <li>• <strong>useTpqiUnitDetail</strong> - Specialized TPQI unit details fetching</li>
          <li>• <strong>useCompetencyDetail</strong> - Main hook with full functionality</li>
          <li>• <strong>useCompetencyDetailError</strong> - Input validation and error handling</li>
          <li>• <strong>Caching</strong> - Automatic caching with cache indicators</li>
          <li>• <strong>Multiple Requests</strong> - Parallel fetching with progress tracking</li>
          <li>• <strong>Error Handling</strong> - Comprehensive error management</li>
          <li>• <strong>Validation</strong> - Input validation with warnings and errors</li>
        </ul>
      </div>
    </div>
  );
};

export default CompetencyHooksUsageExamples;
