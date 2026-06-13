import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';
import { FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

export const Reports = () => {
  const [downloading, setDownloading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const triggerDownload = async (format, reportType) => {
    setError('');
    setSuccess('');
    const label = `${reportType.toUpperCase()} ${format.toUpperCase()}`;
    setDownloading(label);

    try {
      const response = await apiFetch(`/reports/${format}?type=${reportType}`);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `rustik-${reportType}-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess(`Downloaded ${label} successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to download ${label}. Ensure server is running and database is populated.`);
    } finally {
      setDownloading('');
    }
  };

  const reportOptions = [
    { type: 'daily', title: 'Daily Audit Report', desc: 'Summary of transactions, services, and staff attendance for today.' },
    { type: 'weekly', title: 'Weekly Financial Statement', desc: 'Detail logs of revenue and cashflow over the past 7 days.' },
    { type: 'monthly', title: 'Monthly Reconciliation Package', desc: 'Audit ledger of sales transactions and operations expenses (30 days).' },
    { type: 'yearly', title: 'Yearly Balance Summary', desc: 'High-level financial summaries for the current calendar year.' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-stone-200">
      
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">AUDIT REPORTS EXPORTER</h1>
        <span className="text-xs text-stone-400 font-sans mt-1">Generate and download audited financial and operational reports.</span>
      </div>

      {success && (
        <div className="bg-emerald-950/20 border border-emerald-500/35 text-emerald-400 p-3 rounded font-sans text-xs flex items-center gap-2">
          <CheckCircle size={16} /> <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-3 rounded font-sans text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" /> <span>{error}</span>
        </div>
      )}

      {/* Reports Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportOptions.map((opt) => (
          <div key={opt.type} className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-gold" /> {opt.title}
              </h3>
              <p className="font-sans text-[11px] text-stone-400 leading-relaxed mt-1">
                {opt.desc}
              </p>
            </div>

            {/* Downloads trigger buttons */}
            <div className="grid grid-cols-2 gap-3 border-t border-luxury-gray pt-4">
              {/* PDF download */}
              <button
                onClick={() => triggerDownload('pdf', opt.type)}
                disabled={!!downloading}
                className="py-2 rounded font-outfit text-[10px] font-bold uppercase tracking-widest bg-forest hover:bg-forest-dark border border-gold/20 text-gold flex items-center justify-center gap-1.5"
              >
                {downloading === `${opt.type.toUpperCase()} PDF` ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gold" />
                ) : (
                  <>
                    <Download size={11} /> Download PDF
                  </>
                )}
              </button>
              
              {/* Excel download */}
              <button
                onClick={() => triggerDownload('excel', opt.type)}
                disabled={!!downloading}
                className="py-2 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest flex items-center justify-center gap-1.5"
              >
                {downloading === `${opt.type.toUpperCase()} EXCEL` ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-forest" />
                ) : (
                  <>
                    <Download size={11} /> Download Excel
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export default Reports;
