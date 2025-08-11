import React, { useState } from 'react';
import { FaDownload, FaFilePdf, FaFileExcel, FaShare, FaPrint } from 'react-icons/fa';
import { PortfolioData } from '@Types/portfolio';

interface ExportActionsProps {
  portfolioData: PortfolioData;
}

const ExportActions: React.FC<ExportActionsProps> = ({ portfolioData }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement PDF export using jsPDF
      console.log('Exporting PDF...', portfolioData);
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would implement the actual PDF generation
      // Similar to the existing PortfolioPdf.tsx but using the new data structure
      
      alert('PDF export completed!');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement Excel export
      console.log('Exporting Excel...', portfolioData);
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Excel export completed!');
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Excel export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Professional Portfolio',
          text: 'Check out my professional competency portfolio',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Portfolio link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    }
  };

  const exportOptions = [
    {
      label: 'Export PDF',
      icon: FaFilePdf,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: handleExportPDF,
      description: 'Download a comprehensive PDF report'
    },
    {
      label: 'Export Excel',
      icon: FaFileExcel,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: handleExportExcel,
      description: 'Download data in Excel format'
    },
    {
      label: 'Print',
      icon: FaPrint,
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      onClick: handlePrint,
      description: 'Print your portfolio'
    },
    {
      label: 'Share',
      icon: FaShare,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: handleShare,
      description: 'Share your portfolio link'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Export & Share</h2>
          <p className="text-sm text-gray-500 mt-1">
            Download or share your portfolio in various formats
          </p>
        </div>
        <div className="bg-teal-100 rounded-lg p-3">
          <FaDownload className="h-6 w-6 text-teal-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.label}
              onClick={option.onClick}
              disabled={isExporting}
              className={`bg-white hover:shadow-md transition-all duration-200 rounded-lg p-4 text-left border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${option.bgColor} border`}>
                  <IconComponent className={`h-5 w-5 ${option.textColor}`} />
                </div>
                <span className={`font-medium text-gray-900`}>
                  {option.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {isExporting && (
        <div className="mt-6 flex items-center justify-center p-4 bg-teal-50 rounded-lg border border-teal-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
            <span className="text-teal-700 font-medium">
              Preparing your export...
            </span>
          </div>
        </div>
      )}

      {/* Portfolio Statistics for Export */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {portfolioData.sfiaSkills.length}
            </div>
            <div className="text-xs text-gray-500 font-medium">SFIA Skills</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {portfolioData.tpqiCareers.length}
            </div>
            <div className="text-xs text-gray-500 font-medium">TPQI Careers</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {Math.round(portfolioData.overallStats.averageSfiaProgress)}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Avg SFIA Progress</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {Math.round(
                (portfolioData.overallStats.averageTpqiSkillProgress + 
                 portfolioData.overallStats.averageTpqiKnowledgeProgress) / 2
              )}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Avg TPQI Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportActions;
