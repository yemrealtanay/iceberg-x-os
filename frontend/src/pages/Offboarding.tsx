import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Award, FileText, ArrowRight, Check, X, ShieldAlert, Sparkles, Languages, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Offboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cubes, setCubes] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection & Preview State
  const [selectedCube, setSelectedCube] = useState<any | null>(null);
  const [certType, setCertType] = useState<'success' | 'participation'>('success');
  const [mentorName, setMentorName] = useState(user?.name || '');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [stats, setStats] = useState<{ completedMissions: number; badgesEarned: number; attendanceRate: number } | null>(null);

  // Email Text Drafts (Editable)
  const [emailTr, setEmailTr] = useState('');
  const [emailEn, setEmailEn] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en'>('tr');
  const [submitting, setSubmitting] = useState(false);

  // View Modal for already offboarded alumni email
  const [viewingAlumni, setViewingAlumni] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allCubes, allAlumni] = await Promise.all([
        api.get('/cubes'),
        api.get('/offboarding/alumni')
      ]);
      // Filter out already offboarded (Alumni) from active list
      const activeCubes = allCubes.filter((c: any) => c.current_level !== 'Alumni');
      setCubes(activeCubes);
      setAlumni(allAlumni);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch offboarding data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prefill mentor name when a Cube is selected
  useEffect(() => {
    if (selectedCube) {
      if (selectedCube.assigned_mentor?.name) {
        setMentorName(selectedCube.assigned_mentor.name);
      } else {
        setMentorName(user?.name || '');
      }
    }
  }, [selectedCube, user]);

  // Calculate stats and generate drafts when Cube or Cert Type changes
  useEffect(() => {
    if (!selectedCube) {
      setStats(null);
      setEmailTr('');
      setEmailEn('');
      return;
    }

    const loadStatsAndDrafts = async () => {
      setPreviewLoading(true);
      try {
        let completedMissions = 0;
        let badgesEarned = 0;
        let attendanceRate = 100;

        if (certType === 'success') {
          // Fetch stats from backend
          const statsRes = await api.get(`/offboarding/stats/${selectedCube.id}`);
          completedMissions = statsRes.completedMissions;
          badgesEarned = statsRes.badgesEarned;
          attendanceRate = statsRes.attendanceRate;
          setStats(statsRes);
        } else {
          setStats(null);
        }

        // Generate email texts
        const cubeNo = selectedCube.cube_number;
        const studentName = selectedCube.user.name;

        if (certType === 'success') {
          setEmailTr(
`Sayın ${studentName},

Iceberg Digital Teknoloji Fellowship programındaki Cube #${cubeNo} kodlu staj programınızı başarıyla tamamlayarak Alumni statüsüne geçmiş bulunuyorsunuz.

Stajınız boyunca:
- ${completedMissions} adet görevi başarıyla tamamladınız.
- ${badgesEarned} adet teknik ve yetkinlik rozeti kazandınız.
- Toplantılara katılım oranınız %${attendanceRate} olarak gerçekleşti.

Gösterdiğiniz üstün performans ve katkılarınız için teşekkür eder, kariyerinizde başarılar dileriz. Başarı sertifikanız sisteminize eklenmiştir.

Gelecekteki yollarınız açık olsun!

Saygılarımızla,
Iceberg Digital Ekibi`
          );

          setEmailEn(
`Dear ${studentName},

You have successfully completed your internship program as Cube #${cubeNo} in the Iceberg Digital Technology Fellowship and transitioned to Alumni status.

During your internship:
- You successfully completed ${completedMissions} missions.
- You earned ${badgesEarned} technical and competency badges.
- Your meeting attendance rate was ${attendanceRate}%.

Thank you for your outstanding performance and contributions. We wish you the best in your future career. Your Certificate of Success has been added to your profile.

We wish you a bright future!

Best regards,
Iceberg Digital Team`
          );
        } else {
          setEmailTr(
`Sayın ${studentName},

Iceberg Digital Teknoloji Fellowship programındaki Cube #${cubeNo} staj programınızı tamamlamış ve Alumni statüsüne geçmiş bulunuyorsunuz.

Katılımınız ve programımıza sağladığınız katkılar için teşekkür ederiz. Katılım sertifikanız sisteminize eklenmiştir.

Kariyerinizde başarılar dileriz.

Saygılarımızla,
Iceberg Digital Ekibi`
          );

          setEmailEn(
`Dear ${studentName},

You have completed your internship as Cube #${cubeNo} in the Iceberg Digital Technology Fellowship program and transitioned to Alumni status.

Thank you for your participation and contributions to our program. Your Certificate of Participation has been added to your profile.

We wish you success in your future career.

Best regards,
Iceberg Digital Team`
          );
        }
      } catch (err: any) {
        console.error('Failed to load stats:', err);
      } finally {
        setPreviewLoading(false);
      }
    };

    loadStatsAndDrafts();
  }, [selectedCube, certType]);

  const handleConfirmOffboarding = async () => {
    if (!selectedCube || !mentorName || !emailTr || !emailEn) return;
    setSubmitting(true);
    try {
      await api.post('/offboarding', {
        cubeProfileId: selectedCube.id,
        type: certType,
        mentorName,
        emailTextTr: emailTr,
        emailTextEn: emailEn
      });
      alert('Cube offboarded successfully and transitioned to Alumni!');
      setSelectedCube(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to complete offboarding');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
          <GraduationCap className="w-8 h-8 text-magenta" />
          <span>Offboarding & Alumni Management</span>
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Transition Cubes to Alumni, preview and generate staj / fellowship certificates, and customize student outreach emails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Active Cubes List */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-magenta" />
            <span>Active Cubes for Offboarding</span>
            <span className="ml-auto text-xs bg-magenta/10 text-magenta px-2 py-0.5 rounded-full font-bold">
              {cubes.length}
            </span>
          </h3>

          {cubes.length === 0 ? (
            <p className="text-gray-400 text-xs py-8 text-center italic">No active Cubes available for offboarding.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {cubes.map((cube) => (
                <button
                  key={cube.id}
                  onClick={() => {
                    setSelectedCube(cube);
                    setCertType('success');
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedCube?.id === cube.id
                      ? 'border-magenta bg-magenta/5 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-magenta/5 border border-magenta/15 flex items-center justify-center font-bold text-magenta text-xs">
                    #{cube.cube_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{cube.user.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{cube.cohort}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-magenta transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Live Preview and Accept Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedCube ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-6 animate-fadeIn">
              
              {/* Selected Cube Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-magenta text-white font-black flex items-center justify-center text-sm shadow-md shadow-magenta/15">
                    #{selectedCube.cube_number}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">{selectedCube.user.name}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{selectedCube.cohort} • {selectedCube.university || 'No university'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCube(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-white rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step 1: Configuration Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider pl-1">Certificate Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCertType('success')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        certType === 'success'
                          ? 'border-magenta bg-magenta/5 text-magenta'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Başarı Sertifikası</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCertType('participation')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        certType === 'participation'
                          ? 'border-magenta bg-magenta/5 text-magenta'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Katılım Sertifikası</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider pl-1">Program Mentor Name *</label>
                  <input
                    type="text"
                    required
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="Mentor Adı Soyadı"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-magenta/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-magenta" />
                    <span>Offboarding Live Previews</span>
                  </h4>
                </div>

                {previewLoading ? (
                  <div className="flex flex-col h-48 items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-magenta border-t-transparent"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Generating Preview...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    
                    {/* Visual Certificate Card Preview */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Certificate Preview</span>
                      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm relative group bg-slate-100 flex items-center justify-center p-4 min-h-[220px]">
                        
                        {certType === 'success' ? (
                          /* Dark mode success preview card */
                          <div className="w-full max-w-[340px] aspect-[1.41] bg-gradient-to-br from-[#120F0C] to-[#201813] text-white p-3 rounded-lg border border-amber-900/30 flex flex-col justify-between shadow-md text-[8px]">
                            <div className="flex justify-between items-start">
                              <span className="font-black text-[6px] tracking-wider text-amber-400/90">ICEBERG PORTAL</span>
                              <span className="text-[5px] text-amber-500/70 font-semibold uppercase">ELİT FELLOWSHIP</span>
                            </div>
                            <div className="text-center my-1.5 flex flex-col gap-0.5">
                              <span className="bg-amber-400/10 text-amber-400 text-[5px] px-1.5 py-0.5 rounded-full font-bold w-max mx-auto uppercase">Başarı Sertifikası</span>
                              <h5 className="font-black text-[12px] text-white tracking-wide mt-1">{selectedCube.user.name}</h5>
                              <p className="text-[5px] text-gray-400 leading-normal max-w-[260px] mx-auto mt-0.5">
                                Fellowship programını üstün bir performansla tamamladığını ve Cube #{selectedCube.cube_number} olarak kalıcı yerini aldığını belgeler.
                              </p>
                              <span className="text-[4px] text-amber-400 font-bold tracking-widest uppercase mt-0.5">Once a Cube, Always a Cube</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-white/5 pt-1.5 text-[4px] text-gray-400 font-semibold">
                              <div>
                                <p className="font-bold text-white">{mentorName}</p>
                                <p className="text-[3px]">PROGRAM MENTORU</p>
                              </div>
                              <div className="text-right">
                                <p>Sertifika No: ICE-2026-000{selectedCube.cube_number}</p>
                                <p>Tarih: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Light mode participation preview card */
                          <div className="w-full max-w-[340px] aspect-[1.41] bg-[#F9F8F6] text-gray-800 p-3 rounded-lg border border-gray-200/60 flex flex-col justify-between shadow-md text-[8px]">
                            <div className="flex justify-between items-start">
                              <span className="font-black text-[6px] tracking-wider text-magenta">ICEBERG DIGITAL</span>
                              <span className="text-[5px] text-gray-400 font-semibold uppercase">STAJ PROGRAMI</span>
                            </div>
                            <div className="text-center my-1.5 flex flex-col gap-0.5">
                              <span className="bg-magenta/5 text-magenta text-[5px] px-1.5 py-0.5 rounded-full font-bold w-max mx-auto uppercase">Katılım Sertifikası</span>
                              <h5 className="font-black text-[12px] text-gray-900 mt-1">{selectedCube.user.name}</h5>
                              <p className="text-[5px] text-gray-500 leading-normal max-w-[260px] mx-auto mt-0.5">
                                Teknoloji staj programına Cube #{selectedCube.cube_number} olarak katılım gösterdiğini ve programı başarıyla tamamladığını belgeler.
                              </p>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-1.5 text-[4px] text-gray-500 font-semibold">
                              <div>
                                <p className="font-bold text-gray-900">{mentorName}</p>
                                <p className="text-[3px]">PROGRAM MENTORU</p>
                              </div>
                              <div className="text-right">
                                <p>Sertifika No: ICE-2026-000{selectedCube.cube_number}</p>
                                <p>Tarih: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-gray-900 border border-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-subtle uppercase tracking-wider">
                            Full template prints in high res
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Email Text Draft Tabbed Editor */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between pl-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Outreach Draft</span>
                        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-150">
                          <button
                            type="button"
                            onClick={() => setActiveLangTab('tr')}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition flex items-center gap-0.5 ${
                              activeLangTab === 'tr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <Languages className="w-2.5 h-2.5" />
                            <span>TR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveLangTab('en')}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition flex items-center gap-0.5 ${
                              activeLangTab === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <Languages className="w-2.5 h-2.5" />
                            <span>EN</span>
                          </button>
                        </div>
                      </div>
                      
                      {activeLangTab === 'tr' ? (
                        <textarea
                          rows={11}
                          value={emailTr}
                          onChange={(e) => setEmailTr(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-3.5 text-xs font-semibold text-gray-800 leading-relaxed outline-none focus:border-magenta bg-white resize-none"
                        />
                      ) : (
                        <textarea
                          rows={11}
                          value={emailEn}
                          onChange={(e) => setEmailEn(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-3.5 text-xs font-semibold text-gray-800 leading-relaxed outline-none focus:border-magenta bg-white resize-none"
                        />
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* Confirm Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCube(null)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOffboarding}
                  disabled={submitting || previewLoading}
                  className="px-5 py-2.5 rounded-xl bg-magenta text-white font-bold text-xs hover:bg-magenta-hover transition flex items-center gap-1.5 shadow-md shadow-magenta/15"
                >
                  {submitting ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Accept & Offboard</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="h-[400px] border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white shadow-subtle">
              <GraduationCap className="w-12 h-12 text-gray-300 mb-2" />
              <h4 className="font-extrabold text-sm text-gray-800">No Cube Selected</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                Please select any active Cube from the left panel to preview their certificate and start the offboarding flow.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Section 2: Alumni Log */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
        <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gray-400" />
          <span>Alumni Directory & Records Log</span>
          <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
            {alumni.length}
          </span>
        </h3>

        {alumni.length === 0 ? (
          <p className="text-gray-400 text-xs py-8 text-center italic">No Alumni records logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[9px] tracking-wider font-bold">
                  <th className="py-3 px-4">Cube #</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Certificate No</th>
                  <th className="py-3 px-4">Certificate Type</th>
                  <th className="py-3 px-4">Mentor</th>
                  <th className="py-3 px-4">Offboard Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alumni.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-magenta">#{a.cube_number}</td>
                    <td className="py-3.5 px-4">
                      <Link to={`/cubes/${a.id}`} className="font-bold text-gray-800 hover:text-magenta transition">
                        {a.user.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[10px] text-gray-700">
                      {a.offboarding_record?.certificate_no}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        a.offboarding_record?.type === 'success'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {a.offboarding_record?.type === 'success' ? 'Başarı Sertifikası' : 'Katılım Sertifikası'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-800 font-bold">{a.offboarding_record?.mentor_name}</td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(a.offboarding_record?.issue_date || a.updated_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setViewingAlumni(a)}
                        className="px-2.5 py-1.5 text-[10px] font-extrabold text-gray-600 hover:text-magenta bg-slate-50 hover:bg-slate-100 border border-gray-200/60 rounded-lg transition"
                      >
                        Email text
                      </button>
                      <Link
                        to={`/offboarding/certificate/${a.id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 text-[10px] font-extrabold text-magenta bg-magenta/5 hover:bg-magenta/10 border border-magenta/15 rounded-lg transition"
                      >
                        Print Cert
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Alumni Emails */}
      {viewingAlumni && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Outreach Email Record</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Alumni: {viewingAlumni.user.name} (#{viewingAlumni.cube_number})</p>
              </div>
              <button 
                onClick={() => setViewingAlumni(null)} 
                className="text-gray-400 hover:text-gray-650 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-150 w-max">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('tr')}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md transition flex items-center gap-0.5 ${
                    activeLangTab === 'tr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span>TURKISH</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md transition flex items-center gap-0.5 ${
                    activeLangTab === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span>ENGLISH</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-gray-100 p-4 rounded-xl max-h-[350px] overflow-y-auto">
                <pre className="text-xs font-semibold text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeLangTab === 'tr' ? viewingAlumni.offboarding_record?.email_text_tr : viewingAlumni.offboarding_record?.email_text_en}
                </pre>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingAlumni(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
