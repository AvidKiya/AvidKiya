'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioData, defaultData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';
import {
  isAdminAuthenticated, setAdminAuthenticated,
  checkAdminPassword, savePortfolioData, getAdminPassword, setAdminPassword
} from '@/lib/storage';

interface Props {
  data: PortfolioData;
  lang: Language;
  onClose: () => void;
  onSave: (data: PortfolioData) => void;
}

type Tab = 'personal' | 'bios' | 'skills' | 'projects' | 'experience' | 'education' | 'contact' | 'password';

export default function AdminPanel({ data, lang, onClose, onSave }: Props) {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [editData, setEditData] = useState<PortfolioData>(JSON.parse(JSON.stringify(data)));
  const [saveMsg, setSaveMsg] = useState('');
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";
  const dir = isFa ? 'rtl' : 'ltr';

  // New password fields
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChangeMsg, setPassChangeMsg] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) setAuthed(true);
  }, []);

  const handleLogin = () => {
    if (checkAdminPassword(passInput)) {
      setAdminAuthenticated(true);
      setAuthed(true);
      setPassError('');
    } else {
      setPassError(t(lang, 'wrongPassword'));
    }
  };

  const handleSave = () => {
    savePortfolioData(editData);
    onSave(editData);
    setSaveMsg(t(lang, 'savedSuccess'));
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    onClose();
  };

  const updatePersonal = (key: keyof PortfolioData['personal'], value: string) => {
    setEditData(prev => ({ ...prev, personal: { ...prev.personal, [key]: value } }));
  };

  const updateBios = (key: keyof PortfolioData['bios'], value: string) => {
    setEditData(prev => ({ ...prev, bios: { ...prev.bios, [key]: value } }));
  };

  const updateContact = (key: keyof PortfolioData['contact'], value: string) => {
    setEditData(prev => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
  };

  const addSkill = () => {
    setEditData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: 'New Skill', nameFa: 'مهارت جدید', level: 80 }]
    }));
  };

  const updateSkill = (i: number, key: string, value: string | number) => {
    setEditData(prev => {
      const skills = [...prev.skills];
      skills[i] = { ...skills[i], [key]: value };
      return { ...prev, skills };
    });
  };

  const removeSkill = (i: number) => {
    if (!confirm(t(lang, 'confirmDelete'))) return;
    setEditData(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));
  };

  const addProject = () => {
    const id = Date.now().toString();
    setEditData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id, title: 'New Project', titleFa: 'پروژه جدید',
        description: '', descriptionFa: '', tech: [], link: '', github: '',
      }]
    }));
  };

  const updateProject = (i: number, key: string, value: string | string[]) => {
    setEditData(prev => {
      const projects = [...prev.projects];
      projects[i] = { ...projects[i], [key]: value };
      return { ...prev, projects };
    });
  };

  const removeProject = (i: number) => {
    if (!confirm(t(lang, 'confirmDelete'))) return;
    setEditData(prev => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));
  };

  const addExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(), company: '', companyFa: '',
        role: '', roleFa: '', period: '', periodFa: '', description: '', descriptionFa: ''
      }]
    }));
  };

  const updateExperience = (i: number, key: string, value: string) => {
    setEditData(prev => {
      const experience = [...prev.experience];
      experience[i] = { ...experience[i], [key]: value };
      return { ...prev, experience };
    });
  };

  const removeExperience = (i: number) => {
    if (!confirm(t(lang, 'confirmDelete'))) return;
    setEditData(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(), school: '', schoolFa: '',
        degree: '', degreeFa: '', period: '', periodFa: ''
      }]
    }));
  };

  const updateEducation = (i: number, key: string, value: string) => {
    setEditData(prev => {
      const education = [...prev.education];
      education[i] = { ...education[i], [key]: value };
      return { ...prev, education };
    });
  };

  const removeEducation = (i: number) => {
    if (!confirm(t(lang, 'confirmDelete'))) return;
    setEditData(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));
  };

  const handleChangePassword = () => {
    if (!newPass) { setPassChangeMsg('رمز جدید وارد کنید'); return; }
    if (newPass !== confirmPass) { setPassChangeMsg('رمزها یکسان نیستند'); return; }
    setAdminPassword(newPass);
    setPassChangeMsg('✓ رمز عبور تغییر یافت');
    setNewPass(''); setConfirmPass('');
    setTimeout(() => setPassChangeMsg(''), 3000);
  };

  const inputStyle: React.CSSProperties = {
    background: '#001100',
    border: '1px solid #00ff0055',
    color: '#00ff00',
    fontFamily: fontStyle,
    padding: '8px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 4,
    display: 'block',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 16,
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'personal', label: isFa ? 'شخصی' : 'Personal' },
    { key: 'bios', label: 'BIOS' },
    { key: 'skills', label: isFa ? 'مهارت‌ها' : 'Skills' },
    { key: 'projects', label: isFa ? 'پروژه‌ها' : 'Projects' },
    { key: 'experience', label: isFa ? 'تجربه' : 'Experience' },
    { key: 'education', label: isFa ? 'تحصیلات' : 'Education' },
    { key: 'contact', label: isFa ? 'تماس' : 'Contact' },
    { key: 'password', label: isFa ? 'رمز عبور' : 'Password' },
  ];

  if (!authed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: fontStyle, direction: dir as 'ltr' | 'rtl',
        }}
      >
        <div style={{
          border: '3px solid #00ff00',
          padding: 40,
          maxWidth: 400,
          width: '90%',
          background: '#000',
        }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#39ff14', marginBottom: 8, textAlign: 'center' }}>
            ⚙ {t(lang, 'adminLogin')}
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, textAlign: 'center', marginBottom: 24 }}>
            ADMIN AUTHENTICATION REQUIRED
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>{t(lang, 'password')}</label>
            <input
              type="password"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={inputStyle}
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {passError && (
            <div style={{ color: '#ff4444', fontSize: 13, marginBottom: 16 }}>{passError}</div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: isFa ? 'flex-end' : 'flex-start' }}>
            <button onClick={handleLogin} style={{
              background: '#00ff00', color: '#000', padding: '10px 24px',
              fontSize: 14, fontWeight: 'bold', fontFamily: fontStyle, cursor: 'pointer', border: 'none',
            }}>
              {t(lang, 'login')}
            </button>
            <button onClick={onClose} style={{
              background: 'transparent', color: '#00ff00', padding: '10px 24px',
              fontSize: 14, fontFamily: fontStyle, cursor: 'pointer',
              border: '1px solid #00ff00',
            }}>
              {t(lang, 'cancel')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-overlay"
      style={{ fontFamily: fontStyle, direction: dir as 'ltr' | 'rtl' }}
    >
      {/* Admin Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#000', borderBottom: '1px solid #00ff00',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        flexDirection: isFa ? 'row-reverse' : 'row',
      }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#39ff14' }}>
          ⚙ {t(lang, 'adminPanel')}
        </div>

        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: '#39ff14', fontSize: 13, background: '#001100', padding: '4px 12px', border: '1px solid #39ff14' }}
          >
            {saveMsg}
          </motion.div>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={handleSave} style={{
          background: '#00ff00', color: '#000', padding: '8px 20px',
          fontWeight: 'bold', fontFamily: fontStyle, cursor: 'pointer',
          border: 'none', fontSize: 13,
        }}>
          💾 {t(lang, 'save')}
        </button>
        <button onClick={handleLogout} style={{
          background: 'transparent', color: '#ff4444', padding: '8px 16px',
          fontFamily: fontStyle, cursor: 'pointer', border: '1px solid #ff4444', fontSize: 13,
        }}>
          {t(lang, 'logout')}
        </button>
        <button onClick={onClose} style={{
          background: 'transparent', color: '#00ff00', padding: '8px 16px',
          fontFamily: fontStyle, cursor: 'pointer', border: '1px solid #00ff00', fontSize: 13,
        }}>
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 57px)' }}>
        {/* Sidebar */}
        <div style={{
          width: 180, borderRight: isFa ? 'none' : '1px solid #00ff0033',
          borderLeft: isFa ? '1px solid #00ff0033' : 'none',
          padding: '16px 0', flexShrink: 0,
          background: '#000200',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                width: '100%', padding: '12px 20px',
                background: activeTab === tab.key ? '#001a00' : 'transparent',
                color: activeTab === tab.key ? '#39ff14' : '#00ff0099',
                borderLeft: !isFa && activeTab === tab.key ? '3px solid #00ff00' : '3px solid transparent',
                borderRight: isFa && activeTab === tab.key ? '3px solid #00ff00' : '3px solid transparent',
                fontFamily: fontStyle, fontSize: 13, cursor: 'pointer',
                textAlign: isFa ? 'right' : 'left',
                transition: 'all 0.2s', border: 'none',
                borderLeftStyle: 'solid',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto', maxHeight: 'calc(100vh - 57px)' }}>

          {/* PERSONAL */}
          {activeTab === 'personal' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'personalInfo')}</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Name (EN)" style={fieldStyle}>
                  <input style={inputStyle} value={editData.personal.name} onChange={e => updatePersonal('name', e.target.value)} />
                </Field>
                <Field label="نام (FA)" style={fieldStyle}>
                  <input style={inputStyle} value={editData.personal.nameFa} onChange={e => updatePersonal('nameFa', e.target.value)} dir="rtl" />
                </Field>
                <Field label="Title (EN)" style={fieldStyle}>
                  <input style={inputStyle} value={editData.personal.title} onChange={e => updatePersonal('title', e.target.value)} />
                </Field>
                <Field label="عنوان (FA)" style={fieldStyle}>
                  <input style={inputStyle} value={editData.personal.titleFa} onChange={e => updatePersonal('titleFa', e.target.value)} dir="rtl" />
                </Field>
              </div>
              <Field label="Bio (EN)" style={fieldStyle}>
                <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={editData.personal.bio} onChange={e => updatePersonal('bio', e.target.value)} />
              </Field>
              <Field label="بیوگرافی (FA)" style={fieldStyle}>
                <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={editData.personal.bioFa} onChange={e => updatePersonal('bioFa', e.target.value)} dir="rtl" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Email" style={fieldStyle}><input style={inputStyle} value={editData.personal.email} onChange={e => updatePersonal('email', e.target.value)} /></Field>
                <Field label="GitHub URL" style={fieldStyle}><input style={inputStyle} value={editData.personal.github} onChange={e => updatePersonal('github', e.target.value)} /></Field>
                <Field label="LinkedIn URL" style={fieldStyle}><input style={inputStyle} value={editData.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} /></Field>
                <Field label="Twitter URL" style={fieldStyle}><input style={inputStyle} value={editData.personal.twitter} onChange={e => updatePersonal('twitter', e.target.value)} /></Field>
                <Field label="Website URL" style={fieldStyle}><input style={inputStyle} value={editData.personal.website} onChange={e => updatePersonal('website', e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* BIOS */}
          {activeTab === 'bios' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'biosSettings')}</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Company (EN)" style={fieldStyle}><input style={inputStyle} value={editData.bios.company} onChange={e => updateBios('company', e.target.value)} /></Field>
                <Field label="شرکت (FA)" style={fieldStyle}><input style={inputStyle} value={editData.bios.companyFa} onChange={e => updateBios('companyFa', e.target.value)} dir="rtl" /></Field>
                <Field label="Release Date (MM/DD/YYYY)" style={fieldStyle}><input style={inputStyle} value={editData.bios.releaseDate} onChange={e => updateBios('releaseDate', e.target.value)} placeholder="01/13/2000" /></Field>
                <Field label="BIOS Version" style={fieldStyle}><input style={inputStyle} value={editData.bios.biosVersion} onChange={e => updateBios('biosVersion', e.target.value)} placeholder="V1.0" /></Field>
                <Field label="Copyright Text" style={fieldStyle}><input style={inputStyle} value={editData.bios.copyright} onChange={e => updateBios('copyright', e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'skillsSection')}</SectionTitle>
              {editData.skills.map((skill, i) => (
                <div key={i} style={{ border: '1px solid #00ff0033', padding: 16, marginBottom: 12, background: '#000500', display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: 12, alignItems: 'center' }}>
                  <Field label="Name (EN)" style={{}}>
                    <input style={inputStyle} value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
                  </Field>
                  <Field label="نام (FA)" style={{}}>
                    <input style={inputStyle} value={skill.nameFa} onChange={e => updateSkill(i, 'nameFa', e.target.value)} dir="rtl" />
                  </Field>
                  <Field label="Level (0-100)" style={{}}>
                    <input type="number" min={0} max={100} style={inputStyle} value={skill.level} onChange={e => updateSkill(i, 'level', parseInt(e.target.value) || 0)} />
                  </Field>
                  <button onClick={() => removeSkill(i)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '8px', cursor: 'pointer', fontFamily: fontStyle, alignSelf: 'flex-end' }}>✕</button>
                </div>
              ))}
              <button onClick={addSkill} style={{ background: '#001100', color: '#00ff00', border: '1px solid #00ff00', padding: '10px 20px', cursor: 'pointer', fontFamily: fontStyle, marginTop: 8 }}>
                + {t(lang, 'add')}
              </button>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'projectsSection')}</SectionTitle>
              {editData.projects.map((project, i) => (
                <div key={project.id} style={{ border: '1px solid #00ff0033', padding: 20, marginBottom: 16, background: '#000500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#39ff14', fontWeight: 'bold' }}>{isFa ? 'پروژه' : 'Project'} {i + 1}</span>
                    <button onClick={() => removeProject(i)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '4px 12px', cursor: 'pointer', fontFamily: fontStyle }}>✕ {t(lang, 'delete')}</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Title (EN)" style={fieldStyle}><input style={inputStyle} value={project.title} onChange={e => updateProject(i, 'title', e.target.value)} /></Field>
                    <Field label="عنوان (FA)" style={fieldStyle}><input style={inputStyle} value={project.titleFa} onChange={e => updateProject(i, 'titleFa', e.target.value)} dir="rtl" /></Field>
                  </div>
                  <Field label="Description (EN)" style={fieldStyle}><textarea style={{ ...inputStyle, height: 60, resize: 'vertical' }} value={project.description} onChange={e => updateProject(i, 'description', e.target.value)} /></Field>
                  <Field label="توضیح (FA)" style={fieldStyle}><textarea style={{ ...inputStyle, height: 60, resize: 'vertical' }} value={project.descriptionFa} onChange={e => updateProject(i, 'descriptionFa', e.target.value)} dir="rtl" /></Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Live URL" style={fieldStyle}><input style={inputStyle} value={project.link} onChange={e => updateProject(i, 'link', e.target.value)} placeholder="https://" /></Field>
                    <Field label="GitHub URL" style={fieldStyle}><input style={inputStyle} value={project.github} onChange={e => updateProject(i, 'github', e.target.value)} placeholder="https://github.com/..." /></Field>
                  </div>
                  <Field label="Technologies (comma separated)" style={fieldStyle}>
                    <input style={inputStyle} value={project.tech.join(', ')} onChange={e => updateProject(i, 'tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, ..." />
                  </Field>
                </div>
              ))}
              <button onClick={addProject} style={{ background: '#001100', color: '#00ff00', border: '1px solid #00ff00', padding: '10px 20px', cursor: 'pointer', fontFamily: fontStyle }}>
                + {t(lang, 'add')}
              </button>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'experienceSection')}</SectionTitle>
              {editData.experience.map((exp, i) => (
                <div key={exp.id} style={{ border: '1px solid #00ff0033', padding: 20, marginBottom: 16, background: '#000500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#39ff14', fontWeight: 'bold' }}>{isFa ? 'تجربه' : 'Experience'} {i + 1}</span>
                    <button onClick={() => removeExperience(i)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '4px 12px', cursor: 'pointer', fontFamily: fontStyle }}>✕ {t(lang, 'delete')}</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Company (EN)" style={fieldStyle}><input style={inputStyle} value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} /></Field>
                    <Field label="شرکت (FA)" style={fieldStyle}><input style={inputStyle} value={exp.companyFa} onChange={e => updateExperience(i, 'companyFa', e.target.value)} dir="rtl" /></Field>
                    <Field label="Role (EN)" style={fieldStyle}><input style={inputStyle} value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} /></Field>
                    <Field label="سمت (FA)" style={fieldStyle}><input style={inputStyle} value={exp.roleFa} onChange={e => updateExperience(i, 'roleFa', e.target.value)} dir="rtl" /></Field>
                    <Field label="Period (EN)" style={fieldStyle}><input style={inputStyle} value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} placeholder="2022 - Present" /></Field>
                    <Field label="دوره (FA)" style={fieldStyle}><input style={inputStyle} value={exp.periodFa} onChange={e => updateExperience(i, 'periodFa', e.target.value)} dir="rtl" placeholder="۱۴۰۱ - اکنون" /></Field>
                  </div>
                  <Field label="Description (EN)" style={fieldStyle}><textarea style={{ ...inputStyle, height: 60, resize: 'vertical' }} value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} /></Field>
                  <Field label="توضیح (FA)" style={fieldStyle}><textarea style={{ ...inputStyle, height: 60, resize: 'vertical' }} value={exp.descriptionFa} onChange={e => updateExperience(i, 'descriptionFa', e.target.value)} dir="rtl" /></Field>
                </div>
              ))}
              <button onClick={addExperience} style={{ background: '#001100', color: '#00ff00', border: '1px solid #00ff00', padding: '10px 20px', cursor: 'pointer', fontFamily: fontStyle }}>
                + {t(lang, 'add')}
              </button>
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'education' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'educationSection')}</SectionTitle>
              {editData.education.map((edu, i) => (
                <div key={edu.id} style={{ border: '1px solid #00ff0033', padding: 20, marginBottom: 16, background: '#000500' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#39ff14', fontWeight: 'bold' }}>{isFa ? 'تحصیل' : 'Education'} {i + 1}</span>
                    <button onClick={() => removeEducation(i)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '4px 12px', cursor: 'pointer', fontFamily: fontStyle }}>✕ {t(lang, 'delete')}</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="School (EN)" style={fieldStyle}><input style={inputStyle} value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} /></Field>
                    <Field label="دانشگاه (FA)" style={fieldStyle}><input style={inputStyle} value={edu.schoolFa} onChange={e => updateEducation(i, 'schoolFa', e.target.value)} dir="rtl" /></Field>
                    <Field label="Degree (EN)" style={fieldStyle}><input style={inputStyle} value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} /></Field>
                    <Field label="مدرک (FA)" style={fieldStyle}><input style={inputStyle} value={edu.degreeFa} onChange={e => updateEducation(i, 'degreeFa', e.target.value)} dir="rtl" /></Field>
                    <Field label="Period (EN)" style={fieldStyle}><input style={inputStyle} value={edu.period} onChange={e => updateEducation(i, 'period', e.target.value)} placeholder="2016 - 2020" /></Field>
                    <Field label="دوره (FA)" style={fieldStyle}><input style={inputStyle} value={edu.periodFa} onChange={e => updateEducation(i, 'periodFa', e.target.value)} dir="rtl" /></Field>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} style={{ background: '#001100', color: '#00ff00', border: '1px solid #00ff00', padding: '10px 20px', cursor: 'pointer', fontFamily: fontStyle }}>
                + {t(lang, 'add')}
              </button>
            </div>
          )}

          {/* CONTACT */}
          {activeTab === 'contact' && (
            <div>
              <SectionTitle isFa={isFa}>{t(lang, 'contactInfo')}</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Email" style={fieldStyle}><input style={inputStyle} value={editData.contact.email} onChange={e => updateContact('email', e.target.value)} /></Field>
                <Field label="Phone" style={fieldStyle}><input style={inputStyle} value={editData.contact.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="+98 912 ..." /></Field>
                <Field label="Location (EN)" style={fieldStyle}><input style={inputStyle} value={editData.contact.location} onChange={e => updateContact('location', e.target.value)} /></Field>
                <Field label="موقعیت (FA)" style={fieldStyle}><input style={inputStyle} value={editData.contact.locationFa} onChange={e => updateContact('locationFa', e.target.value)} dir="rtl" /></Field>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {activeTab === 'password' && (
            <div>
              <SectionTitle isFa={isFa}>{isFa ? 'تغییر رمز عبور' : 'Change Password'}</SectionTitle>
              <div style={{ maxWidth: 400 }}>
                <Field label={isFa ? 'رمز جدید' : 'New Password'} style={fieldStyle}>
                  <input type="password" style={inputStyle} value={newPass} onChange={e => setNewPass(e.target.value)} />
                </Field>
                <Field label={isFa ? 'تکرار رمز جدید' : 'Confirm New Password'} style={fieldStyle}>
                  <input type="password" style={inputStyle} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                </Field>
                {passChangeMsg && <div style={{ color: '#39ff14', marginBottom: 12, fontSize: 13 }}>{passChangeMsg}</div>}
                <button onClick={handleChangePassword} style={{ background: '#00ff00', color: '#000', padding: '10px 24px', fontFamily: fontStyle, cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
                  {isFa ? 'تغییر رمز' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ children, isFa }: { children: React.ReactNode; isFa: boolean }) {
  return (
    <div style={{
      fontSize: 16, fontWeight: 'bold', color: '#39ff14',
      borderBottom: '1px solid #00ff0033', paddingBottom: 12, marginBottom: 24,
      textShadow: '0 0 6px #00ff00',
      textAlign: isFa ? 'right' : 'left',
    }}>
      {children}
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={{ fontSize: 11, opacity: 0.6, marginBottom: 4, display: 'block' }}>{label}</label>
      {children}
    </div>
  );
}
