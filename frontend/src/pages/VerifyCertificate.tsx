import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ShieldCheck, ShieldAlert, Award, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export const VerifyCertificate: React.FC = () => {
  const { certNo } = useParams<{ certNo: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/offboarding/verify/${certNo}`);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Sertifika bulunamadı');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [certNo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto flex flex-col gap-6">
        
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/images/xicon.jpg" alt="Iceberg X" className="w-16 h-16 rounded-2xl mx-auto shadow-md border border-gray-100" />
          </Link>
          <h2 className="text-sm font-black tracking-widest text-magenta uppercase mt-3">ICEBERG DIGITAL</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Official Verification Registry</p>
        </div>

        {data ? (
          /* Certificate verified state card */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-green-100 flex flex-col gap-6 relative overflow-hidden animate-fadeIn">
            
            {/* Visual indicator corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[5rem] flex items-center justify-center pl-4 pb-4">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-max">
                Sertifika Doğrulandı
              </span>
              <span className="text-gray-400 text-[10px] font-extrabold tracking-widest uppercase mt-1">CERTIFICATE VERIFIED</span>
            </div>

            <div className="border-t border-b border-gray-50 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-magenta/5 rounded-lg flex items-center justify-center text-magenta">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Cube Name / İsim</p>
                  <p className="text-sm font-extrabold text-gray-900">{data.cube_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-magenta/5 rounded-lg flex items-center justify-center text-magenta">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Cube ID / Cohort</p>
                  <p className="text-sm font-extrabold text-gray-900">Cube #{data.cube_number} • {data.cohort}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-magenta/5 rounded-lg flex items-center justify-center text-magenta">
                  <Award size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Certificate Type / Sertifika Türü</p>
                  <p className="text-sm font-extrabold text-magenta">
                    {data.type === 'success' ? 'Başarı Sertifikası (Fellowship)' : 'Katılım Sertifikası (Staj)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-magenta/5 rounded-lg flex items-center justify-center text-magenta">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Mentor & Date / Mentor ve Tarih</p>
                  <p className="text-sm font-extrabold text-gray-900">
                    {data.mentor_name} • {new Date(data.issue_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-center bg-slate-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-mono font-bold text-gray-500">
                Sertifika No: {data.certificate_no}
              </p>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Bu sertifika Iceberg Digital Fellowship veri tabanında doğrulanmıştır. Kişinin staj programını başarıyla tamamladığını ibraz eder.
              </p>
            </div>

          </div>
        ) : (
          /* Certificate verification failed card */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-100 flex flex-col gap-5 text-center animate-fadeIn">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Geçersiz Sertifika</h3>
              <p className="text-[10px] text-red-650 font-bold uppercase tracking-wider mt-0.5">Verification Failed</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Aradığınız sertifika numarası (<span className="font-mono font-bold text-red-500">{certNo}</span>) sistemimizde bulunamadı. Lütfen sertifika numarasını kontrol edin ya da sistem yöneticisiyle iletişime geçin.
            </p>

            <Link
              to="/login"
              className="mt-2 w-full py-2.5 bg-gray-950 hover:bg-black text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-black/10"
            >
              <span>Iceberg X Portal Login</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-8">
        BUILDING THE NEXT GENERATION OF INNOVATORS
      </div>
    </div>
  );
};
