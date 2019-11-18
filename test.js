var log = console.log

try {
  var subtlePony = function(fnName) {
    var args = Array.prototype.slice.call(arguments).slice(1)
    if (window.crypto)
      return crypto.subtle[fnName].apply(crypto.subtle, args)
    if (window.msCrypto){
      function Promise(e){var o,r=1,c=0;function t(e){r=2,o=e,c&&i(c)}function i(t){1!==r?setTimeout(function(){var e,n;if(e=3===r?t.q:t.k)try{n=e(o),t.l(n)}catch(e){t.v(e)}else 3===r?t.l(o):t.v(o)},1):c=t}this.then=function(t,o){return new Promise(function(e,n){i({q:t,k:o,l:e,v:n})})},e(function e(n){try{if(n&&"function"==typeof n.then)return void n.then(e,t);r=3,o=n,c&&i(c)}catch(e){t(e)}},t)}
      return new Promise(function(resolve, reject) {
        var instance = msCrypto.subtle[fnName].apply(msCrypto.subtle, args)
        instance.oncomplete = function(event) { resolve(event.target.result) }
        instance.onerror = reject
      })
    }
    throw 'Your browser doesn\'t support Crypto.Subtle'
  };

  var textEncode = function(content) {
    var buf = new ArrayBuffer(content.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = content.length; i < strLen; i++) {
      bufView[i] = content.charCodeAt(i);
    }
    return buf;
  }
  var textDecode = function(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf))
  }

  subtlePony('generateKey', {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: {name: 'SHA-256'}
  }, true, ['encrypt', 'decrypt'])
  .then(function(keypair) {
    return subtlePony('encrypt', { name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.publicKey, textEncode('lol'))
      .then(function(encrypted){ return subtlePony('decrypt', { name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, keypair.privateKey, encrypted)}, log)
      .then(function(content){ log(textDecode(content))}, log)
      .then(function(){ return subtlePony('exportKey', 'spki', keypair.publicKey)}, log)
      .then(function(exportedKey){ log('-----BEGIN PUBLIC KEY-----\n' + window.btoa(textDecode(exportedKey)) + '\n-----END PUBLIC KEY-----')}, log)
      .then(function(){ return subtlePony('exportKey', 'pkcs8', keypair.privateKey)}, log)
      .then(function(exportedKey) { log('-----BEGIN PRIVATE KEY-----\n' + window.btoa(textDecode(exportedKey)) + '\n-----END PRIVATE KEY-----')})}, log)
  .then(function(){
    var pubKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcAy8EHtaw22tpqpbe3po3imtgHuynogbW/ydFLMqRIR4Fu+9gRNfXBWDLP10FhjhJWFZjwH3RQXGDTK5zvEKMC61ajiFinDY0tegkOvjsI4x/o/jEB+UxZjS3EZbUaf77Qp7WxaEjwn7/mMW1b4rfy+gmkiebhRx5kMgEwZPWX4HzkbslsSmeHhKWf/NPHaCcvcCzOURhzNrtYlgtg48RzswPmwrxZ6+nHLyC3tnFsSHVuil9hrsup1KIG5XeEKzyjVbIMER6O3NoT35vAlV6/PeW1Rnel+oat02XKNTfb5B3QjF0n2JUHXEHyDZBl7jJ9skOizPC+YMAmJkP1/ywIDAQAB\n-----END PUBLIC KEY-----'
    var privKey = '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1wDLwQe1rDba2mqlt7emjeKa2Ae7KeiBtb/J0UsypEhHgW772BE19cFYMs/XQWGOElYVmPAfdFBcYNMrnO8QowLrVqOIWKcNjS16CQ6+OwjjH+j+MQH5TFmNLcRltRp/vtCntbFoSPCfv+YxbVvit/L6CaSJ5uFHHmQyATBk9ZfgfORuyWxKZ4eEpZ/808doJy9wLM5RGHM2u1iWC2DjxHOzA+bCvFnr6ccvILe2cWxIdW6KX2Guy6nUogbld4QrPKNVsgwRHo7c2hPfm8CVXr895bVGd6X6hq3TZco1N9vkHdCMXSfYlQdcQfINkGXuMn2yQ6LM8L5gwCYmQ/X/LAgMBAAECggEABb4Zl4ZfVyAUs1O5e1WZw1Mz4hFQ90kBKEpx6ZbKJgqbnpakUHqihigCZNFbOKa3GKcIX+QRE/B0EFnVEi+AJN3kdibC/S2ubj86sIWTkPOpcdKCDbWywbMcSdoJElWGbSXCPPqAJNsnIEmmufLkCMwXd60uhfqhOHWPmkHAes3/c+XY2rKscUXfFWUOGQww9KKgkY2RrIW7pNRJdGDjynxQU7OFVXPB1QDIuDz37T4++Iju1dECLrmHUQ2d20OBZNuTABd1r8rthsjRgyxy1mqaGATHtT8I8kEO/2YODJMlnPQD55pfDI9FlXpR43oyYGbkCcZC12myWZK2BIN86QKBgQDe3wQvnNryFjnD3AxmO1c1EYtxJJ7WXLdNj1weorkoaUWor1K4ZLMFBPU0FabT69J6E9++0eLmKDQZQ83mop6bDM9NdHK8fn7Xaf40LYjSt+YovGDIRlfjOxOp0zjJ4GFX2PRgMMrLU2QWr2mPhNOD3OAz4Edree3TN53cxRMc2QKBgQDQxGqVWik12NX5XgGFmhbRUyV0Fr4UjW1xEcymjCivzkjUoJZDX81jflrpvDvwFjXCoT0p6icF6jCveCObodVmgP2a80vijR66OfINACMQvwlRwLyB+HFaXEtCh7JPDUCykF+JSWQffdH21Pn1d6Ln2YaFGO+71oPdz7Oqa3irQwKBgCYQXs2m83nvM9Rwq6l2LxHAOlmLkJk54pCbkHcnAYqWWDBUKUOW50BPNXW80O5W027IICmd/Suj6Cn8e5kNYxtGF825urLYw98UmjbdJAYhJG0Gp1ztLqt/dn9FtOg9q0JuqmYXTztkta5uLRA29k0KFzyk7G29uFGfqRWAjyAZAoGAGCLtU7El3JTiQD9vG5wyESd0yBQtC8FCKvVs3MCNn63Q28xpMwbrfxpHtohNwbc/pe3wXV01/8gQsujH7SFrw7scFwMT/fBk4hD6/CfM5g3ALRSEdt5bdKABD4MSyXL1zO9GLGAw1Dc+xDPhZlDbo8SReeflJ6loe4ec9RIR1HMCgYBac6N58olb31heKVb5nULziuriiOgoH0miVD0REbEgLSGJIiCE9kDd7no2RoYGpgJw2i4XhA79yP6fjO64iNbDqv9ifpwudJZNYjj0gSWSJBZ+/ppfJ9iha/UWRq3GEJFQZhj3c4RQ7i+tXmvXVyI5lsu759KCxS0rRLaXse/NVw==\n-----END PRIVATE KEY-----'

    var getRawKey = function(type, pem) {
      var pemHeader = '-----BEGIN ${type} KEY-----';
      var pemFooter = '-----END ${type} KEY-----';
      var pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
      var binaryDerString = window.atob(pemContents.trim());
      return textEncode(binaryDerString)
    }
    subtlePony('importKey', 'spki', getRawKey('PUBLIC', pubKey),
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {name: 'SHA-256'}
    }, true, ['encrypt'])
      .then(function(publicKey) {
        return subtlePony('encrypt', { name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, publicKey, textEncode('lol2')) }, log)
      .then(function(encrypted) {
        return subtlePony('importKey', 'pkcs8', getRawKey('PRIVATE', privKey),
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: {name: 'SHA-256'}
        }, true, ['decrypt'])
          .then(function(privateKey) {
            return subtlePony('decrypt', { name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, privateKey, encrypted)}, log)}, log)
      .then(function(content) { log(textDecode(content))}, log)
  }, log)
} catch(err) {
  log(err)
}
