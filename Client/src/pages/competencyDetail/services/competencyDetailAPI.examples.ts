/**
 * Example usage of the competencyDetailAPI
 * 
 * This file demonstrates how to use the various functions provided by the
 * competencyDetailAPI module to fetch competency details from both SFIA and TPQI APIs.
 */

import { useState, useEffect } from 'react';
import {
  fetchSfiaJobDetailByCode,
  fetchTpqiUnitDetailByCode,
  fetchCompetencyDetailByCode,
  fetchMultipleCompetencyDetails,
  isNetworkError,
  isTimeoutError,
  isNotFoundError,
  APIError,
  type SfiaJobResponse,
  type TpqiUnitResponse,
} from './competencyDetailAPI';

// Example 1: Fetch SFIA job details
async function fetchSfiaJobExample() {
  try {
    const jobCode = "PROG"; // Programming/software development
    const jobDetails: SfiaJobResponse = await fetchSfiaJobDetailByCode(jobCode);
    
    console.log('SFIA Job Details:', {
      id: jobDetails.competency?.competency_id,
      name: jobDetails.competency?.competency_name,
      category: jobDetails.competency?.category?.category_text,
      totalLevels: jobDetails.totalLevels,
      totalSkills: jobDetails.totalSkills,
    });
    
    return jobDetails;
  } catch (error) {
    if (isNotFoundError(error)) {
      console.log('Job not found');
    } else if (isNetworkError(error)) {
      console.error('Network error occurred');
    } else if (isTimeoutError(error)) {
      console.error('Request timed out');
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// Example 2: Fetch TPQI unit code details
async function fetchTpqiUnitExample() {
  try {
    const unitCode = "ICT-LIGW-404B"; // Example unit code
    const unitDetails: TpqiUnitResponse = await fetchTpqiUnitDetailByCode(unitCode);
    
    console.log('TPQI Unit Details:', {
      id: unitDetails.competency?.competency_id,
      name: unitDetails.competency?.competency_name,
      totalSkills: unitDetails.totalSkills,
      totalKnowledge: unitDetails.totalKnowledge,
      totalOccupational: unitDetails.totalOccupational,
      totalSector: unitDetails.totalSector,
    });
    
    return unitDetails;
  } catch (error) {
    console.error('Failed to fetch TPQI unit details:', error);
    throw error;
  }
}

// Example 3: Generic function to fetch from either source
async function fetchCompetencyExample() {
  try {
    // Fetch SFIA job
    const sfiaJob = await fetchCompetencyDetailByCode("sfia", "PROG");
    console.log('SFIA Job via generic function:', sfiaJob.competency?.competency_name);
    
    // Fetch TPQI unit
    const tpqiUnit = await fetchCompetencyDetailByCode("tpqi", "ICT-LIGW-404B");
    console.log('TPQI Unit via generic function:', tpqiUnit.competency?.competency_name);
    
    return { sfiaJob, tpqiUnit };
  } catch (error) {
    console.error('Failed to fetch competency details:', error);
    throw error;
  }
}

// Example 4: Fetch multiple competencies in parallel
async function fetchMultipleCompetenciesExample() {
  const requests = [
    { source: "sfia" as const, code: "PROG" },    // Programming
    { source: "sfia" as const, code: "DBAD" },    // Database administration
    { source: "tpqi" as const, code: "ICT-LIGW-404B" },
    { source: "tpqi" as const, code: "ICT-DBMS-301A" },
  ];
  
  try {
    const results = await fetchMultipleCompetencyDetails(requests);
    
    console.log('Multiple competency fetch results:');
    results.forEach((result) => {
      if (result.error) {
        console.error(`${result.source.toUpperCase()} ${result.code}: Error -`, result.error.message);
      } else {
        console.log(`${result.source.toUpperCase()} ${result.code}: Success -`, result.data?.competency?.competency_name);
      }
    });
    
    // Filter successful results
    const successfulResults = results.filter(result => !result.error && result.data);
    console.log(`Successfully fetched ${successfulResults.length} out of ${requests.length} competencies`);
    
    return results;
  } catch (error) {
    console.error('Failed to fetch multiple competencies:', error);
    throw error;
  }
}

// Example 5: Error handling patterns
async function errorHandlingExample() {
  const invalidJobCode = "INVALID_CODE";
  
  try {
    await fetchSfiaJobDetailByCode(invalidJobCode);
  } catch (error) {
    if (error instanceof APIError) {
      console.log('API Error details:', {
        message: error.message,
        status: error.status,
        source: error.source,
      });
      
      // Handle specific error types
      if (error.status === 404) {
        console.log('Job code not found, showing user-friendly message');
      } else if (error.status === 500) {
        console.log('Server error, retry or show maintenance message');
      }
    }
    
    // Use utility functions for error classification
    if (isNetworkError(error)) {
      console.log('Network issue detected, check connection');
    } else if (isTimeoutError(error)) {
      console.log('Request timed out, retry with longer timeout');
    }
  }
}

// Example 6: Using the API in a React component (TypeScript)
export const useCompetencyDetail = (source: "sfia" | "tpqi", code: string) => {
  const [data, setData] = useState<SfiaJobResponse | TpqiUnitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  
  useEffect(() => {
    if (!code.trim()) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchCompetencyDetailByCode(source, code);
        setData(result);
      } catch (err) {
        setError(err instanceof APIError ? err : new APIError('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [source, code]);
  
  return { data, loading, error };
};

// Export example functions for use in other modules
export {
  fetchSfiaJobExample,
  fetchTpqiUnitExample,
  fetchCompetencyExample,
  fetchMultipleCompetenciesExample,
  errorHandlingExample,
};
