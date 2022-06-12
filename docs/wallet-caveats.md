# Wallet Caveats

## Modal

How do the providers appearing on the modal work?

- For MetaMask and Coinbase Wallet, if you're on your desktop
  - a) and you have the extension installed and enabled, it'll connect you to it
  - b) otherwise, it'll display a QR code to scan with your mobile device in the wallet's app

## Desktop connection locally

For the MetaMask and Coinbase Wallet extensions in Chrome, you have to set "This Can Read and Change Site Data" to "On All Sites".

MetaMask will show a warning in orange:

- **"Balance may be outdated"**: In the Chrome extension, you have to set "This Can Read and Change Site Data" to "On All Sites".
  - Side note: Metamask tracks and collects your data, even if you set that option off in the extension. So, only keep this one when you need it (while developing and testing)

Coinbase wallet won't even let you log in. It will just say "Something went wrong!"

## mobile <-> desktop connection locally

This connection is often made through a QR code you scan from the wallets app on your phone.

**For this connection to work, you must use SSL**.

### Using SSL for local development

An error will appear in your console when opening walletconnect on a non-SSL domain (http): `Cannot read properties of undefined (reading 'importKey')`.

This is because in order for most wallet providers to connect to your deApp, your domain needs to use SSL.

You can use **mkcert** to add SSL to your domain for local development.

On MacOS:

1) Install mkcert

    ```bash
    brew install mkcert
    brew install nss # if you use Firefox
    ```

2) Add mkcert to your local root CAs

    ```bash
    mkcert -install
    ```

    This generates a local **certificate authority (CA)**. Your mkcert-generated local CA is only trusted locally, on your device.

    <br>

3) Generate a **certificate** for your site from its root directory (or in a sub-directory - I created a `certs` sub-directory) signed by mkcert.

    ```bash
    mkcert <your-local-ip> # ex. 192.168.1.111
    ```

    or

    ```bash
    mkcert localhost
    ```

    or

    ```bash
    mkcert <custom-hostname> # ex. mysite.example
    ```

    Now, your certificate is ready and signed by a certificate authority your browser trusts locally. Next, your server needs to know about your certificate.

    <br>

4) Configure your server

    For React, you will need to pass the following key-value pairs to your `start` script:

    ```text
    SSL_CRT_FILE=./certs/<name>.pem
    SSL_KEY_FILE=./certs/<name>-key.pem
    HTTPS=true
    ```

5) Restart your server, and remember to navigate to the https version of your site.

#### Using SSL on your mobile device

For the certificates to be trusted on mobile devices, you will have to install the root CA. You can do this with the following steps:

1) Find the `rootCA.pem` file in the folder outputted by this command

    ```bash
    mkcert -CAROOT
    ```

2) Airdrop it to your mobile device

3) For iOS, go to Settings and install the profile

4) For iOS, go to General -> About -> Certificate Trust Settings and toggle enable for it.

**Note**: Disable this when you're not using it, it is a security risk and highly not recommended to do.
