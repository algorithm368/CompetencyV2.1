import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as searchCompetencyServices from "@Competency/services/searchCompetencyServices";

/**
 * Get detailed error response for client-side error handling
 */
const getErrorResponse = (err: any, operation: string) => {
  const errorInfo = {
    message: err?.message ?? `Failed to ${operation}`,
    errorType: 'unknown',
    details: null as any
  };

  // Database connection errors
  if (err?.code === 'ECONNREFUSED' || err?.message?.includes('connection')) {
    errorInfo.errorType = 'database_connection';
    errorInfo.message = 'Database connection failed';
  }
  // Database query errors
  else if (err?.code?.startsWith('P') || err?.name === 'PrismaClientKnownRequestError') {
    errorInfo.errorType = 'database_query';
    errorInfo.message = 'Database query failed';
    errorInfo.details = { code: err.code };
  }
  // Timeout errors
  else if (err?.message?.includes('timeout') || err?.code === 'ETIMEDOUT') {
    errorInfo.errorType = 'timeout';
    errorInfo.message = 'Request timeout';
  }
  // Validation errors
  else if (err?.name === 'ValidationError') {
    errorInfo.errorType = 'validation';
    errorInfo.message = 'Invalid input data';
  }

  return errorInfo;
};

// Get all skills/careers from the specified database (sfia or tpqi)
export const getCompetencies = async (req: Request, res: Response): Promise<void> => {
  const dbType = req.params?.dbType as "sfia" | "tpqi";
  if (!dbType || (dbType !== "sfia" && dbType !== "tpqi")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      errorType: 'validation',
      details: { validTypes: ['sfia', 'tpqi'] }
    });
    return;
  }
  try {
    const Competencies = await searchCompetencyServices.getCompetencies(dbType);
    res.status(StatusCodes.OK).json({ Competencies });
  } catch (err: any) {
    console.error(`Error fetching competencies from ${dbType}:`, err);
    const errorResponse = getErrorResponse(err, 'fetch competencies');
    
    // Set appropriate status code based on error type
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    if (errorResponse.errorType === 'validation') {
      statusCode = StatusCodes.BAD_REQUEST;
    } else if (errorResponse.errorType === 'timeout') {
      statusCode = StatusCodes.REQUEST_TIMEOUT;
    } else if (errorResponse.errorType === 'database_connection') {
      statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    }
    
    res.status(statusCode).json(errorResponse);
  }
};

// Search for skills/careers by name from the specified database (sfia or tpqi)
export const searchCompetency = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dbType = req.params?.dbType as "sfia" | "tpqi";
  const searchTerm = req.body?.searchTerm;

  if (!dbType || (dbType !== "sfia" && dbType !== "tpqi")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      errorType: 'validation',
      details: { validTypes: ['sfia', 'tpqi'] }
    });
    return;
  }
  if (
    !searchTerm ||
    typeof searchTerm !== "string" ||
    searchTerm.trim() === ""
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
      message: "Missing or invalid searchTerm",
      errorType: 'validation',
      details: { expected: 'non-empty string' }
    });
    return;
  }
  
  // Additional validation for search term length
  const trimmedSearchTerm = searchTerm.trim();
  if (trimmedSearchTerm.length < 2) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Search term must be at least 2 characters long",
      errorType: 'validation',
      details: { minLength: 2, provided: trimmedSearchTerm.length }
    });
    return;
  }
  
  if (trimmedSearchTerm.length > 100) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Search term is too long (maximum 100 characters)",
      errorType: 'validation',
      details: { maxLength: 100, provided: trimmedSearchTerm.length }
    });
    return;
  }
  
  try {
    const results = await searchCompetencyServices.searchCompetency(dbType, trimmedSearchTerm);
    res.status(StatusCodes.OK).json({ results });
  } catch (err: any) {
    console.error(`Error searching competencies in ${dbType} with term "${trimmedSearchTerm}":`, err);
    const errorResponse = getErrorResponse(err, 'search competencies');
    
    // Set appropriate status code based on error type
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    if (errorResponse.errorType === 'validation') {
      statusCode = StatusCodes.BAD_REQUEST;
    } else if (errorResponse.errorType === 'timeout') {
      statusCode = StatusCodes.REQUEST_TIMEOUT;
    } else if (errorResponse.errorType === 'database_connection') {
      statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    }
    
    res.status(statusCode).json(errorResponse);
  }
};
