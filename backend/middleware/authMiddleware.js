import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token

  //  Read JWT from the cookie
  token = req.cookies.jwt
  // console.log('req', req.cookies)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorised, token failed')
    }
  } else {
    res.status(401)
    throw new Error('Not authorised, no token')
  }
})

// Admin Middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorised as Admin')
  }
}

export { protect, admin }
