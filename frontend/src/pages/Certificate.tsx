import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ShieldAlert, Printer, ArrowLeft } from 'lucide-react';

export const Certificate: React.FC = () => {
  const { cubeId } = useParams<{ cubeId: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const res = await api.get(`/cubes/${cubeId}`);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load certificate data');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificateData();
  }, [cubeId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data || !data.profile.offboarding_record) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white max-w-md p-6 rounded-2xl shadow-subtle border border-red-100 flex flex-col gap-4 text-center">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-extrabold text-gray-900 text-sm">Certificate Not Found</h3>
          <p className="text-xs text-gray-500">
            {error || 'This Cube does not have an active offboarding certificate generated yet.'}
          </p>
          <Link to="/offboarding" className="mt-2 text-xs font-bold text-magenta hover:underline">
            Go back to Offboarding Directory
          </Link>
        </div>
      </div>
    );
  }

  const { profile } = data;
  const record = profile.offboarding_record;
  const isSuccess = record.type === 'success';

  // Format Dates
  const formattedDateTr = new Date(record.issue_date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedDateEn = new Date(record.issue_date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const verificationUrl = `${window.location.origin}/verify/${record.certificate_no}`;
  const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 no-print select-none">
      
      {/* Floating Action Menu */}
      <div className="w-full max-w-[297mm] flex justify-between items-center mb-4 no-print">
        <Link
          to="/offboarding"
          className="flex items-center gap-1 text-xs font-extrabold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-magenta text-white text-xs font-bold rounded-xl shadow-md shadow-magenta/15 hover:bg-magenta-hover transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Styled Printable A4 Landscape Container */}
      <div className={`print-container relative shadow-2xl border aspect-[1.414] overflow-hidden select-text transition-all ${
        isSuccess 
          ? 'bg-gradient-to-br from-[#100D0B] via-[#1B1410] to-[#251C15] border-amber-950/20 text-white' 
          : 'bg-[#F9F8F6] border-gray-200/50 text-gray-800'
        }`}
        style={{
          width: '297mm',
          height: '210mm',
        }}
      >
        
        {/* Decorative corner borders */}
        <div className={`absolute top-2.5 left-2.5 w-4 h-4 border-t border-l ${isSuccess ? 'border-amber-500/30' : 'border-magenta/30'}`}></div>
        <div className={`absolute top-2.5 right-2.5 w-4 h-4 border-t border-r ${isSuccess ? 'border-amber-500/30' : 'border-magenta/30'}`}></div>
        <div className={`absolute bottom-2.5 left-2.5 w-4 h-4 border-b border-l ${isSuccess ? 'border-amber-500/30' : 'border-magenta/30'}`}></div>
        <div className={`absolute bottom-2.5 right-2.5 w-4 h-4 border-b border-r ${isSuccess ? 'border-amber-500/30' : 'border-magenta/30'}`}></div>

        {/* Large stylized watermarked background logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img src="/images/iceberg-x-logo-whitebg.png" alt="" className="w-[500px] h-[500px] object-contain" />
        </div>

        {/* Header Row */}
        <div className="absolute top-10 left-12 right-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <span className="font-black text-[13px] tracking-widest text-amber-400 bg-amber-400/5 border border-amber-400/10 px-2 py-0.5 rounded uppercase">ICEBERG PORTAL</span>
            ) : (
              <span className="font-black text-[13px] tracking-widest text-magenta bg-magenta/5 border border-magenta/10 px-2 py-0.5 rounded uppercase">ICEBERG DIGITAL</span>
            )}
          </div>
          <span className={`text-[9px] font-extrabold tracking-widest uppercase ${isSuccess ? 'text-amber-500/70' : 'text-gray-400'}`}>
            {isSuccess ? "ELİT TEKNOLOJİ FELLOWSHIP'İ" : "STAJ PROGRAMI • TEKNOLOJİ FELLOWSHIP'İ"}
          </span>
        </div>

        {/* Main Content Area */}
        <div className="h-full flex flex-col justify-center items-center px-16 text-center pt-8">
          
          {/* Pill Category Label */}
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isSuccess 
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' 
              : 'bg-magenta/5 text-magenta border border-magenta/15'
          }`}>
            {isSuccess ? 'BAŞARI SERTİFİKASI' : 'STAJ SERTİFİKASI'}
          </span>

          {/* Certificate Title */}
          <h2 className={`font-black tracking-wide leading-none mt-5 text-[42px] ${isSuccess ? 'text-white' : 'text-gray-900'}`}>
            {isSuccess ? 'Başarı Sertifikası' : 'Katılım Sertifikası'}
          </h2>

          {/* Subtitle */}
          <p className={`text-[10px] font-extrabold tracking-widest uppercase mt-4 ${isSuccess ? 'text-amber-500/60' : 'text-gray-400'}`}>
            {isSuccess ? 'AŞAĞIDAKİ KİŞİYE ONURLA VERİLMİŞTİR' : 'AŞAĞIDAKİ KİŞİYE VERİLMİŞTİR'}
          </p>

          {/* Recipient Name */}
          <h1 className={`font-extrabold leading-none mt-3.5 pb-2 border-b-2 max-w-xl text-[48px] ${
            isSuccess ? 'text-white border-amber-400/30' : 'text-gray-900 border-magenta/30'
          }`}>
            {profile.user.name}
          </h1>

          {/* Description Text */}
          <p className={`text-[14px] leading-relaxed max-w-[650px] mt-6 font-medium ${isSuccess ? 'text-gray-300' : 'text-gray-650'}`}>
            {isSuccess ? (
              <>
                Iceberg Digital teknoloji fellowship programını üstün bir performansla tamamladığını ve<br />
                <span className="font-bold text-white">Cube #{profile.cube_number}</span> olarak kalıcı yerini aldığını belgeler.
              </>
            ) : (
              <>
                Iceberg Digital teknoloji staj programına <span className="font-bold text-gray-900">Cube #{profile.cube_number}</span> olarak katılım gösterdiğini ve<br />
                programı başarıyla tamamladığını belgeler.
              </>
            )}
          </p>

          {/* Tagline / Sub-slogan */}
          {isSuccess && (
            <p className="text-[10px] text-amber-400 font-extrabold tracking-widest uppercase mt-4">
              Once a Cube, Always a Cube
            </p>
          )}

          {/* Cube Identifier Badges */}
          <div className="flex gap-4 mt-8">
            <div className={`px-4 py-2 border rounded-xl flex flex-col justify-center items-center min-w-[90px] ${
              isSuccess ? 'bg-amber-450/5 border-amber-400/20' : 'bg-slate-50 border-gray-200'
            }`}>
              <span className="text-[7px] text-gray-400 uppercase font-semibold">CUBE ID</span>
              <span className={`text-[12px] font-bold mt-0.5 ${isSuccess ? 'text-amber-400' : 'text-magenta'}`}>#{profile.cube_number}</span>
            </div>
            <div className={`px-4 py-2 border rounded-xl flex flex-col justify-center items-center min-w-[140px] ${
              isSuccess ? 'bg-amber-450/5 border-amber-400/20' : 'bg-slate-50 border-gray-200'
            }`}>
              <span className="text-[7px] text-gray-400 uppercase font-semibold">PROGRAM MENTORU</span>
              <span className="text-[12px] font-bold mt-0.5 text-gray-800 dark:text-white">{record.mentor_name}</span>
            </div>
          </div>

        </div>

        {/* Footer Rows (Signatures & Verification Info) */}
        <div className="absolute bottom-10 left-12 right-12 flex justify-between items-end">
          
          {/* Signatures */}
          <div className="flex gap-10">
            <div className="flex flex-col text-left">
              <div className="h-6 w-28 border-b border-gray-400/30"></div>
              <p className="text-[9px] font-bold text-gray-800 dark:text-white mt-1">Ad Soyad</p>
              <p className="text-[6px] text-gray-400 uppercase font-semibold">KURUCU & CEO</p>
            </div>
            <div className="flex flex-col text-left">
              <div className="h-6 w-28 border-b border-gray-400/30"></div>
              <p className="text-[9px] font-bold text-gray-800 dark:text-white mt-1">Ad Soyad</p>
              <p className="text-[6px] text-gray-400 uppercase font-semibold">PROGRAM DİREKTÖRÜ</p>
            </div>
          </div>

          <p className="text-[6px] text-gray-400 font-extrabold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 bottom-0">
            BUILDING THE NEXT GENERATION OF INNOVATORS
          </p>

          {/* Certificate Metadata and Verification Code QR */}
          <div className="flex items-center gap-4">
            <div className="text-right text-[8px] text-gray-400 leading-tight font-semibold">
              <p>Sertifika No: <span className="font-bold text-gray-800 dark:text-white">{record.certificate_no}</span></p>
              <p>Veriş Tarihi: <span className="font-bold text-gray-800 dark:text-white">{formattedDateTr}</span></p>
            </div>
            <div className="bg-white p-1 rounded border border-gray-200 flex flex-col items-center justify-center shadow-sm">
              <img src={qrCodeImgSrc} alt="Verification QR" className="w-11 h-11 object-contain" />
              <span className="text-[4px] font-bold tracking-wider text-gray-500 uppercase mt-0.5">DOĞRULA</span>
            </div>
          </div>

        </div>

      </div>

      {/* Global CSS Style tag specifically for print layout overrides */}
      <style>{`
        @media print {
          /* Hide all application wrapper elements */
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          /* Center the print sheet */
          .print-container {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          /* Suppress headers and footers from browser defaults */
          @page {
            size: A4 landscape;
            margin: 0 !important;
          }
        }
      `}</style>

    </div>
  );
};
