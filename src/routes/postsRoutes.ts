import {
    Request, Response, Router
  } from 'express'
  import { authJwt } from '../middlewares'
import Post from '../models/Post'

  class PostRoutes {
    public router: Router

    constructor () {
      this.router = Router()
      this.routes() // This has to be written here so that the method can actually be configured when called externally.
    }

    // It returns all posts in the system (from every creator)
    public async getAllPosts (req: Request, res: Response) : Promise<void> {
      const allPosts = await Post.find()
      if (allPosts.length === 0) {
        res.status(404).send('There are no posts yet.')
      } else {
        res.status(200).send(allPosts)
      }
    }

    // It returns ALL posts that the owner itself has created
    public async getMyPosts (req: Request, res: Response) : Promise<void> {
      const postsFound = await Post.find({ creator: req.params.creator })
      if (postsFound == null) {
        res.status(404).send('The owner has not posted anything yet ')
      } else {
        res.status(200).send(postsFound)
      }
    }

    // Adds a post to the system
    public async addPost (req: Request, res: Response) : Promise<void> {
      const { creator, profileImage, description, postImageUrl } = req.body
      const newPost = new Post({ creator, profileImage, description, postImageUrl, likes: [] })
      await newPost.save()
      res.status(201).send(newPost)
    }

    // It updates the post description and likes
    public async updatePost (req: Request, res: Response) : Promise<void> {
      const postToUpdate = await Post.findByIdAndUpdate(req.params._id, { description: req.body.description })
      if (postToUpdate == null) {
        res.status(404).send('Post not found.')
      } else {
        res.status(201).send('Post description updated.')
      }
    }

    // Deletes a post (by _id) from the system.
    public async deletePost (req: Request, res: Response) : Promise<void> {
      const postToDelete = await Post.findByIdAndDelete(req.params._id)
      if (postToDelete == null) {
        res.status(404).send('Post not found.')
        return
      }
      res.status(200).send('Post deleted.')
    }

    public async addComment (req: Request, res: Response) : Promise<void> {
      const {
        creatorName, message
      } = req.body

      const post = await Post.findById({ _id: req.params._id })
      if (post == null) {
          res.status(404).send('Post not found')
      }
      const commentToAdd = {
        creatorName, message
      }

      await Post.findByIdAndUpdate({ _id: post._id }, { $push: { comments: commentToAdd } })
      res.status(201).send('Message added to post.')
    }

    public async likePost (req: Request, res: Response) : Promise<void> {
        const {
          customerName, number
        } = req.body

        const post = await Post.findById({ _id: req.params._id })
        if (post == null) {
            res.status(404).send('Post not found')
        }
        const likeToAdd = {
          customerName, number
        }
        let found = false
        let newListLikes = []
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].customerName === customerName) {
                post.likes.splice(i, 1)
                newListLikes = post.likes
                found = true
            }
        }
        if (found) {
            await Post.findByIdAndUpdate({ _id: post._id }, { likes: newListLikes })
            res.status(200).send('Like ereased')
            return
        }
        await Post.findByIdAndUpdate({ _id: post._id }, { $push: { likes: likeToAdd } })
        res.status(201).send('Message added to post')
      }

    routes () {
      this.router.get('/', [authJwt.VerifyToken], this.getAllPosts)
      this.router.get('/:creatorName', [authJwt.VerifyToken], this.getMyPosts)
      this.router.post('/', [authJwt.VerifyToken], this.addPost)
      this.router.post('/addComment/:_id', [authJwt.VerifyToken], this.addComment)
      this.router.put('/:_id', [authJwt.VerifyToken], this.updatePost)
      this.router.delete('/:_id', [authJwt.VerifyToken], this.deletePost)
      this.router.post('/addLike/:_id', [authJwt.VerifyToken], this.likePost)
    }
  }
  const postsRoutes = new PostRoutes()

  export default postsRoutes.router
