import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { Users, Rocket, Calendar, Award, AlertCircle, ArrowUpRight, TrendingUp, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error || 'Error loading dashboard'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Heading */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations</h1>
          <p className="text-gray-500 mt-1">Real-time status of the Iceberg X fellowship programme.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/applications"
            className="flex items-center gap-2 bg-white text-magenta border border-magenta/20 px-4 py-2.5 font-bold text-xs rounded-xl hover:bg-magenta/5 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Review Applications</span>
            {data.pendingApplicationsCount > 0 && (
              <span className="ml-1 bg-magenta text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {data.pendingApplicationsCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 font-bold text-xs rounded-xl hover:bg-black transition-colors shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Cubes</p>
            <h2 className="text-3xl font-extrabold mt-0.5">{data.totalCubes}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Cubes</p>
            <h2 className="text-3xl font-extrabold mt-0.5">{data.activeCubes}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Missions</p>
            <h2 className="text-3xl font-extrabold mt-0.5">{data.activeMissions}</h2>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Progression Recommendations & Inactive Risk */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Progression card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-magenta" />
                <span>Progression Recommendations</span>
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2.5 py-1 rounded-full">
                {data.progressionCubes?.length || 0} Recommended
              </span>
            </div>

            {data.progressionCubes && data.progressionCubes.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-50">
                {data.progressionCubes.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <Link to={`/cubes/${item.cubeId}`} className="font-bold hover:text-magenta transition-colors duration-200">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Current: <span className="font-semibold text-gray-600">{item.current_level.replace('_', ' ')}</span> · Recommended by {item.by}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-magenta bg-magenta/5 border border-magenta/10 px-3 py-1 rounded-full">
                      {item.recommended.replace(/_/g, ' ').replace('Consider for ', '')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No current progression recommendations.</p>
            )}
          </div>

          {/* Inactive Risk Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>Cubes at Inactive Risk</span>
              </h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                {data.inactiveRiskCubes?.length || 0} Risked
              </span>
            </div>

            {data.inactiveRiskCubes && data.inactiveRiskCubes.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-50">
                {data.inactiveRiskCubes.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 animate-pulse">
                    <div>
                      <Link to={`/cubes/${item.cubeId}`} className="font-bold hover:text-red-600 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Flagged by mentor {item.by}</p>
                    </div>
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">Needs support</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No Cubes flagged at inactive risk.</p>
            )}
          </div>
        </div>

        {/* Sidebar: Upcoming Demo Days & Mission statuses */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Demo Days */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-magenta" />
              <span>Upcoming Demo Days</span>
            </h3>

            {data.upcomingDemoDays && data.upcomingDemoDays.length > 0 ? (
              <div className="flex flex-col gap-4">
                {data.upcomingDemoDays.map((day: any) => (
                  <div key={day.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-gray-100/70 transition-colors">
                    <h4 className="font-bold text-sm">{day.title}</h4>
                    <p className="text-xs text-magenta font-semibold mt-1">
                      {new Date(day.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    {day.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{day.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No upcoming Demo Days scheduled.</p>
            )}
            <Link to="/demodays" className="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-bold transition-colors">
              Manage Demo Days
            </Link>
          </div>

          {/* Recent Badges awarded */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-magenta" />
              <span>Recent Badges</span>
            </h3>

            {data.recentBadges && data.recentBadges.length > 0 ? (
              <div className="flex flex-col gap-3">
                {data.recentBadges.map((award: any) => (
                  <div key={award.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-xs">
                      {award.badge.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {award.cube.user.name} earned <span className="text-magenta">{award.badge.name}</span>
                      </p>
                      <p className="text-[10px] text-gray-400">{new Date(award.awarded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No recent badges awarded.</p>
            )}
            <Link to="/badges" className="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-bold transition-colors">
              Manage Badges
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Demo Submissions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
        <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3">
          Recent Demo Submissions
        </h3>

        {data.recentDemos && data.recentDemos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase">
                  <th className="pb-3">Demo Title</th>
                  <th className="pb-3">Mission</th>
                  <th className="pb-3">Submitted By</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentDemos.map((demo: any) => (
                  <tr key={demo.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-bold">{demo.title}</td>
                    <td className="py-3 text-gray-500">{demo.mission.title}</td>
                    <td className="py-3 text-gray-500">{demo.submitted_by.name}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(demo.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/missions/${demo.mission_id}`} className="text-magenta hover:underline text-xs font-bold">
                        View Mission →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-4 text-center">No recent demo submissions.</p>
        )}
      </div>
    </div>
  );
};
