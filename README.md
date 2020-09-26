# minitaur

ABANDONED.
[WebAuthn](https://webauthn.guide/) is exactly the same as minitaur's Mode 1, so just use that.

A zero knowledge auth system.

## Mode 1:
Registration:
 - User generates keypair
 - User encrypt private key with a password optionally
 - User stores private key in localStorage
 - User sends public key to Server
 - Server stores public key
 - Server requires 2 factor authentication confirmation (or not IFF it's the first registration ever)
 - User stores it in localStorage optionally

Login:
 - User sends userId and timed nonce A
 - Server generates timed nonce B
 - Server sends encrypted A and B with User public key
 - User decrypts private key with the password if needed
 - User decrypts A and B
 - User sends A and B

PRO:
 - Password is never sent in clear to the server
 - Passwordless is possible
 - Secret is not stored on the server (password can't be stolen from server and bruteforced)

CONS:
 - New device is required to be registered


## Mode 2:

Registration:
 - User generates keypair
 - User encrypt private key with a password
 - User sends public key and encrypted private key
 - Server stores public key and encrypted private key

Login:
 - User sends userId and timed nonce A
 - Server generates nonce B
 - Server sends encrypted A and B with User public key and encrypted private key
 - User decrypts the private key with the password
 - User decrypts A and B
 - User sends A and B

PRO:
 - Password is never sent in clear to the server
 - 2 factor authentication is not needed

CONS:
 - Passwordless is not possible
 - Secret is stored on the server (password can be stolen from server and bruteforced)
