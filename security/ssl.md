### An Overview of One-Way SSL and Two-Way SSL

#### SSL (Secure Socket Layer) 

SSL is the standard technology used for enabling secure communication between a client and sever to ensure data security & integrity. SSL has evolved with time and several versions have been introduced to deal with any potential vulnerabilities. SSL V2 released in 1995 was the first public version of SSL followed by SSL V3 in 1996 followed by TLS V1.0 in 1999, TLS V1.1 in 2006 and TLS V1.2 in 2008.

For ensuring security of the data being transferred between a client and server, SSL can be implemented either one-way or two-way. In this post, I will briefly explain the difference between One-Way SSL and Two-Way SSL (also known as Mutual SSL).

#### How One-Way SSL Works?

In one way SSL, only client validates the server to ensure that it receives data from the intended server. For implementing one-way SSL, server shares its public certificate with the clients.
Below is the high level description of the steps involved in establishment of connection and transfer of data between a client and server in case of one-way SSL:

1. Client requests for some protected data from the server on HTTPS protocol. This initiates SSL/TLS handshake process.

2. Server returns its public certificate to the client along with server hello message.

3. Client validates/verifies the received certificate. Client verifies the certificate through certification authority (CA) for CA signed certificates.

4. SSL/TLS client sends the random byte string that enables both the client and the server to compute the secret key to be used for encrypting subsequent message data. The random byte string itself is encrypted with the server’s public key.

5. After agreeing on this secret key, client and server communicate further for actual data transfer by encrypting/decrypting data using this key.
   Below is the pictorial description explaining how one way ssl works:

![One way SSL](img/one-way-ssl.png)

#### How Two-Way (Mutual) SSL works?

Contrary to one-way SSL; in case of two-way SSL, both client and server authenticate each other to ensure that both parties involved in the communication are trusted. Both parties share their public certificates to each other and then verification/validation is performed based on that.

Below is the high level description of the steps involved in establishment of connection and transfer of data between a client and server in case of two-way SSL:

1. Client requests a protected resource over HTTPS protocol and the SSL/TSL handshake process begins.
2. Server returns its public certificate to the client along with server hello.
3. Client validates/verifies the received certificate. Client verifies the certificate through certification authority (CA) for CA signed certificates.
4. If Server certificate was validated successfully, client will provide its public certificate to the server.
5. Server validates/verifies the received certificate. Server verifies the certificate through certification authority (CA) for CA signed certificates.
6. After completion of handshake process, client and server communicate and transfer data with each other encrypted with the secret keys shared between the two during handshake.
   Below image explains the same in pictorial format:

![Two way SSL](img/2-way-ssl.png)






