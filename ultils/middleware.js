const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')
const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ',req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization')
  req.token = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ','')
    : null
	// } else {
	// if (authorization && authorization.startsWith('Bearer ')) {
	// 	req.token = authorization.replace('Bearer ','')
	// } else {
	//   return null
  // }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  req.user =  decodedToken.id
    ? await User.findById(decodedToken.id)
    : null
  
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

const  errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name ===  'CastError') {
    res.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    res.status(400).json({error: error.message})
  } else if (error.name === 'JsonWebTokenError') {
		res.status(400).json({error: error.message})
	} else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
	}

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}