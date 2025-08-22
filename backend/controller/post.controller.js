import Post from '../model/post.model.js';
import User from '../model/user.model.js';

// Get all posts
export async function getPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username profileImage jobTitle company');
    
    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      image: post.image || null,
      likes: post.likes,
      comments: post.comments.length,
      timeAgo: `${Math.floor((Date.now() - post.createdAt)/60000)} min`,
      author: {
        name: post.author.username,
        avatar: post.author.profileImage,
        title: post.author.jobTitle,
        company: post.author.company
      }
    }));

    res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new post
export async function createPost(req, res) {
  try {
    const { content, image } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = new Post({
      author: req.user.id,
      content,
      image
    });

    await post.save();
    await post.populate('author', 'username profileImage jobTitle company');

    const formattedPost = {
      id: post._id,
      content: post.content,
      image: post.image || null,
      likes: post.likes,
      comments: post.comments.length,
      shares: 0,
      timeAgo: 'just now',
      author: {
        name: post.author.username,
        avatar: post.author.profileImage,
        title: post.author.jobTitle,
        company: post.author.company
      }
    };

    res.status(201).json({ post: formattedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Like a post
export async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes += 1;
    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Comment on a post
export async function commentPost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { message } = req.body;
    post.comments.push({ author: req.user.id, message });
    await post.save();
    res.status(201).json({ comments: post.comments.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

