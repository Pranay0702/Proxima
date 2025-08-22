import React, { useEffect, useState } from "react";
import profile1 from '../../imgs/profile1.jpg';
import cover1 from '../../imgs/cover1.png'
import { getUserprofile } from "../../shared/config/api";
import { User1 } from "../../shared/interfaces/register.interface";
import "./profile.css";
import { ArrowLeft, Camera, Edit3, Plus, Save, X, Lock, EyeOff, Eye, MapPin, Mail, Phone, Globe, Calendar, Briefcase, Award } from 'lucide-react';
import { updateUser } from "../../../../backend/controller/user.controller";

export default function Profile() {
    const [user, setUser] = useState<User1 | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<User1 | null>(null);
    const [newSkill, setNewSkill] = useState("");
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserprofile();
                setUser(res.data.user); // backend returns { user }
                setEditForm(res.data.user); // initialization for user edit 
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onBack = () =>{
        window.history.back();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            [e.target.name]:e.target.value,
        });
    };

    const handleAddSkill = () => {
        if(!editForm || !newSkill.trim()) return;
        setEditForm({
            ...editForm,
            skills: [...(editForm.skills || []), newSkill.trim()],
        });
        setNewSkill("")
    };

    const handleRemoveSkill = (skill: string) => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            skills: (editForm.skills || []).filter((s) => s !== skill),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(user); // resets the changes made 
    }

    const handleSave = async () => {
        try{
            const{data} = await updateUser(editForm);
            setUser(data);
            setIsEditing(false);
        }catch(e){
            console.error("Failed to update profile", e);
        }
    }

    const handleAvatarChange = () => {
        const newAvatar = prompt('Enter new avatar')
        if (newAvatar){
            setEditForm(prev => prev ? { ...prev, avatar: newAvatar } : prev);
        }
    };

    const handleCoverChange = () => {
       const newCover = prompt('Enter new cover image URL');
       if (newCover){
        setEditForm(prev=>prev? {...prev,coverImage:newCover}:prev);
       }
    };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!user) return <div className="profile-container">User not found</div>;

  return (
    <div className="profile-page">
        <div className="profile-header-bar">
            <button onClick={onBack} className="back-button">
                <ArrowLeft /><span>Back to Home</span>
            </button>
            <div className="profile-actions">
                {isEditing? (
                    <><button type="button" onClick={handleCancel} className="cancel-button">
                        <X/>Cancel
                    </button>
                    <button type="button" onClick={handleSave} className="save-button">
                        <Save/> Save Changes
                    </button>
                    </>
                
                ):(
                    <button type="button" onClick={() => setIsEditing(true)}  className="edit-button">
                        <Edit3/> Profile
                    </button>
                )}
            </div>
        </div>

        <div className="profile-content">
            <div className="cover-section">
                <img
                    src={isEditing? editForm?.coverImage:user.coverImage || cover1}
                    alt="Cover"
                    className="cover-image"
                />
                {isEditing && (
                    <button type="button" onClick={handleCoverChange} className="change-cover-btn">
                        <Camera/>
                        Change Cover 
                    </button>
                )}
            </div>

            <div className="profile-info-section">
                <div className="avatar-section">
                    <img src = {isEditing ? editForm?.profileImage : user.profileImage ||profile1}
                    alt="Profile"
                    className="profile-avatar-large"
                    />
                    {isEditing && (
                        <button type="button" onClick={handleAvatarChange} className="change-avatar-btn">
                            <Camera/>
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-details">
                {isEditing?(
                    <div className="edit-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editForm?.username || ""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm?.email ||""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={editForm?.jobTitle ||""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={editForm?.company ||""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editForm?.location ||""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editForm?.phone ||""}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        {/*
                        <div className="form-group">
                            <label className="form-label">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={editForm?.website ||""}
                                onChange={handleInputChange}
                                className="form-input"
                        </div>/>*/}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={editForm?.description ||""}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skills</label>
                            <div className="skills-edit">
                                <div className="skills-list">
                                    {editForm?.skills?.map((skill, index) => (
                                        <span key = {index} className="skill-tag editable">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="remove-skill">
                                                <X size={14}/>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="add-skill">
                                    <input 
                                        type="text"
                                        value={newSkill}
                                        onChange={(e)=> setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                        placeholder="Add a skill"
                                        className="skill-input"
                                    />
                                    <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                                        <Plus size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="password-section">
                            <button onClick={()=>  setShowPasswordChange(!showPasswordChange)} className="password-toggle-btn"><Lock/>{showPasswordChange? 'Cancel Password Change' : 'Change Password'}</button>
                            {showPasswordChange && (
                                <div className="password-change-form">
                                    <div  className="form group">
                                        <label className="form-label">Current Password</label>
                                        <div  className="password-input-container">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="form-input"
                                            />
                                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}  className="password-toggle">{showCurrentPassword ? <EyeOff/>:<Eye/>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <div className="password-input-container">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                className="form-input"
                                            />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}  className="password-toggle">{showNewPassword ? <EyeOff/>:<Eye/>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <div className="password-input-container">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="form-input"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}  className="password-toggle">{showConfirmPassword ? <EyeOff/>:<Eye/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ):(
                    <div className="profile-display">
                        <h1 className="profile-name">{user.username}</h1>
                        <p className="profile-title">{user.jobTitle} at {user.company}</p>

                        <div className="profile-meta">
                            <div className="meta-item">
                                <MapPin size={16}/>
                                <span>{user.location}</span>
                            </div>
                            <div className="meta-item">
                                <Mail size={16}/>
                                <span>{user.email}</span>
                            </div>
                            <div className="meta-item">
                                <Phone size={16}/>
                                <span>{user.phone}</span>
                            </div>
                        </div>
                            
                        <div className="profile-description">
                            <h3>About</h3>
                            <p>{user.description}</p>
                        </div>

                        <div className="skills-section">
                            <h3>Skills</h3>
                            <div className="skills-list">
                                {user.skills?.map((skill, index) =>(
                                    <span key={index} className="skill-tag">{skill}</span>
                                )) || <span>No Skills Added</span>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="profile-page">
        {!isEditing && (
            <div className="section">
                <h3 className="section-title">
                    <Briefcase size={20}/>Experience
                </h3>
                <div className="experience-list">
                    {user.experience?.map(exp=>(
                        <div key={exp.id} className="experience-item">
                            <h4>{exp.title}</h4>
                            <p className="company">{exp.company}</p>
                            <p className="duration">{exp.duration}</p>
                            <p className="description">{exp.description}</p>
                        </div>
                    )) || <p>No Experience added yet</p>}
                </div>
            </div>
        )}
        
        {!isEditing && (
            <div className="section">
                <h3 className="section-title">
                    <Award size={20}/>Education
                </h3>
                <div className="education-list">
                    {user.education?.map(edu=>(
                        <div key={edu.id} className="education-item">
                            <h4>{edu.degree}</h4>
                            <p className="school">{edu.institution}</p>
                            <p className="year">{edu.year}</p>
                        </div>
                    )) || <p>No Education Records</p>}
                </div>
            </div>
        )}
    </div>
    </div>
  )
}
