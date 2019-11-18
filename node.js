
const makeAuth = require('minitaur-server')
const makeAuthMiddleware = require('minitaur-server/express')
const uuid = require('uuid/v4');
const forge = require('node-forge')

const users = {};
const devices = {};
const sessions = {};
let serverKeyPair = null

const auth = makeAuth({
  findUser: async (userId) => users[userId],
  storeUser: async (userId, user) => { 
    users[userId] = { ...users[userId], user }
  },
  storeDevice: async (userId, pubKey) => {
    devices[userId] = devices[userId] || {}
    devices[userId][pubKey] = 'UNVERIFIED'
    setTimeout(() => {
      devices[userId][pubKey]: 'VERIFIED'
    }, 10000) 
  },
  getServerKeyPair: async () => {
    if (!serverKeyPair) {
      serverKeyPair = await generateKeyPair({ bits: 2048 })
    }
    return serverKeyPair
  }
  postRegistration: async (userId, user, pubKey) => {
    //whatever you want
  },
  postLogin: async (userId, ) => {
    //whatever you want
  }
  authenticate: async (userId, pubKey) => 
    devices[userId] && devices[userId][pubKey] === 'VERIFIED'
})


const generateKeyPair = (opts) => new Promise((resolve, reject) => {
  forge.pki.rsa.generateKeyPair(opts, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  })
})
  
//libcode

const register = ({ findUser, storeUser, storeDevice, getServerKeyPair }) => 
  async (userId, user, pubKey) => {
    const existingUser = findUser(userId)
    if (existingUser) {
      throw "EXISTING_USER"
    }
    await storeUser(userId, user)
    await storeDevice(userId, pubKey)
    await postRegistration(userId, user, pubKey)
    const { pubKey } = getServerKeyPair()
    return { pubKey }
  }


const login = ({ }) => 
  async ({ userId, userNonce, serverNonce }) => {
    if (serverNonce && userNonce) {
      
    }
  }

const makeAuthMiddlewares = (auth) => ({
  register: async (req, res, next) => {
    try {
      const serverPubKey = await register(auth)(req.params.userId, req.body.user, req.body.pubKey)
      res.status(201)
      res.end(serverPubKey)
    } catch(error) {
      if (error === "EXISTING_USER") {
        res.status(400)
        res.end("User already registered")
      }
      res.status(500)
      res.end(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const response = await login(auth)(req.body)
      res.status(200)
      res.end(response)
    } catch(error) {
      if (error === "???") {
        res.status(400)
        res.end("???")
      }
      res.status(500)
      res.end(error)
    }
  }
})