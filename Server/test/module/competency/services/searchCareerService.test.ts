import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getJobs,
  searchCareer,
} from "../../../../src/modules/competency/services/searchCareerServices"; // Update with actual file path
import { prismaSfia, prismaTpqi } from "@Database/prismaClients";

// Mock the Prisma clients
vi.mock("@Database/prismaClients", () => ({
  prismaSfia: {
    jobs: {
      findMany: vi.fn(),
    },
  },
  prismaTpqi: {
    occupational: {
      findMany: vi.fn(),
    },
  },
}));

// Type the mocked clients for better TypeScript support
const mockPrismaSfia = prismaSfia as any;
const mockPrismaTpqi = prismaTpqi as any;

describe("Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getJobs", () => {
    it("should fetch SFIA jobs successfully", async () => {
      // Arrange
      const mockSfiaJobs = [
        { job_name: "Software Engineer" },
        { job_name: "Database Administrator" },
        { job_name: "Security Analyst" },
      ];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSfiaJobs);

      // Act
      const result = await getJobs("sfia");

      // Assert
      expect(result).toEqual([
        "Software Engineer",
        "Database Administrator",
        "Security Analyst",
      ]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledWith({
        select: { job_name: true },
        orderBy: { job_name: "asc" },
        take: 100,
      });
    });

    it("should fetch TPQI occupational data successfully", async () => {
      // Arrange
      const mockTpqiOccupations = [
        { name_occupational: "นักพัฒนาซอฟต์แวร์" },
        { name_occupational: "ผู้ดูแลฐานข้อมูล" },
        { name_occupational: "นักวิเคราะห์ระบบ" },
      ];
      mockPrismaTpqi.occupational.findMany.mockResolvedValue(
        mockTpqiOccupations
      );

      // Act
      const result = await getJobs("tpqi");

      // Assert
      expect(result).toEqual([
        "นักพัฒนาซอฟต์แวร์",
        "ผู้ดูแลฐานข้อมูล",
        "นักวิเคราะห์ระบบ",
      ]);
      expect(mockPrismaTpqi.occupational.findMany).toHaveBeenCalledWith({
        select: { name_occupational: true },
        orderBy: { name_occupational: "asc" },
        take: 100,
      });
    });

    it("should handle empty results", async () => {
      // Arrange
      mockPrismaSfia.jobs.findMany.mockResolvedValue([]);

      // Act
      const result = await getJobs("sfia");

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledOnce();
    });

    it("should handle database errors for SFIA", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaSfia.jobs.findMany.mockRejectedValue(dbError);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act & Assert
      await expect(getJobs("sfia")).rejects.toThrow(
        "Database connection failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching SFIA job names:",
        dbError
      );

      consoleSpy.mockRestore();
    });

    it("should handle database errors for TPQI", async () => {
      // Arrange
      const dbError = new Error("Network timeout");
      mockPrismaTpqi.occupational.findMany.mockRejectedValue(dbError);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act & Assert
      await expect(getJobs("tpqi")).rejects.toThrow("Network timeout");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching TPQI career names:",
        dbError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("searchCareer", () => {
    it("should search SFIA jobs successfully", async () => {
      // Arrange
      const mockSearchResults = [
        { job_name: "Security Analyst" },
        { job_name: "Security Engineer" },
        { job_name: "Information Security Manager" },
      ];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "secur");

      // Assert
      expect(result).toEqual([
        "Security Analyst",
        "Security Engineer",
        "Information Security Manager",
      ]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledWith({
        where: {
          job_name: {
            contains: "secur",
          },
        },
        select: { job_name: true },
        orderBy: { job_name: "asc" },
        take: 100,
      });
    });

    it("should search TPQI occupational data successfully", async () => {
      // Arrange
      const mockSearchResults = [
        { name_occupational: "ช่างติดตั้งระบบคอมพิวเตอร์" },
        { name_occupational: "ช่างติดตั้งระบบเครือข่าย" },
      ];
      mockPrismaTpqi.occupational.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("tpqi", "ช่างติดตั้งระบบ");

      // Assert
      expect(result).toEqual([
        "ช่างติดตั้งระบบคอมพิวเตอร์",
        "ช่างติดตั้งระบบเครือข่าย",
      ]);
      expect(mockPrismaTpqi.occupational.findMany).toHaveBeenCalledWith({
        where: {
          name_occupational: {
            contains: "ช่างติดตั้งระบบ",
          },
        },
        select: { name_occupational: true },
        orderBy: { name_occupational: "asc" },
        take: 100,
      });
    });

    it("should handle case-insensitive search", async () => {
      // Arrange
      const mockSearchResults = [
        { job_name: "Software Engineer" },
        { job_name: "Software Developer" },
      ];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "SOFTWARE");

      // Assert
      expect(result).toEqual(["Software Engineer", "Software Developer"]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledWith({
        where: {
          job_name: {
            contains: "software",
          },
        },
        select: { job_name: true },
        orderBy: { job_name: "asc" },
        take: 100,
      });
    });

    it("should trim whitespace from search term", async () => {
      // Arrange
      const mockSearchResults = [{ job_name: "Database Administrator" }];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "  database  ");

      // Assert
      expect(result).toEqual(["Database Administrator"]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledWith({
        where: {
          job_name: {
            contains: "database",
          },
        },
        select: { job_name: true },
        orderBy: { job_name: "asc" },
        take: 100,
      });
    });

    it("should return empty array for empty search term", async () => {
      // Act
      const result = await searchCareer("sfia", "");

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaSfia.jobs.findMany).not.toHaveBeenCalled();
    });

    it("should return empty array for whitespace-only search term", async () => {
      // Act
      const result = await searchCareer("tpqi", "   ");

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaTpqi.occupational.findMany).not.toHaveBeenCalled();
    });

    it("should filter out null/undefined values", async () => {
      // Arrange
      const mockSearchResults = [
        { job_name: "Valid Job" },
        { job_name: null },
        { job_name: "" },
        { job_name: "Another Valid Job" },
        { job_name: undefined },
      ];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "job");

      // Assert
      expect(result).toEqual(["Valid Job", "Another Valid Job"]);
    });

    it("should return frozen array", async () => {
      // Arrange
      const mockSearchResults = [{ job_name: "Test Job" }];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "test");

      // Assert
      expect(Object.isFrozen(result)).toBe(true);
    });

    it("should handle database errors during search", async () => {
      // Arrange
      const dbError = new Error("Search query failed");
      mockPrismaSfia.jobs.findMany.mockRejectedValue(dbError);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act & Assert
      await expect(searchCareer("sfia", "test")).rejects.toThrow(
        "Search query failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error searching SFIA job names:",
        dbError
      );

      consoleSpy.mockRestore();
    });

    it("should handle empty search results", async () => {
      // Arrange
      mockPrismaTpqi.occupational.findMany.mockResolvedValue([]);

      // Act
      const result = await searchCareer("tpqi", "nonexistent");

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaTpqi.occupational.findMany).toHaveBeenCalledOnce();
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in search term", async () => {
      // Arrange
      const mockSearchResults = [{ job_name: "C++ Developer" }];
      mockPrismaSfia.jobs.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("sfia", "C++");

      // Assert
      expect(result).toEqual(["C++ Developer"]);
      expect(mockPrismaSfia.jobs.findMany).toHaveBeenCalledWith({
        where: {
          job_name: {
            contains: "c++",
          },
        },
        select: { job_name: true },
        orderBy: { job_name: "asc" },
        take: 100,
      });
    });

    it("should handle unicode characters in search term", async () => {
      // Arrange
      const mockSearchResults = [{ name_occupational: "นักพัฒนาเว็บไซต์" }];
      mockPrismaTpqi.occupational.findMany.mockResolvedValue(mockSearchResults);

      // Act
      const result = await searchCareer("tpqi", "นักพัฒนา");

      // Assert
      expect(result).toEqual(["นักพัฒนาเว็บไซต์"]);
      expect(mockPrismaTpqi.occupational.findMany).toHaveBeenCalledWith({
        where: {
          name_occupational: {
            contains: "นักพัฒนา",
          },
        },
        select: { name_occupational: true },
        orderBy: { name_occupational: "asc" },
        take: 100,
      });
    });
  });
});
