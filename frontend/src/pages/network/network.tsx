import "./network.css";
import profile1 from '../../imgs/profile1.jpg';
import { useEffect, useState } from "react";
import { User1 } from "../../shared/interfaces/register.interface";
import axios from 'axios';
import { ArrowLeft, Building, Filter, MapPin, Search, Calendar, GraduationCap, Briefcase
} from 'lucide-react';

export default function Network (){
    const [users,setUsers] = useState<User1[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [locationFilter, setLocationFilter] = useState("");
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);

    const fetchUsers = async (search: String, location: string) => {
        try{
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/users/list',{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    search: search,
                    location: location
                }
            });
            setUsers(res.data.users);
        }catch (error){
            console.error("Failed to fetch  users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(searchTerm, locationFilter);
    }, [searchTerm, locationFilter]);

    const clearFilter = () => {
        setLocationFilter("");
    }
    
    const onBack = () =>{
        window.history.back();
    };
    
    return(
        <div className ="network-page">
            <div className="network-header">
                <div className="network-header-content">
                    <button onClick={onBack} className ="back-button">
                        <ArrowLeft  />
                        <span>Back to Home</span>
                    </button>
                    <h1 className = "network-title">Networks</h1>
                    <div className="network-stats">
                        <span>{users.length} professionals found</span>
                    </div>
                </div>
            </div>

            <div className="search-section">
                <div className="search-container">
                    <div className="main-search">
                        <Search className = "search-icon" />
                        <input
                            type = "text"
                            placeholder="Search users by name, title, company, or skills..."
                            value={searchTerm}
                            onChange={(e)=> setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                        className={`filter-toggle ${showAdvancedSearch ? 'active': ''}`} 
                        > <Filter /> Advanced 
                        </button>
                    </div>

                    {showAdvancedSearch && (
                        <div className="advanced-search">
                            <div  className="filter-row">
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <MapPin size={16}/>Location
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="City, State"
                                        value={locationFilter}
                                        onChange={(e)=> setLocationFilter(e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <Building size={16}/>Industry
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="City, State"
                                        value={locationFilter}
                                        onChange={(e)=> setLocationFilter(e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <Calendar size={16}/>Experience
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="City, State"
                                        value={locationFilter}
                                        onChange={(e)=> setLocationFilter(e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <button onClick={clearFilter} className="clear-filters">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="network-content">
                <div className="professional-grid">
                    {users.map((user) => (
                        <div key={user._id} className="professional-card">
                            <div className="card-header">
                                <img src={user.profileImage || profile1} alt={user.username} className="professional-avatar"/>
                            </div>

                            <div className="card-content">
                                <h3 className="professional-name">{user.username}</h3>
                                <p className="professional-title">{user.jobTitle}</p>
                                <p className="professional-company">
                                    <Building size={14}/>
                                    {user.company}
                                </p>
                                <p className="professional-location">
                                    <MapPin size={14}/>
                                    {user.location}
                                </p>
                                <div className="professional-details">
                                    <div className="detail-item">
                                        <GraduationCap size={14}/>
                                        <span>{user.description}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Briefcase size={14}/>
                                        <span>
                                            {user.experience && user.experience.length > 0
                                                ? `${user.experience[0].duration} experience`
                                                : "No experience listed"}
                                        </span>
                                    </div>
                                </div>
                                <div className="skills-preview">
                                    {user.skills?.slice(0, 3).map((skill, index) =>(
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                    {user.skills && user.skills.length > 3 && (
                                        <span className="more-skills">+{user.skills.length -3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}