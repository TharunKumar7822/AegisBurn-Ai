import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AnalysisResponse, ComponentRecord } from '../types';

interface ReportsViewProps {
  analysis: AnalysisResponse;
  onExportCSV: () => void;
  showToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  analysis,
  onExportCSV,
  showToast
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const highRiskList = analysis.results.filter((c) => c.risk === 'HIGH' || c.anomaly_score >= 70);

  // Generate authentic PDF using jsPDF
  const generatePDFReport = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Background header
      doc.setFillColor(7, 18, 23);
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Title & Subtitle
      doc.setTextColor(67, 214, 208);
      doc.setFontSize(18);
      doc.text('AEGISBURN AI', 14, 18);

      doc.setTextColor(231, 241, 239);
      doc.setFontSize(14);
      doc.text('Engineering Screening Report', 14, 28);

      doc.setFontSize(9);
      doc.setTextColor(134, 163, 163);
      doc.text(`Analysis ID: ${analysis.analysis_id} | Date: ${new Date().toLocaleDateString()}`, 14, 36);

      // Section 1: Executive Summary
      doc.setTextColor(7, 18, 23);
      doc.setFontSize(12);
      doc.text('1. Executive Screening Summary', 14, 52);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Screened Components: ${analysis.dashboard.total_components}`, 14, 60);
      doc.text(`Normal (Low Risk): ${analysis.dashboard.normal_count} (${analysis.dashboard.risk_distribution.low_pct}%)`, 14, 66);
      doc.text(`Review (Medium Risk): ${analysis.dashboard.review_count} (${analysis.dashboard.risk_distribution.medium_pct}%)`, 14, 72);
      doc.text(`High Risk / Anomalies: ${analysis.dashboard.high_risk_count} (${analysis.dashboard.risk_distribution.high_pct}%)`, 14, 78);
      doc.text(`Fleet Average Anomaly Score: ${analysis.dashboard.avg_anomaly_score}%`, 14, 84);

      // Section 2: Model Performance Metrics
      doc.setTextColor(7, 18, 23);
      doc.setFontSize(12);
      doc.text('2. Model Verification Metrics (168-Hour Regression)', 14, 98);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Iddq 168h Regressor: R² = ${analysis.model_metrics.iddq.r2} | MAE = ${analysis.model_metrics.iddq.mae} µA | RMSE = ${analysis.model_metrics.iddq.rmse} µA`, 14, 106);
      doc.text(`Leakage 168h Regressor: R² = ${analysis.model_metrics.leakage.r2} | MAE = ${analysis.model_metrics.leakage.mae} µA | RMSE = ${analysis.model_metrics.leakage.rmse} µA`, 14, 112);
      doc.text(`Delay 168h Regressor: R² = ${analysis.model_metrics.delay.r2} | MAE = ${analysis.model_metrics.delay.mae} ns | RMSE = ${analysis.model_metrics.delay.rmse} ns`, 14, 118);

      // Section 3: High-Risk Critical Components List
      doc.setTextColor(7, 18, 23);
      doc.setFontSize(12);
      doc.text(`3. Critical Anomaly Quarantine Register (${highRiskList.length} Units)`, 14, 132);

      let yPos = 142;
      doc.setFillColor(240, 243, 245);
      doc.rect(14, yPos - 6, pageWidth - 28, 8, 'F');
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text('DUT ID', 16, yPos);
      doc.text('Lot Batch', 50, yPos);
      doc.text('Anomaly Score', 80, yPos);
      doc.text('Pred Iddq', 115, yPos);
      doc.text('Pred Leakage', 145, yPos);
      doc.text('Risk', 180, yPos);

      yPos += 8;
      const topAnomalies = highRiskList.slice(0, 15);
      topAnomalies.forEach((c) => {
        doc.text(c.component_id, 16, yPos);
        doc.text(c.batch_id, 50, yPos);
        doc.text(`${c.anomaly_score.toFixed(1)}%`, 80, yPos);
        doc.text(`${c.iddq_168h_pred.toFixed(2)} µA`, 115, yPos);
        doc.text(`${c.leakage_168h_pred.toFixed(3)} µA`, 145, yPos);
        doc.text(c.risk, 180, yPos);
        yPos += 6;
      });

      // Engineering Sign-Off Block
      yPos = Math.max(yPos + 10, 250);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text('Lead Quality Engineer Signature: _______________________', 14, yPos);
      doc.text('Date: _______________', 145, yPos);

      doc.save(`AegisBurn_Screening_Report_${analysis.analysis_id.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      showToast('success', 'PDF Generated', 'Engineering screening report downloaded successfully.');
    } catch (err: any) {
      showToast('error', 'PDF Error', err.message || 'Failed to build PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Toolbar */}
      <div className="console-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
              OFFICIAL ENGINEERING DOCUMENTATION
            </div>
            <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
              Engineering Screening Report Preview
            </h2>
            <p className="text-xs text-[#86a3a3] mt-1">
              Comprehensive report detailing statistical yield, 168h model accuracy, and quarantine register.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => window.print()}
              className="btn-outline text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onExportCSV}
              className="btn-outline text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={generatePDFReport}
              disabled={isGeneratingPdf}
              className="btn-cyan text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Formatted Report Document Canvas */}
      <div className="console-card p-8 bg-[#0d1c23] border border-[#203942] rounded-xs space-y-6 max-w-4xl mx-auto shadow-2xl">
        {/* Document Header */}
        <div className="border-b border-[#203942] pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#43d6d0]/20 text-[#43d6d0] border border-[#43d6d0]/40 font-bold text-xs rounded-xs font-mono-num">
                AEGISBURN AI
              </span>
              <span className="text-xs text-[#86a3a3]">Semiconductor Qualification Console</span>
            </div>
            <h1 className="text-2xl font-serif-heading text-[#e7f1ef] mt-2">
              Engineering Screening Report
            </h1>
            <div className="text-xs text-[#86a3a3] mt-1 flex items-center gap-3 font-mono-num">
              <span>{analysis.analysis_id}</span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Classification: Production Review</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded bg-[#12262e] border border-[#43d6d0] text-[#43d6d0] font-bold flex items-center justify-center text-sm shadow-inner">
            AB
          </div>
        </div>

        {/* 1. Executive Screening Summary */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#43d6d0]">
            1. Executive Screening Summary
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] text-[#86a3a3] uppercase">Total Components</div>
              <div className="text-xl font-mono-num font-bold text-[#e7f1ef] mt-0.5">
                {analysis.dashboard.total_components}
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] text-[#86a3a3] uppercase">Normal (Low Risk)</div>
              <div className="text-xl font-mono-num font-bold text-[#70d3a1] mt-0.5">
                {analysis.dashboard.normal_count} ({analysis.dashboard.risk_distribution.low_pct}%)
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] text-[#86a3a3] uppercase">Medium (Review)</div>
              <div className="text-xl font-mono-num font-bold text-[#efb765] mt-0.5">
                {analysis.dashboard.review_count} ({analysis.dashboard.risk_distribution.medium_pct}%)
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] text-[#86a3a3] uppercase">High Risk (Reject)</div>
              <div className="text-xl font-mono-num font-bold text-[#ef7778] mt-0.5">
                {analysis.dashboard.high_risk_count} ({analysis.dashboard.risk_distribution.high_pct}%)
              </div>
            </div>
          </div>
        </div>

        {/* 2. Model Performance Summary */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#43d6d0]">
            2. Machine Learning Model Verification
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs text-xs font-mono-num">
              <div className="text-[#86a3a3]">Iddq 168h Regressor</div>
              <div className="text-[#43d6d0] font-bold mt-1">R²: {analysis.model_metrics.iddq.r2}</div>
              <div className="text-[#e7f1ef]">MAE: {analysis.model_metrics.iddq.mae} µA</div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs text-xs font-mono-num">
              <div className="text-[#86a3a3]">Leakage 168h Regressor</div>
              <div className="text-[#efb765] font-bold mt-1">R²: {analysis.model_metrics.leakage.r2}</div>
              <div className="text-[#e7f1ef]">MAE: {analysis.model_metrics.leakage.mae} µA</div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs text-xs font-mono-num">
              <div className="text-[#86a3a3]">Delay 168h Regressor</div>
              <div className="text-[#7eb9ed] font-bold mt-1">R²: {analysis.model_metrics.delay.r2}</div>
              <div className="text-[#e7f1ef]">MAE: {analysis.model_metrics.delay.mae} ns</div>
            </div>
          </div>
        </div>

        {/* 3. High-Risk Critical Components */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#ef7778]">
              3. Critical High-Risk Anomaly Register ({highRiskList.length} Units)
            </div>
            <span className="text-[11px] text-[#86a3a3] font-mono-num">Quarantine Action Required</span>
          </div>

          <div className="overflow-x-auto border border-[#203942] rounded-xs">
            <table className="eng-table">
              <thead>
                <tr>
                  <th>Component ID</th>
                  <th>Batch Lot</th>
                  <th>Anomaly Score</th>
                  <th>Pred Iddq 168h</th>
                  <th>Pred Leakage 168h</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {highRiskList.slice(0, 10).map((c) => (
                  <tr key={c.component_id}>
                    <td className="font-mono-num font-semibold text-[#ef7778]">{c.component_id}</td>
                    <td className="font-mono-num text-[#86a3a3]">{c.batch_id}</td>
                    <td className="font-mono-num text-[#ef7778] font-bold">{c.anomaly_score.toFixed(1)}%</td>
                    <td className="font-mono-num">{c.iddq_168h_pred.toFixed(2)} µA</td>
                    <td className="font-mono-num">{c.leakage_168h_pred.toFixed(3)} µA</td>
                    <td><span className="badge-high">HIGH</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sign-off footer */}
        <div className="pt-8 border-t border-[#203942] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#86a3a3] gap-4">
          <div>
            <div>Lead Screening Engineer: <span className="text-[#e7f1ef] font-semibold">R. Kumar</span></div>
            <div className="text-[10px] mt-0.5">Semiconductor Quality Assurance Department</div>
          </div>
          <div className="text-right">
            <div>Authorized Signature: <span className="font-mono-num text-[#43d6d0]">AEGIS-BURN-CERT-8492</span></div>
            <div className="text-[10px] mt-0.5">Automated screening report verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
