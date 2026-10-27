import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { ComponentRecord, RiskLevel } from '../types';

interface ComponentsViewProps {
  components: ComponentRecord[];
  initialRiskFilter?: RiskLevel | 'ALL';
  initialSearchQuery?: string;
  onSelectComponent: (comp: ComponentRecord) => void;
  onExportCSV: () => void;
}

export const ComponentsView: React.FC<ComponentsViewProps> = ({
  components,
  initialRiskFilter = 'ALL',
  initialSearchQuery = '',
  onSelectComponent,
  onExportCSV
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>(initialRiskFilter);
  const [batchFilter, setBatchFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);

  // Extract unique batches
  const batches = useMemo(() => {
    const set = new Set(components.map((c) => c.batch_id));
    return Array.from(set).sort();
  }, [components]);

  // Filtered components
  const filteredComponents = useMemo(() => {
    return components.filter((c) => {
      // Risk filter
      if (riskFilter !== 'ALL' && c.risk !== riskFilter) return false;
      // Batch filter
      if (batchFilter !== 'ALL' && c.batch_id !== batchFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = c.component_id.toLowerCase().includes(q);
        const matchesBatch = c.batch_id.toLowerCase().includes(q);
        const matchesPart = c.part_type?.toLowerCase().includes(q) || false;
        if (!matchesId && !matchesBatch && !matchesPart) return false;
      }
      return true;
    });
  }, [components, riskFilter, batchFilter, searchQuery]);

  // Pagination calculations
  const totalRows = filteredComponents.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredComponents.slice(startIndex, startIndex + rowsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setRiskFilter('ALL');
    setBatchFilter('ALL');
    setCurrentPage(1);
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return <span className="badge-high">HIGH</span>;
      case 'MEDIUM':
        return <span className="badge-med">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="badge-low">LOW</span>;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header Toolbar & Filters */}
      <div className="console-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
              DEVICE INVENTORY
            </div>
            <h2 className="text-xl font-serif-heading text-[#e7f1ef]">
              Component Screening Registry
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={onExportCSV} className="btn-outline text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button onClick={resetFilters} className="btn-outline text-xs text-[#86a3a3]">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#203942]">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#86a3a3] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Batch, Part..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-1.5 pl-9 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86a3a3] shrink-0">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#12262e] border border-[#203942] rounded px-2 py-1.5 text-xs text-[#43d6d0] focus:outline-none focus:border-[#43d6d0]"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">LOW Risk</option>
              <option value="MEDIUM">MEDIUM Risk</option>
              <option value="HIGH">HIGH Risk</option>
            </select>
          </div>

          {/* Batch ID Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86a3a3] shrink-0">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#12262e] border border-[#203942] rounded px-2 py-1.5 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
            >
              <option value="ALL">All Batches ({batches.length})</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86a3a3] shrink-0">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full bg-[#12262e] border border-[#203942] rounded px-2 py-1.5 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
            >
              <option value={15}>15 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Data Table */}
      <div className="console-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Component ID</th>
                <th>Batch</th>
                <th>Anomaly Score</th>
                <th>Pred Iddq (168h)</th>
                <th>Pred Leakage (168h)</th>
                <th>Pred Delay (168h)</th>
                <th>Risk</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#86a3a3]">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <div>No semiconductor components matched your search filters.</div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((comp) => (
                  <tr
                    key={comp.component_id}
                    className="hover:bg-[#12262e]/80 cursor-pointer transition-colors"
                    onClick={() => onSelectComponent(comp)}
                  >
                    <td className="font-mono-num font-semibold text-[#43d6d0]">
                      {comp.component_id}
                    </td>
                    <td className="font-mono-num text-[#86a3a3]">
                      {comp.batch_id}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#12262e] rounded-xs overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, comp.anomaly_score)}%` }}
                            className={`h-full ${
                              comp.risk === 'HIGH'
                                ? 'bg-[#ef7778]'
                                : comp.risk === 'MEDIUM'
                                ? 'bg-[#efb765]'
                                : 'bg-[#70d3a1]'
                            }`}
                          />
                        </div>
                        <span className="font-mono-num text-xs font-semibold">
                          {comp.anomaly_score.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="font-mono-num">
                      {comp.iddq_168h_pred.toFixed(2)}{' '}
                      <span className="text-[10px] text-[#86a3a3]">µA</span>
                    </td>
                    <td className="font-mono-num">
                      {comp.leakage_168h_pred.toFixed(3)}{' '}
                      <span className="text-[10px] text-[#86a3a3]">µA</span>
                    </td>
                    <td className="font-mono-num">
                      {comp.delay_168h_pred.toFixed(3)}{' '}
                      <span className="text-[10px] text-[#86a3a3]">ns</span>
                    </td>
                    <td>{getRiskBadge(comp.risk)}</td>
                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComponent(comp);
                        }}
                        className="text-[#43d6d0] hover:text-[#5ce0da] text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Controls (as required in Bug Fixes item 23) */}
        <div className="pagination">
          <div>
            Showing <span className="text-[#e7f1ef] font-mono-num">{startIndex + 1}</span> to{' '}
            <span className="text-[#e7f1ef] font-mono-num">
              {Math.min(startIndex + rowsPerPage, totalRows)}
            </span>{' '}
            of <span className="text-[#e7f1ef] font-mono-num">{totalRows}</span> components
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`pagination-page-num ${
                    currentPage === pageNum ? 'active' : 'text-[#86a3a3] hover:text-[#e7f1ef]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
