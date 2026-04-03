import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { User, Teacher, Student } from '../../store/mockData';

interface ProfileViewProps {
  userId: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const { state, dispatch } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Find current user object
  const user = state.users.find(u => u.id === userId);
  
  // Role-specific data
  const teacher = user?.role === 'teacher' ? state.teachers.find(t => t.id === user.linkedId) : null;
  const student = user?.role === 'student' ? state.students.find(s => s.id === user.linkedId) : null;
  // If parent, the parent object is the user itself in our current model, but we link to student for educational/context
  const linkedStudent = user?.role === 'parent' ? state.students.find(s => s.id === user.linkedId) : null;

  // Local state for editing fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    wage: 0,
    icNo: '',
    qualification: '',
    experience: '',
    educationBackground: '',
    intakeDate: '',
    dob: '',
    pob: '',
    race: '',
    religion: '',
    gender: 'M' as 'M' | 'F',
    bloodType: '',
    maritalStatus: '',
    citizenship: '',
    familyIncome: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Detailed Parent Profile
    relation: '',
    postcode: '',
    city: '',
    district: '',
    stateName: '',
    country: '',
    parliament: '',
    job: '',
    sector: '',
    officePhone: '',
    childCount: 0,
    reference: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || teacher?.phone || student?.phone || '', 
        address: user.address || '',
        wage: user.wage || 0,
        icNo: teacher?.icNo || student?.icNo || '',
        qualification: teacher?.qualification || '',
        experience: teacher?.experience || '',
        educationBackground: student?.educationBackground || '',
        intakeDate: student?.intakeDate || student?.enrolledDate || '',
        dob: student?.dob || '',
        pob: student?.pob || '',
        race: student?.race || '',
        religion: student?.religion || '',
        gender: student?.gender || 'M',
        bloodType: student?.bloodType || '',
        maritalStatus: student?.maritalStatus || '',
        citizenship: student?.citizenship || 'MAL',
        familyIncome: student?.familyIncome || '',
        medicalHistory: teacher?.medicalHistory || student?.medicalHistory || '',
        emergencyContactName: teacher?.emergencyContactName || student?.emergencyContactName || '',
        emergencyContactPhone: teacher?.emergencyContactPhone || student?.emergencyContactPhone || '',
        // Parent detailed profile logic
        relation: user.relation || '',
        postcode: user.postcode || '',
        city: user.city || '',
        district: user.district || '',
        stateName: user.stateName || '',
        country: user.country || 'MAL',
        parliament: user.parliament || '',
        job: user.job || '',
        sector: user.sector || '',
        officePhone: user.officePhone || '',
        childCount: user.childCount || 0,
        reference: user.reference || '',
      });
    }
  }, [user, teacher, student]);

  if (!user) return <div className="p-8 text-slate-500">Log masuk untuk melihat profil.</div>;

  const handleSave = () => {
    // 1. Update User (Basics + Parent fields)
    dispatch({
      type: 'EDIT_USER',
      payload: {
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        wage: formData.wage,
        // Detailed Profile
        relation: formData.relation,
        postcode: formData.postcode,
        city: formData.city,
        district: formData.district,
        stateName: formData.stateName,
        country: formData.country,
        parliament: formData.parliament,
        job: formData.job,
        sector: formData.sector,
        officePhone: formData.officePhone,
        childCount: formData.childCount,
        reference: formData.reference,
      }
    });

    // 2. Update Teacher specifically if applicable
    if (teacher) {
      dispatch({
        type: 'EDIT_TEACHER',
        payload: {
          id: teacher.id as any,
          name: formData.name,
          phone: formData.phone,
          icNo: formData.icNo,
          qualification: formData.qualification,
          experience: formData.experience,
          medicalHistory: formData.medicalHistory,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
        }
      });
    }

    // 3. Update Student specifically if applicable
    if (student) {
      dispatch({
        type: 'EDIT_STUDENT',
        payload: {
          id: student.id,
          name: formData.name,
          icNo: formData.icNo,
          gender: formData.gender,
          bloodType: formData.bloodType,
          maritalStatus: formData.maritalStatus,
          dob: formData.dob,
          pob: formData.pob,
          citizenship: formData.citizenship,
          race: formData.race,
          religion: formData.religion,
          familyIncome: formData.familyIncome,
          intakeDate: formData.intakeDate,
          medicalHistory: formData.medicalHistory,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
        }
      });
    }

    setIsEditing(false);
  };

  const renderField = (label: string, value: string | number, name: string, type: string = 'text', readOnly: boolean = false) => (
    <div className="border-b border-slate-100 py-3.5 flex flex-col md:flex-row md:items-center">
      <span className="w-full md:w-1/3 text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose">{label}</span>
      <div className="w-full md:w-2/3">
        {isEditing && !readOnly ? (
          type === 'select' ? (
            <select
              value={value}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#6FC7CB] outline-none"
            >
              {name === 'gender' ? (
                <>
                  <option value="M">LELAKI (M)</option>
                  <option value="F">PEREMPUAN (F)</option>
                </>
              ) : null}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#6FC7CB] outline-none transition-all"
            />
          )
        ) : (
          <span className="text-slate-700 font-medium text-[15px]">{value || <span className="text-slate-300 italic">Tiada Maklumat</span>}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-width-1200 mx-auto">
        
        {/* Page Title & Subtitle like AI page */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Profil Saya — <span className="text-slate-500 font-medium">{user.name.toLowerCase()}</span>
          </h2>
          <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">
            Urus maklumat peribadi, latar belakang pendidikan, dan tetapan kecemasan dalam satu portal berpusat.
          </p>
        </div>

        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6FC7CB] to-[#5FB3B7] p-1 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
              <p className="text-slate-400 font-semibold text-[13px] uppercase tracking-wider">{user.role} • ID: {user.linkedId || user.id}</p>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              isEditing 
              ? 'bg-[#6FC7CB] text-white hover:bg-[#5FB3B7] shadow-lg shadow-cyan-100' 
              : 'border-2 border-[#6FC7CB] text-[#6FC7CB] hover:bg-[#E8F6F7]'
            }`}
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                SIMPAN PROFIL
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                EDIT PROFIL
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6FC7CB]"></div>
               <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="text-[#6FC7CB]">●</span> PERSONAL INFORMATION
               </h2>
               
               <div className="space-y-1">
                 {student && renderField('Student ID', user.linkedId || user.id, 'linkedId', 'text', true)}
                 {renderField('Student Name', formData.name, 'name', 'text', true)}
                 {(teacher || student) && renderField('IC/Passport No.', formData.icNo, 'icNo', 'text', true)}
                 {student && (
                   <>
                     {renderField('Gender', formData.gender, 'gender', 'select')}
                     {renderField('Marital Status', formData.maritalStatus, 'maritalStatus')}
                     {renderField('Blood Type', formData.bloodType, 'bloodType')}
                     {renderField('Date of Birth', formData.dob, 'dob', 'date')}
                     {renderField('Place of Birth', formData.pob, 'pob')}
                     {renderField('Citizenship', formData.citizenship, 'citizenship')}
                     {renderField('Race', formData.race, 'race')}
                     {renderField('Religion', formData.religion, 'religion')}
                     {renderField('Family Income', formData.familyIncome, 'familyIncome')}
                     {renderField('Intake Date', formData.intakeDate || student.enrolledDate, 'intakeDate', 'text', true)}
                   </>
                 )}
                 {teacher && (
                   <>
                     {renderField('Jantina', formData.gender, 'gender', 'select')}
                     {renderField('Kelayakan', formData.qualification, 'qualification')}
                     {renderField('Pengalaman Mengajar (Tahun)', formData.experience, 'experience')}
                   </>
                 )}
               </div>
            </div>

            {/* Medical & Emergency Section */}
            {user.role !== 'parent' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="text-red-400">●</span> MEDICAL & EMERGENCY
                </h2>
                
                <div className="space-y-1">
                    {renderField('Maklumat Kesihatan (Alergi dll)', formData.medicalHistory, 'medicalHistory')}
                    <div className="pt-4 mt-4 border-t border-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Hubungi Semasa Kecemasan</p>
                      {renderField('Nama Waris', formData.emergencyContactName, 'emergencyContactName')}
                      {renderField('No. Telefon Waris', formData.emergencyContactPhone, 'emergencyContactPhone')}
                    </div>
                </div>
              </div>
            )}

            {/* Financial / Professional Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5FB3B7]"></div>
               <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="text-[#5FB3B7]">●</span> {user.role === 'teacher' ? 'PROFESSIONAL' : user.role === 'parent' ? 'FINANCIAL' : 'ACADEMIC'} DETAILS
               </h2>
               
               <div className="space-y-1">
                 {user.role === 'teacher' && (
                   <>
                     {renderField('Kelayakan', formData.qualification, 'qualification')}
                     {renderField('Pengalaman Mengajar (Tahun)', formData.experience, 'experience')}
                   </>
                 )}
                 {user.role === 'parent' && (
                   <>
                     {renderField('Pendapatan Bulanan (RM)', formData.wage, 'wage', 'number')}
                   </>
                 )}
                 {student && (
                   <>
                     {renderField('Tarikh Kemasukan', formData.intakeDate || student.enrolledDate, 'intakeDate', 'text', true)}
                     {renderField('Kumpulan Darah', formData.bloodType, 'bloodType')}
                   </>
                 )}
               </div>
            </div>

            {/* Parent Registry - Detailed (Only for parents) */}
            {user.role === 'parent' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3b82f6]"></div>
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="text-[#3b82f6]">●</span> HOUSEHOLD & EMPLOYMENT
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {renderField('Hubungan', formData.relation, 'relation')}
                  {renderField('Pekerjaan', formData.job, 'job')}
                  {renderField('Sektor', formData.sector, 'sector')}
                  {renderField('Gaji/Pendapatan Bulanan', formData.wage, 'wage', 'number')}
                  {renderField('No. Tel Pejabat', formData.officePhone, 'officePhone')}
                  {renderField('Jumlah Anak', formData.childCount, 'childCount', 'number')}
                  {renderField('Rujukan', formData.reference, 'reference')}
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Butiran Alamat & Parlimen</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {renderField('Poskod', formData.postcode, 'postcode')}
                    {renderField('Bandar', formData.city, 'city')}
                    {renderField('Daerah (Kod)', formData.district, 'district')}
                    {renderField('Negeri (Kod)', formData.stateName, 'stateName')}
                    {renderField('Negara', formData.country, 'country')}
                    {renderField('Parlimen', formData.parliament, 'parliament')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Details Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
               <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="text-slate-300">●</span> CONTACT DETAILS
               </h2>
               
               <div className="space-y-1">
                 {renderField('Email', formData.email, 'email', 'email')}
                 {renderField('No. Telefon', formData.phone, 'phone')}
                 {renderField('Alamat', formData.address, 'address')}
               </div>
            </div>

            {/* Quick Status */}
            <div className="bg-gradient-to-br from-[#6FC7CB] to-[#5FB3B7] rounded-3xl p-8 text-white shadow-lg shadow-cyan-50">
               <h3 className="font-bold text-lg mb-4 opacity-100">Status Akaun</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center opacity-90">
                   <span className="text-sm">Taraf</span>
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{user.role}</span>
                 </div>
                 <div className="flex justify-between items-center opacity-90">
                   <span className="text-sm">Status</span>
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">AKTIF</span>
                 </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-white/20 text-center">
                 <p className="text-xs opacity-80 mb-2">Terakhir dikemas kini</p>
                 <p className="text-sm font-bold">{new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
