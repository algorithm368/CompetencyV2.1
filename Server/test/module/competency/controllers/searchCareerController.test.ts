import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as searchCareerServices from "@Competency/services/searchCareerServices";
import {
  getJobs,
  searchCareer,
} from "../../../../src/modules/competency/controllers/searchCareerController.ts"; // Update with actual file path

// Mock the searchCareerServices
vi.mock("@Competency/services/searchCareerServices", () => ({
  getJobs: vi.fn(),
  searchCareer: vi.fn(),
}));

// Type the mocked services
const mockSearchCareerServices = searchCareerServices as any;

// Helper function to create mock Request and Response objects
const createMockRequest = (
  params: any = {},
  body: any = {}
): Partial<Request> => ({
  params,
  body,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

describe("Controller Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getJobs", () => {
    it("should return jobs successfully for SFIA database", async () => {
      // Arrange
      const mockJobs = [
        "Software Engineer",
        "Database Administrator",
        "Security Analyst",
      ];
      mockSearchCareerServices.getJobs.mockResolvedValue(mockJobs);

      const req = createMockRequest({ dbType: "sfia" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).toHaveBeenCalledWith("sfia");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ jobs: mockJobs });
    });

    it("should return jobs successfully for TPQI database", async () => {
      // Arrange
      const mockJobs = [
        "นักพัฒนาซอฟต์แวร์",
        "ผู้ดูแลฐานข้อมูล",
        "นักวิเคราะห์ระบบ",
      ];
      mockSearchCareerServices.getJobs.mockResolvedValue(mockJobs);

      const req = createMockRequest({ dbType: "tpqi" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).toHaveBeenCalledWith("tpqi");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ jobs: mockJobs });
    });

    it("should return empty array when no jobs found", async () => {
      // Arrange
      mockSearchCareerServices.getJobs.mockResolvedValue([]);

      const req = createMockRequest({ dbType: "sfia" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).toHaveBeenCalledWith("sfia");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ jobs: [] });
    });

    it("should return 400 for invalid dbType", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "invalid" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should return 400 for missing dbType", async () => {
      // Arrange
      const req = createMockRequest({});
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should return 400 for null dbType", async () => {
      // Arrange
      const req = createMockRequest({ dbType: null });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should return 500 when service throws error with message", async () => {
      // Arrange
      const errorMessage = "Database connection failed";
      mockSearchCareerServices.getJobs.mockRejectedValue(
        new Error(errorMessage)
      );

      const req = createMockRequest({ dbType: "sfia" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).toHaveBeenCalledWith("sfia");
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it("should return 500 with default message when service throws error without message", async () => {
      // Arrange
      mockSearchCareerServices.getJobs.mockRejectedValue({});

      const req = createMockRequest({ dbType: "sfia" });
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).toHaveBeenCalledWith("sfia");
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch jobs",
      });
    });
  });

  describe("searchCareer", () => {
    it("should return search results successfully for SFIA database", async () => {
      // Arrange
      const mockResults = ["Security Analyst", "Security Engineer"];
      mockSearchCareerServices.searchCareer.mockResolvedValue(mockResults);

      const req = createMockRequest(
        { dbType: "sfia" },
        { searchTerm: "security" }
      );
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "sfia",
        "security"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ results: mockResults });
    });

    it("should return search results successfully for TPQI database", async () => {
      // Arrange
      const mockResults = [
        "ช่างติดตั้งระบบคอมพิวเตอร์",
        "ช่างติดตั้งระบบเครือข่าย",
      ];
      mockSearchCareerServices.searchCareer.mockResolvedValue(mockResults);

      const req = createMockRequest(
        { dbType: "tpqi" },
        { searchTerm: "ช่างติดตั้งระบบ" }
      );
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "tpqi",
        "ช่างติดตั้งระบบ"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ results: mockResults });
    });

    it("should return empty array when no results found", async () => {
      // Arrange
      mockSearchCareerServices.searchCareer.mockResolvedValue([]);

      const req = createMockRequest(
        { dbType: "sfia" },
        { searchTerm: "nonexistent" }
      );
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "sfia",
        "nonexistent"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ results: [] });
    });

    it("should return 400 for invalid dbType", async () => {
      // Arrange
      const req = createMockRequest(
        { dbType: "invalid" },
        { searchTerm: "test" }
      );
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should return 400 for missing dbType", async () => {
      // Arrange
      const req = createMockRequest({}, { searchTerm: "test" });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should return 400 for missing searchTerm", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "sfia" }, {});
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing or invalid searchTerm",
      });
    });

    it("should return 400 for null searchTerm", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: null });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing or invalid searchTerm",
      });
    });

    it("should return 400 for non-string searchTerm", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: 123 });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing or invalid searchTerm",
      });
    });

    it("should return 400 for empty string searchTerm", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: "" });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing or invalid searchTerm",
      });
    });

    it("should return 500 when service throws error with message", async () => {
      // Arrange
      const errorMessage = "Search query failed";
      mockSearchCareerServices.searchCareer.mockRejectedValue(
        new Error(errorMessage)
      );

      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: "test" });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "sfia",
        "test"
      );
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it("should return 500 with default message when service throws error without message", async () => {
      // Arrange
      mockSearchCareerServices.searchCareer.mockRejectedValue({});

      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: "test" });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "sfia",
        "test"
      );
      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to search careers",
      });
    });

    it("should handle whitespace-only searchTerm as invalid", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: "   " });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing or invalid searchTerm",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle both invalid dbType and missing searchTerm in searchCareer", async () => {
      // Arrange
      const req = createMockRequest({ dbType: "invalid" }, {});
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });

    it("should handle special characters in searchTerm", async () => {
      // Arrange
      const mockResults = ["C++ Developer"];
      mockSearchCareerServices.searchCareer.mockResolvedValue(mockResults);

      const req = createMockRequest({ dbType: "sfia" }, { searchTerm: "C++" });
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "sfia",
        "C++"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ results: mockResults });
    });

    it("should handle unicode characters in searchTerm", async () => {
      // Arrange
      const mockResults = ["นักพัฒนาเว็บไซต์"];
      mockSearchCareerServices.searchCareer.mockResolvedValue(mockResults);

      const req = createMockRequest(
        { dbType: "tpqi" },
        { searchTerm: "นักพัฒนา" }
      );
      const res = createMockResponse();

      // Act
      await searchCareer(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.searchCareer).toHaveBeenCalledWith(
        "tpqi",
        "นักพัฒนา"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ results: mockResults });
    });

    it("should handle undefined params and body gracefully", async () => {
      // Arrange
      const req = { params: undefined, body: undefined } as any;
      const res = createMockResponse();

      // Act
      await getJobs(req as Request, res as Response);

      // Assert
      expect(mockSearchCareerServices.getJobs).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing dbType (must be 'sfia' or 'tpqi')",
      });
    });
  });
});
