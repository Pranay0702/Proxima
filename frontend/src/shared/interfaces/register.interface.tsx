export interface User__ {
     username: string;
     email: string;
     location: string;
     jobTitle: string;
     description: string;
     password: string;
     confirmPassword: string;}

export interface Notification {
     id: string;           
     type: string;
     title: string;
     message: string;
     isRead: boolean;
     avatar?: string;
     timestamp?: string;
}

export interface Experience {
     id: string;
     title: string;
     company: string;
     duration: string;
     description: string;
}

export interface Education {
     id: string;
     degree: string;
     institution: string;
     year: string;
}

export interface User1 {
     _id: string;
     username: string;
     email: string;
     password?: string; 
     location?: string;
     jobTitle?: string;
     description?: string;

     profileImage?: string;
     coverImage?: string;
     company?: string;
     phone?: string;
     website?: string;
     skills: string[];
     profileViews?: number;
     connections?: string[];

     experience: Experience[];
     education: Education[];

     createdAt?: string;
     updatedAt?: string;
}

export interface Post {
     id: string;      
     content: string;
     image?: string;
     likes: number;
     comments: number;
     shares?: number;
     timeAgo: string;
     author: {
          name: string;
          avatar?: string;
          title?: string;
          company?: string;
     };
     commentsList?: Comment[];
     likedByUser?: boolean; 
}

export interface Comment {
     id: string;
     authorName: string;
     message: string;
}
