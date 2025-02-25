const Post = require('../models/Post')
const User = require('../models/User')

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body
        const user = await User.findById(req.user.id).select(
            'name specialisation avatarUrl'
        )

        if (!user) return res.status(404).json({ message: 'User not found' })

        const images = req.files
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : []

        const newPost = new Post({
            title,
            description,
            images,
            author: req.user.id,
        })

        await newPost.save()
        await newPost.populate('author', 'name specialisation avatarUrl')

        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({
            message: 'Error creating post',
            error: error.message,
        })
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name specialisation avatarUrl')
            .sort({ createdAt: -1 })
        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching posts',
            error: error.message,
        })
    }
}

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            'author',
            'name specialisation'
        )
        if (!post) return res.status(404).json({ message: 'Post not found' })
        res.json(post)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching post',
            error: error.message,
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        if (post.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: 'Not authorized to delete this post' })
        }

        await post.deleteOne()
        res.json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting post',
            error: error.message,
        })
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        if (post.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: 'Not authorized to update this post' })
        }

        const { title, description } = req.body
        const images = req.files
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : post.images

        post.title = title || post.title
        post.description = description || post.description
        post.images = images

        await post.save()
        await post.populate('author', 'name specialisation avatarUrl')

        res.json({ message: 'Post updated successfully', post })
    } catch (error) {
        res.status(500).json({
            message: 'Error updating post',
            error: error.message,
        })
    }
}
