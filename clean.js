/*
crypto.subtle.generateKey({
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: {name: 'SHA-256'}
        }, true, ['encrypt', 'decrypt'])
  .then(keypair => 
    crypto.subtle.encrypt({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.publicKey, (new TextEncoder()).encode('lol'))
      .then(encrypted => crypto.subtle.decrypt({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.privateKey, encrypted))
      .then(content => log((new TextDecoder()).decode(content))))
*/

const log = console.log

const subtlePony = fnName => (...args) => {
  if (window.crypto)
    return crypto.subtle[fnName](...args)
  if (window.msCrypto){
    return new Promise((resolve, reject) => {
      const instance = msCrypto.subtle[fnName](...args)
      instance.oncomplete = event => resolve(event.target.result)
      instance.onerror = reject
    })
  }
  throw 'Your browser doesn\'t support Crypto.Subtle'
}

subtlePony('generateKey')({
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: {name: 'SHA-256'}
}, true, ['encrypt', 'decrypt'])
.then(keypair => 
  subtlePony('encrypt')({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.publicKey, (new TextEncoder()).encode('lol'))
    .then(encrypted => subtlePony('decrypt')({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.privateKey, encrypted))
    .then(content => log((new TextDecoder()).decode(content)))
    .then(_ => subtlePony('exportKey')('spki', keypair.publicKey))
    .then(exportedKey => log('-----BEGIN PUBLIC KEY-----\n' + window.btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey))) + '\n-----END PUBLIC KEY-----'))
    .then(_ => subtlePony('exportKey')('pkcs8', keypair.privateKey))
    .then(exportedKey => log('-----BEGIN PRIVATE KEY-----\n' + window.btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey))) + '\n-----END PRIVATE KEY-----')))
.then(_ => {
  const pubKey = `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcAy8EHtaw22tpqpbe3po3imtgHuynogbW/ydFLMqRIR4Fu+9gRNfXBWDLP10FhjhJWFZjwH3RQXGDTK5zvEKMC61ajiFinDY0tegkOvjsI4x/o/jEB+UxZjS3EZbUaf77Qp7WxaEjwn7/mMW1b4rfy+gmkiebhRx5kMgEwZPWX4HzkbslsSmeHhKWf/NPHaCcvcCzOURhzNrtYlgtg48RzswPmwrxZ6+nHLyC3tnFsSHVuil9hrsup1KIG5XeEKzyjVbIMER6O3NoT35vAlV6/PeW1Rnel+oat02XKNTfb5B3QjF0n2JUHXEHyDZBl7jJ9skOizPC+YMAmJkP1/ywIDAQAB
  -----END PUBLIC KEY-----`
  const privKey = `-----BEGIN PRIVATE KEY-----
  MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1wDLwQe1rDba2mqlt7emjeKa2Ae7KeiBtb/J0UsypEhHgW772BE19cFYMs/XQWGOElYVmPAfdFBcYNMrnO8QowLrVqOIWKcNjS16CQ6+OwjjH+j+MQH5TFmNLcRltRp/vtCntbFoSPCfv+YxbVvit/L6CaSJ5uFHHmQyATBk9ZfgfORuyWxKZ4eEpZ/808doJy9wLM5RGHM2u1iWC2DjxHOzA+bCvFnr6ccvILe2cWxIdW6KX2Guy6nUogbld4QrPKNVsgwRHo7c2hPfm8CVXr895bVGd6X6hq3TZco1N9vkHdCMXSfYlQdcQfINkGXuMn2yQ6LM8L5gwCYmQ/X/LAgMBAAECggEABb4Zl4ZfVyAUs1O5e1WZw1Mz4hFQ90kBKEpx6ZbKJgqbnpakUHqihigCZNFbOKa3GKcIX+QRE/B0EFnVEi+AJN3kdibC/S2ubj86sIWTkPOpcdKCDbWywbMcSdoJElWGbSXCPPqAJNsnIEmmufLkCMwXd60uhfqhOHWPmkHAes3/c+XY2rKscUXfFWUOGQww9KKgkY2RrIW7pNRJdGDjynxQU7OFVXPB1QDIuDz37T4++Iju1dECLrmHUQ2d20OBZNuTABd1r8rthsjRgyxy1mqaGATHtT8I8kEO/2YODJMlnPQD55pfDI9FlXpR43oyYGbkCcZC12myWZK2BIN86QKBgQDe3wQvnNryFjnD3AxmO1c1EYtxJJ7WXLdNj1weorkoaUWor1K4ZLMFBPU0FabT69J6E9++0eLmKDQZQ83mop6bDM9NdHK8fn7Xaf40LYjSt+YovGDIRlfjOxOp0zjJ4GFX2PRgMMrLU2QWr2mPhNOD3OAz4Edree3TN53cxRMc2QKBgQDQxGqVWik12NX5XgGFmhbRUyV0Fr4UjW1xEcymjCivzkjUoJZDX81jflrpvDvwFjXCoT0p6icF6jCveCObodVmgP2a80vijR66OfINACMQvwlRwLyB+HFaXEtCh7JPDUCykF+JSWQffdH21Pn1d6Ln2YaFGO+71oPdz7Oqa3irQwKBgCYQXs2m83nvM9Rwq6l2LxHAOlmLkJk54pCbkHcnAYqWWDBUKUOW50BPNXW80O5W027IICmd/Suj6Cn8e5kNYxtGF825urLYw98UmjbdJAYhJG0Gp1ztLqt/dn9FtOg9q0JuqmYXTztkta5uLRA29k0KFzyk7G29uFGfqRWAjyAZAoGAGCLtU7El3JTiQD9vG5wyESd0yBQtC8FCKvVs3MCNn63Q28xpMwbrfxpHtohNwbc/pe3wXV01/8gQsujH7SFrw7scFwMT/fBk4hD6/CfM5g3ALRSEdt5bdKABD4MSyXL1zO9GLGAw1Dc+xDPhZlDbo8SReeflJ6loe4ec9RIR1HMCgYBac6N58olb31heKVb5nULziuriiOgoH0miVD0REbEgLSGJIiCE9kDd7no2RoYGpgJw2i4XhA79yP6fjO64iNbDqv9ifpwudJZNYjj0gSWSJBZ+/ppfJ9iha/UWRq3GEJFQZhj3c4RQ7i+tXmvXVyI5lsu759KCxS0rRLaXse/NVw==
  -----END PRIVATE KEY-----`

  const getRawKey = (type, pem) => {
    const pemHeader = `-----BEGIN ${type} KEY-----`;
    const pemFooter = `-----END ${type} KEY-----`;
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new ArrayBuffer(binaryDerString.length);
    const bufView = new Uint8Array(binaryDer);
    for (let i = 0, strLen = binaryDerString.length; i < strLen; i++) {
      bufView[i] = binaryDerString.charCodeAt(i);
    }
    return binaryDer;
  }
  subtlePony('importKey')('spki', getRawKey('PUBLIC', pubKey),
  {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: {name: 'SHA-256'}
  }, true, ['encrypt'])
    .then(publicKey => 
      subtlePony('encrypt')({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, publicKey, (new TextEncoder()).encode('lol2')))
    .then(encrypted => 
      subtlePony('importKey')('pkcs8', getRawKey('PRIVATE', privKey),
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: 'SHA-256'}
      }, true, ['decrypt'])
        .then(privateKey => 
          subtlePony('decrypt')({ name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, privateKey, encrypted)))
    .then(content => log((new TextDecoder()).decode(content)))
})