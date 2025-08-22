import React, { useEffect, useState } from "react";
import profile1 from '../../imgs/profile1.jpg';
import cover1 from '../../imgs/cover1.png'
import { getUserprofile } from "../../shared/config/api";
import { User1,Experience,Education,Notification } from "../../shared/interfaces/register.interface";
import "./profile.css";
import { ArrowLeft, Camera, Edit3, Plus, Save, X, Lock, EyeOff, Eye, MapPin, Mail, Phone, Globe, Calendar, Briefcase, Award } from 'lucide-react';

interface EditUser extends Omit<User1, "profileImage" | "coverImage"> {
    profileImage?: string | File;
    coverImage?: string | File;
}

export default function Profile() {
    const [user, setUser] = useState<User1 | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<EditUser | null>(null);
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
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
        if (editForm.skills?.includes(newSkill.trim())) return;
        setEditForm(prev => prev?{...prev, skills:[...(prev.skills || []), newSkill.trim()]}:prev);
        setNewSkill("")
    };

    const handleRemoveSkill = (skill: string) => {
        if (!editForm) return;
        setEditForm(prev => prev? {...prev, skills:(prev.skills||[]).filter(s=>s!==skill)}:prev);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(user); // resets the changes made
        setShowPasswordChange(false);
        setPasswordForm({currentPassword:"",newPassword:"",confirmPassword:""}); 
    };

    const handleSave = async () => {
    if (!editForm) return;

    // Password check
    if (showPasswordChange && passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const formData = new FormData();

        // Append all editable fields
        if (editForm.username) formData.append("username", editForm.username);
        if (editForm.email) formData.append("email", editForm.email);
        if (editForm.location) formData.append("location", editForm.location);
        if (editForm.jobTitle) formData.append("jobTitle", editForm.jobTitle);
        if (editForm.company) formData.append("company", editForm.company);
        if (editForm.phone) formData.append("phone", editForm.phone);
        if (editForm.description) formData.append("description", editForm.description);
        if (editForm.skills) formData.append("skills", JSON.stringify(editForm.skills)); // arrays must be stringified

        // Append files only if they are File objects
        if (editForm.profileImage instanceof File) formData.append("profileImage", editForm.profileImage);
        if (editForm.coverImage instanceof File) formData.append("coverImage", editForm.coverImage);

        // Append new password if changing
        if (showPasswordChange && passwordForm.newPassword) {
            formData.append("password", passwordForm.newPassword);
        }

        const res = await fetch("http://localhost:3000/api/users/upprofile", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to update profile");

        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        setShowPasswordChange(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (file.size > MAX_FILE_SIZE) return alert("File too large. Max 2MB.");
        setEditForm(prev => prev ? { ...prev, profileImage: file } : prev);
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (file.size > MAX_FILE_SIZE) return alert("File too large. Max 2MB.");
        setEditForm(prev => prev ? { ...prev, coverImage: file } : prev);
    };

    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value,
        });
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
                        src={editForm?.coverImage instanceof File
                                ? URL.createObjectURL(editForm.coverImage)
                                : editForm?.coverImage || cover1}
                        alt="Cover"
                        className="cover-image"
                    />
                    {isEditing && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                id="coverUpload"
                                style={{ display: "none" }}
                                onChange={handleCoverUpload}
                            />
                            <button type="button" onClick={() => document.getElementById('coverUpload')?.click()} className="change-cover-btn">
                                <Camera/>
                            </button>
                        </>
                    )}
                </div>

                <div className="profile-info-section">
                    <div className="avatar-section">
                        <img src = {
                            editForm?.profileImage instanceof File
                                ? URL.createObjectURL(editForm.profileImage)
                                : editForm?.profileImage || profile1
                            }
                            alt="Profile"
                            className="profile-avatar-large"
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="avatarUpload"
                                    style={{ display: "none" }}
                                    onChange={handleAvatarUpload}
                                />
                                <button type="button" onClick={() => document.getElementById('avatarUpload')?.click()} className="change-avatar-btn">
                                    <Camera/> Change Avatar
                                </button>
                            </>
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
                                {user.skills && user.skills.length > 0? (
                                     user.skills.map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)
                                ) : (
                                    <span>No Skills Added</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="">
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
