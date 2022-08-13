/**
 * CREDITS: https://gist.github.com/nkhil/6b3a9180d292d8b6adc1d2ddee3dc407#file-create-rsa-public-private-key-pair-js
 */

const crypto = require('crypto')
const fs = require('fs')

const MODULUS_LENGTH = 2048
const exportOptions = {
  type: 'pkcs1',
  format: 'pem',
}
const encoding = 'utf-8'

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  // The standard secure default length for RSA keys is 2048 bits
  modulusLength: MODULUS_LENGTH,
})

// *********************************************************************
//
// To export the public key and write it to file:

const exportedPublicKeyBuffer = publicKey.export(exportOptions)
fs.writeFileSync('public.pem', exportedPublicKeyBuffer, { encoding })
// *********************************************************************

// *********************************************************************
//
// To export the private key and write it to file

const exportedPrivateKeyBuffer = privateKey.export(exportOptions)
fs.writeFileSync('private.pem', exportedPrivateKeyBuffer, { encoding })

// *********************************************************************
