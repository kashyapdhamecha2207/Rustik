import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Star, Clock, Sparkles, Plus, X, 
  CheckCircle, AlertCircle, Award, ShieldAlert 
} from 'lucide-react';

export const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Employee states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    password: '',
    role: 'barber',
    specialties: '',
    experience: '3',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    instagram: '',
    phone: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchEmployees = async () => {
    try {
      const response = await apiFetch('/auth/employees');
      const data = await response.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees().then(() => setLoading(false));
  }, []);

  const handleStatusToggle = async (empId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await apiFetch(`/auth/employees/${empId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchEmployees();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogAttendance = async (empId, status) => {
    try {
      const response = await apiFetch(`/auth/employees/${empId}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ date: attendanceDate, status })
      });
      const data = await response.json();
      if (data.success) {
        fetchEmployees();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newEmp.name || !newEmp.email || !newEmp.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    const specsArray = newEmp.specialties 
      ? newEmp.specialties.split(',').map(s => s.trim()) 
      : [];

    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...newEmp,
          specialties: specsArray,
          experience: Number(newEmp.experience)
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setNewEmp({
          name: '',
          email: '',
          password: '',
          role: 'barber',
          specialties: '',
          experience: '3',
          bio: '',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
          instagram: '',
          phone: ''
        });
        fetchEmployees();
      } else {
        setErrorMsg(data.message || 'Failed to add employee.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  const isEditable = user?.role === 'owner' || user?.role === 'manager';

  return (
    <div className="flex flex-col gap-6 w-full text-stone-200">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">STAFF DIRECTORY</h1>
          <span className="text-xs text-stone-400 font-sans mt-1">Audit team specializations, manage active profiles, and record shifts attendance.</span>
        </div>
        
        {isEditable && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest rounded shadow-md flex items-center gap-2"
          >
            <Plus size={14} /> Add New Employee
          </button>
        )}
      </div>

      {/* Attendance date control */}
      <div className="bg-luxury-dark border border-luxury-gray p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-gold" />
          <span className="font-outfit text-xs font-bold text-white tracking-wider uppercase">Attendance Logs Date</span>
        </div>
        <input 
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs w-44 font-sans focus:outline-none"
        />
      </div>

      {/* Employee grids */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-luxury-dark border border-luxury-gray py-16 text-center text-stone-500 font-outfit text-xs rounded-lg select-none">
          No employees found in the database directory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {employees.map((emp) => {
            const todayAttendance = emp.attendance?.find(a => a.date === attendanceDate);
            return (
              <div 
                key={emp._id}
                className={`bg-luxury-dark border rounded-lg p-5 md:p-6 flex flex-col justify-between gap-6 transition-all duration-200 ${
                  emp.status === 'inactive' ? 'border-luxury-gray opacity-50' : 'border-luxury-gray hover:border-gold/15'
                }`}
              >
                {/* Employee details card */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Avatar thumbnail */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-gold/20 shrink-0 relative">
                    <img 
                      src={emp.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'} 
                      alt={emp.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Meta details */}
                  <div className="flex-grow flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-outfit text-base font-bold text-white uppercase truncate">{emp.name}</h3>
                        <span className="text-[9px] text-gold font-medium uppercase tracking-widest mt-1 block">{emp.role}</span>
                      </div>
                      
                      {/* Active/Inactive toggler */}
                      {isEditable && (
                        <button
                          onClick={() => handleStatusToggle(emp._id, emp.status)}
                          className={`font-outfit text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-colors ${
                            emp.status === 'active' 
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/25 hover:bg-rose-500 hover:text-white' 
                              : 'bg-rose-950/20 text-rose-400 border-rose-500/25 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>

                    <div className="font-sans text-[11px] text-stone-400 mt-2 flex flex-col gap-1">
                      <p>Email: {emp.email}</p>
                      <p>Phone: {emp.phone || 'N/A'}</p>
                      {emp.role === 'barber' && (
                        <>
                          <p className="flex items-center gap-1">
                            Experience: <span className="text-white font-semibold">{emp.experience} Yrs</span> | Rating: 
                            <span className="text-gold font-semibold flex items-center gap-0.5 ml-1">
                              <Star size={10} fill="currentColor" /> {emp.rating?.toFixed(1) || '5.0'}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {emp.specialties?.map((spec, idx) => (
                              <span key={idx} className="text-[8px] font-outfit font-semibold uppercase tracking-wider bg-gold/10 text-gold px-1.5 py-0.5 rounded border border-gold/15">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attendance controller */}
                <div className="border-t border-luxury-gray pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest font-outfit">
                    <span>Attendance Log: {attendanceDate}</span>
                    <span className={`uppercase font-semibold ${
                      todayAttendance?.status === 'present' ? 'text-emerald-400' :
                      todayAttendance?.status === 'absent' ? 'text-rose-400' :
                      todayAttendance?.status === 'leave' ? 'text-amber-400' : 'text-stone-500'
                    }`}>
                      {todayAttendance?.status || 'No Log'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleLogAttendance(emp._id, 'present')}
                      className={`py-1.5 rounded font-outfit text-[9px] font-bold uppercase tracking-wider border transition-all ${
                        todayAttendance?.status === 'present'
                          ? 'bg-emerald-950/45 text-emerald-400 border-emerald-500/30'
                          : 'bg-luxury-black border-luxury-gray text-stone-400 hover:text-white'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleLogAttendance(emp._id, 'leave')}
                      className={`py-1.5 rounded font-outfit text-[9px] font-bold uppercase tracking-wider border transition-all ${
                        todayAttendance?.status === 'leave'
                          ? 'bg-amber-950/45 text-amber-400 border-amber-500/30'
                          : 'bg-luxury-black border-luxury-gray text-stone-400 hover:text-white'
                      }`}
                    >
                      On Leave
                    </button>
                    <button
                      onClick={() => handleLogAttendance(emp._id, 'absent')}
                      className={`py-1.5 rounded font-outfit text-[9px] font-bold uppercase tracking-wider border transition-all ${
                        todayAttendance?.status === 'absent'
                          ? 'bg-rose-950/45 text-rose-400 border-rose-500/30'
                          : 'bg-luxury-black border-luxury-gray text-stone-400 hover:text-white'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-luxury-dark border-2 border-gold max-w-lg w-full rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-luxury-gray flex items-center justify-between">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">REGISTER EMPLOYEE</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4 font-sans text-xs text-stone-300">
              {errorMsg && (
                <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-2 rounded">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Employee Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.name}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Marcus Gold"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="marcus@rustik.com"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Password *</label>
                  <input
                    type="password"
                    required
                    value={newEmp.password}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="password123"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Business Role *</label>
                  <select
                    value={newEmp.role}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, role: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="barber">Barber / Artist</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Desk Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Phone Contact</label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 012-3456"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Experience (Years)</label>
                  <input
                    type="number"
                    value={newEmp.experience}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, experience: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Specialties (Comma Separated)</label>
                <input
                  type="text"
                  value={newEmp.specialties}
                  onChange={(e) => setNewEmp(prev => ({ ...prev, specialties: e.target.value }))}
                  placeholder="Classic Fade, Razor Shave, Beard sculpting"
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Short Bio & Background</label>
                <textarea
                  value={newEmp.bio}
                  onChange={(e) => setNewEmp(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Artist description and work timeline..."
                  rows={2}
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-white uppercase tracking-wider font-outfit text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Employees;
