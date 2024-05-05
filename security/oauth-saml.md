## OAuth 2

### Stateless Approach

Two different scenario

1. Shopping cart - which is more related to business functionality
2. OAuth 2 & JWT - which is related to security and authentication

I'd expect that any item I add to my shopping cart from my mobile device while commuting to my workplace, should be available in the cart when I login to the website from my PC after reaching home. Therefore, the cart data should be saved in the back-end DB and linked to my user account.

When it comes to authentication using OAuth 2.0, the JWT access token and / or refresh token need to be stored somewhere in the client device, so that once the user authenticates himself by providing login credentials, he doesn't need to provide his credentials again to navigate through the website. In this context, the browser local storage, session storage and cookies are all valid options. However, note that here the cookie is not linked to any session on the server side. In other words, the cookie doesn't store any session id. The cookie is merely used as a storage for access token which is passed to the server with every http request and the server then validates the token using the digital signature to ensure that it is not tampered and it is not expired.

Although all three storage options for access and / or refresh tokens are popular, cookie seems to be the most secured option when used in the correct way.

#### Which OAuth 2.0 grant type should I use?

#### Here (in the authorization code grant type) the flow looks like below:

1. The user clicks on the login button on the SSO landing page
2. The user is redirected to the authorization server login page. The client id is provided in the URL query parameter
3. The user enters his / her credentials and clicks on the login button. The username and password will be sent to the authorization server using HTTP POST. The credentials should be sent in the request body or header and NOT in the URL (as URLs are logged in browser history and application server). Also, the proper caching HTTP headers should be set, so that the credentials are not cached: Cache-Control: no-cache, no-store, Pragma: no-cache, Expires: 0
4. The authorization server authenticates the user against a user database (say, LDAP server) where the username and the hash of the user password (hashing algorithms like Argon2, PBKDF2, Bcrypt or Scrypt) is stored with a random salt
5. On successful authentication, the authorization server would retrieve from its database the redirect URL against the provided client id in the URL query parameter. The redirect URL is the resource server URL
6. The user will then be redirected to a resource server endpoint with a authorization code in the URL query parameter
7. The resource server will then do an HTTP POST request to the authorization server for access token. The authorization code, client id, client secret should go in the request body. (Appropriate caching headers as above should be used)
8. The authorization server would return the access token and the refresh token in response body or header (with the appropriate caching header as mentioned above)


#### Why shouldn't I store the tokens in browser localstorage or sessionstorage?

Many SPAs do store access and / or refresh token in the browser localstorage or sessionstorage. The reason I think we shouldn't store the tokens in these browser storages are:

If XSS occurs, the malicious script can easily read the tokens from there and send them to a remote server. There on-wards the remote server or attacker would have no problem in impersonating the victim user.
localstorage and sessionstorage are not shared across sub-domains. So, if we have two SPA running on different sub-domains, we won't get the SSO functionality because the token stored by one app won't be available to the other app within the organization

If, however, the tokens are still stored in any of these browser storages, proper fingerprint must be included. Fingerprint is a cryptographically strong random string of bytes. The Base64 string of the raw string will then be stored in a HttpOnly, Secure, SameSite cookie with name prefix __Secure-. Proper values for Domain and Path attributes. A SHA256 hash of the string will also be passed in a claim of JWT. Thus Even if an XSS attack sends the JWT access token to an attacker controlled remote server, it cannot send the original string in cookie and as a result the server can reject the request based on the absence of the cookie. Also, XSS and script injection can be further mitigated by using an appropriate content-security-policy response header.

https://zellwk.com/blog/cookies-vs-localstorage-for-storing-access-tokens/

#### Using Cookies vs Local Storage for storing access tokens

Many people have voiced strong opinions about whether one should use Cookies or localStorage to store credentials like access tokens.

The common argument is cookies are more secure, but localStorage is easier to use.

From my research, I believe neither argument is correct.


* They’re equally risky
* They’re equally easy (or not easy) to use.

In this article, I want to share with you my findings on this topic after hours of research, pondering, and testing.

By the end of this article, you would have knowledge and clarity about the security and implementation of both methods. You would also have confidence know which method — cookies or localStorage — is superior for your use-case, and you would be able to back up your choice with solid reasoning.

We’ll begin by talking about implementation.


### Using Cookies

We’re going to assume you obtain your credentials (access tokens, etc) from a server that’s what happens most of the time.

If you use Cookies, you can save the access token directly from your server. Here’s what you would do if you use Express.

```
app.get('auth/provider/callback_url', async (req, res) => {
  // Use code to exchange for access token
  const response = await fetch('...')
  const { access_token } = await response.json()

  // Saves access token in a cookie
  res.cookie('access_token', access_token)

  // Redirect user to logged-in page after saving the access token
  res.redirect('/')
})
```

When you save the access token as a cookie, I highly recommend adding the secure, httpOnly, and sameSite attributes. (I’ll explain why I recommend these attributes in the security section later).

So the cookie looks like this:

```
app.get('/', async (req, res) => {
  res.cookie('access_token', access_token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  })
})
```

#### Expiring cookies

If your access token has an expiry date, you can set an expiry value with the maxAge property. This allows the browser to delete the cookie when the cookie expires.

```
app.get('auth/provider/callback_url', async (req, res) => {
  // ...
  res.cookie('access_token', access_token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: expires_in * 1000, // Converts seconds to milliseconds
  })
  // ...
})
```

If you want to read the cookie’s expiry date from a server, you cannot use the maxAge property. You have to either use a JSON cookie or set a new token for the expiry date.

Here’s what it looks like:

```
// Setting a JSON cookie
const value = JSON.stringify({
  access_token: access_token,
  expiry: Date.now() + expires_in * 1000,
})

res.cookie('access_token', `j: ${value}`)
```

#### Reading cookie values from a server

Each cookie is registered under a Site. You can see the Site value if you check the cookie in your browser’s developer tools.


* For Chrome: Applications > Cookies
* For Firefox: Storage > Cookies

If the frontend lives on the same Site as the backend, cookies will passed to the backend automatically when the browser sends a GET or POST request. (Same Site here means the frontend and backend have the same domain or subdomain).

If you use Express, you can read the cookie values easily with the cookie-parser library.

```
import cookieParser from 'cookie-parser'

app.use(cookieParser())

app.get('/', (req, res) => {
  const { access_token } = req.cookies
})
```

If your frontend lives on a different Site from the server, you cannot use cookies, since cookies will only be sent to servers on the same Site. This applies unless you set your cookie’s sameSite attribute to none, which is not a good practice for security. (Cookies with sameSite: none are used for 3rd party cookies; it shouldn’t be used for authentication).

Fun aside: Notice I say GET and POST requests above? Well, that’s because browsers can’t send PUT or DELETE requests through a form. If you need to send cookies for PUT and DELETE requests, you have to hack a method value or use Fetch with credentials.

### Using localStorage

Saving an access token in localStorage is more complex because you have to fulfill two steps:


1. You have to find a way to pass the token from the server to the frontend
2. You have to save the token to localStorage

There are various ways to pass a token from the server to the frontend. Each method has their own pros and cons, so I’d recommend you check the article out for more details.











#### Passing access tokens from a server to a browser

Once you get the access token into the frontend, you can use the setItem method to save the value into localStorage.

```
localStorage.setItem('access_token', access_token)
```

Expiring tokens in localStorage

Like cookies, you can only store string values in localStorage. If you want to store the expiry date of a token, you can either use a JSON entry or you can create a new localStorage entry.

```
// Using JSON with localStorage
const entry = JSON.stringify({
  value: access_token,
  expiry: Date.now() + expires_in * 1000,
})

localStorage.setItem(access_token, value)


```

```
// Using another localStorage entry to store expiry
const expiry = Date.now() + expires_in * 1000
localStorage.setItem('access_token', access_token)
localStorage.setItem('access_token_expiry', expiry)
```

Browsers do not handle expiry values for you in localStorage, so you have to clear them manually if you want to keep things clean.

```
// Deleting values from localstorage
localStorage.deleteItem('access_token')
```

Of course, you can make things simpler with a library if you wish to.


### Using values stored in localStorage

You can get a value from localStorage with the getItem method.

```
const access_token = localStorage.getItem('access_token')
```

After getting the token value, you can send it to the server with Fetch. This token is sent under an Authorization header.

```
// Sends the access token to the server
fetch('/server', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
})
```

You can access the access_token in the server like this:

```
app.get('/server', (req, res) => {
  const access_token = req.headers.authorization.split(' ')[1]
})
```

That’s all the implementation details you need to know. Let’s talk about security next.

### Cookie security

Cookies, by default, are not secure. Since cookies are sent to the server automatically, authentication done via cookies can be susceptible to CSRF attacks.

Setting the cookie’s sameSite attribute to strict prevents most CSRF attacks. But we still need to use CSRF tokens to protect against Login CSRF.

You can increase a cookie’s security by adding the secure attribute. This ensures the cookie can only be served in a HTTPS connection, which prevents man-in-the-middle attacks. But the secure attribute is kinda moot in this day and age where HTTPS is the de-facto connection.

You can further increase security by adding the httpOnly attribute. This prevents frontend JavaScript from reading the cookie, which prevents anyone from stealing the access token if your site gets an XSS attack.

In case you’re wondering, you cannot send a cookie from one Site to another Site. It’s impossible because the technology doesn’t allow it. So a httpOnly cookie can never be stolen.

### Security for localStorage

localStorage is more secure than cookies by default since you cannot get a CSRF attack.

You cannot get CSRFed because CSRF attacks originate from an external site. If your tokens are stored in localStorage, the attacker needs to find a way to access your localStorage values from an external website, which is impossible since only your JavaScript can access localStorage.

Your only concern when using localStorage is an XSS attack — where the attacker someone finds a way to insert JavaScript onto your site. If they managed to insert JavaScript on your website, they can write code to steal the access token.

Many security professionals get fiery because there’s a possibility where access tokens may be stolen. We need to talk a bit more about XSS since that seems to be the determining security factor between cookies and localStorage.


### A note about XSS Attacks

An XSS attack happens when someone manages to inject JavaScript into your website. These attacks can come from many places.

Common prevent techniques involve sanitizing user-generated content before storing them in the database, or before using them in the HTML.

XSS attacks can also come from libraries you may be using since any resources on the Internet has the possibility to be compromised. Unless you can ensure you write every line of code in-house, it’s almost impossible to completely guard against XSS attacks with the way we code nowadays.


XSS attacks are a big deal since credentials can be stolen if they’re stored in localStorage.

But credentials saved in cookies aren’t safe either. Attackers can still send authenticated request by using Fetch with the credentials option if they XSS your site. These requests would be treated as authenticated requests since a server has no way to check whether the request is actually coming from the real user.

Here’s another question that was raised during my research — why would anyone steal credentials if they can already make authenticated requests? In other words, why would you want to steal a bank’s access code if you already have access to a bank’s vault? It makes no sense.

So it doesn’t matter whether you save your credentials in cookies or localStorage. If you actually get an XSS attack, you’re screwed either way. This means the possibility of an XSS shouldn’t be used as the determining factor between cookies and localStorage.

## Quick summary

Security wise:

* Cookies are susceptible to both CSRF at XSS attacks. Make sure you protect against both kinds of attacks.
* localStorage is only susceptible to XSS attacks. Again, make sure you protect against XSS attacks as much as you can.

Implementation wise:

* Cookies are easier to implement since there are lesser steps involved. But you have to make sure to set sameSite and httpOnly attributes. You also have to make sure your frontend and backend are served on the same Site.
* localStorage is harder to implement since you need to send access tokens to the frontend before you can save them in localStorage. But this method gives you the flexibility to implement a frontend-only login system on a different domain.



### Cookie Utility

https://github.com/js-cookie/js-cookie

https://www.jsdelivr.com/package/npm/js-cookie

<hr>

<hr>


###  Introduction

OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol.

Hardt, D., Ed., “The OAuth 2.0 Authorization Framework,” RFC 6749, DOI 10.17487/RFC6749, October 2012.

OAuth 2.0 Authorization Framework define mechanisms to obtain and use Access Tokens to access resources but do not define standard methods to provide identity information.
OpenID Connect implements authentication as an extension to the OAuth 2.0 authorization process. 

#### Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 [RFC2119]. 

#### Terminology

**Authorization Code Flow** : OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint and all tokens are returned from the Token Endpoint. 

**Claim**: Piece of information asserted about an Entity. 

**Claim Type**: Syntax used for representing a Claim Value. This specification defines Normal, Aggregated, and Distributed Claim Types. 

**Credential**: Data presented as evidence of the right to use an identity or other resources. 

**ID Token**: JSON Web Token (JWT) that contains Claims about the Authentication event. It MAY contain other Claims.

**Issuer**: Entity that issues a set of Claims.

**Issuer Identifier**: Verifiable Identifier for an Issuer. An Issuer Identifier is a case-sensitive URL using the https scheme that contains scheme, host, and optionally, port number and path components and no query or fragment components. 

#### Overview

The OpenID Connect protocol, in abstract, follows the following steps. 

1. The RP (Client) sends a request to the OpenID Provider (OP).
2. The OP authenticates the End-User and obtains authorization.
3. The OP responds with an ID Token and usually an Access Token.
4. The RP can send a request with the Access Token to the UserInfo Endpoint.
5. The UserInfo Endpoint returns Claims about the End-User.

####  ID Token

An ID token is an artifact that proves that the user has been authenticated. It was introduced by OpenID Connect (OIDC)
an open standard for authentication used by many identity providers such as Google, Facebook, Auth0, and, etc.

Actually, the OpenID Connect specifications don't require the ID token to have user's claims. In its minimal structure, it has no data about the user; just info about the authentication operation.

**REQUIRED**

**iss:**  URL using the https scheme that contains scheme, host, and optionally, port number and path components and no query or fragment components.

**sub:** A locally unique and never reassigned identifier within the Issuer for the End-User, which is intended to be consumed by the Client

**aud:** OAuth 2.0 client_id of the Relying Party as an audience value.

**exp:** Expiration time on or after which the ID Token MUST NOT be accepted by the RP when performing authentication with the OP.

**iat:** Time at which the JWT was issued


**MUST**

**nonce** A nonce may be used to ensure security for a stream cipher.

**OPTIONAL**

**acr, amr, azp**

```
  {
   "iss": "https://server.example.com",
   "sub": "24400320",
   "aud": "s6BhdRkqt3",
   "nonce": "n-0S6_WzA2Mj",
   "exp": 1311281970,
   "iat": 1311280970,
   "auth_time": 1311280969,
   "acr": "urn:mace:incommon:iap:silver"
  }
```

### Authentication Flow

Authentication can follow one of three paths: 

1. The Authorization Code Flow (response_type=code), 
2. The Implicit Flow (response_type=id_token token or response_type=id_token), 
3. The Hybrid Flow (using other Response Type values defined in OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]). The flows determine how the ID Token and Access Token are returned to the Client.


###  Authorization Code Flow Steps

1. Client prepares an Authentication Request containing the desired request parameters.
2. Client sends the request to the Authorization Server.
3. Authorization Server Authenticates the End-User.
4. Authorization Server obtains End-User Consent/Authorization.
5. Authorization Server sends the End-User back to the Client with an Authorization Code.
6. Client requests a response using the Authorization Code at the Token Endpoint.
7. Client receives a response that contains an ID Token and Access Token in the response body.
8. Client validates the ID token and retrieves the End-User's Subject Identifier.


###  The Implicit Flow Steps

The Implicit flow was a simplified OAuth flow previously recommended for native apps and JavaScript apps where the access token was returned immediately without an extra authorization code exchange step.

**Security Risks**: Returning access tokens in an HTTP redirect without confirmation that they have been received by the client poses inherent risks.
**Lack of Authentication**: The Implicit flow bypasses the code exchange step, which means it doesn’t authenticate the client.
**Not Recommended**: Due to these risks, it is not recommended to use the Implicit flow. Some servers even prohibit its usage entirely.

### The Hybrid Flow Steps

The OAuth 2.0 Hybrid Flow is an interesting combination of characteristics from both the Implicit flow and the Authorization Code flow. 

**User Interaction:**

The user initiates the process by selecting “Login” within the application.
The application then redirects the user to the Auth0 Authorization Server using the /authorize endpoint.
The response_type parameter indicates the type of requested credentials (ID token and authorization code), and the response_mode parameter is set to form_post to ensure security during the redirection.

**Authentication and Authorization:**

The Auth0 Authorization Server prompts the user to authenticate (using one of the configured login options) and may display a consent prompt listing the permissions the application will receive.
Upon successful authentication, the Auth0 Authorization Server redirects the user back to the application with a single-use authorization code and an ID token (and optionally, an access token).

**Token Retrieval:**

The application sends the authorization code, its client ID, and its credentials (such as Client Secret or Private Key JWT) to the Auth0 Authorization Server using the /oauth/token endpoint.
The Auth0 Authorization Server verifies the authorization code, client ID, and application credentials.
In response, the Auth0 Authorization Server provides a second ID token and an access token (and optionally, a refresh token).

**Accessing Resources:**

The application can now use the second access token to call an API and access information about the user.
The API responds with the requested data.

**ID Token vs. Access Token:**

If your application only needs sign-on functionality, you may not need a refresh token or an access token. An ID token with claims might suffice.
In summary, the Hybrid Flow allows immediate access to an ID token while ensuring secure retrieval of access and refresh tokens. It’s particularly useful when your application needs to access user information immediately but must perform additional processing before accessing protected resources for an extended period of time12.

**Remember that security best practices recommend using the authorization code flow with PKCE for most scenarios, especially for native apps and JavaScript apps. However, the Hybrid Flow remains an option for specific use cases.**

#### Token validation by resource servers

A resource server is responsible for protecting resources such as APIs via OAuth2 access tokens. 

Access tokens are intended for authorizing the access of a resource. The resource server should be able to verify the access token sent by the application.

If the application sends a self-contained JWT access token, then the resource server can validate the access token without interacting with the authorization server. 

OAuth2.0 supports token introspection (opens new window) to inspect the access tokens and refresh tokens using authorization servers.

Asgardeo provides the /oauth2/introspect endpoint to perform token validation. A resource server can inspect tokens using Asgardeo and know the information related to the tokens. 



### OAuth 2.0 Token Introspection

OAuth 2.0 Token Introspection is a mechanism that allows resource servers to obtain information about access tokens. It provides a way for resource servers (such as APIs) to check the validity of access tokens and discover additional details associated with the token. Let’s explore the key aspects of Token Introspection:

**1. Purpose**


**Resource Servers:** These servers need to verify access tokens presented by clients (e.g., mobile apps, web applications) to ensure their validity.

**Token Introspection**: It provides a standardized way for resource servers to query the authorization server about an access token.

**2. How It Works**

1. When a client (resource server) receives an access token, it can make a request to the token introspection endpoint.
2. The introspection endpoint verifies the token’s validity and returns information about the token.

**3. Endpoint and Request**

1. The token introspection endpoint typically resides alongside the token endpoint (where tokens are issued).
2. The request to the introspection endpoint is a POST request containing a parameter named "token".
3. This endpoint should not be publicly accessible to developers; it’s meant for internal use.

**4. Response Properties**

The introspection endpoint responds with a JSON object containing the following properties:

**active**: A boolean indicating whether the token is currently active (issued by the authorization server, not revoked, and not expired).

**scope**: A JSON string with a space-separated list of scopes associated with the token.

**5. Alternatives**

Besides introspection, another approach is to use a structured token format recognized by both the authorization server and resource server. For example, the JWT Profile for OAuth 2.0 Access Tokens defines a standardized format using JWTs, allowing resource servers to validate tokens without network calls.

### Token Request

A Client makes a Token Request by presenting its Authorization Grant  (in the form of an Authorization Code) to the Token Endpoint using the grant_type value authorization_code.

If the Client is a Confidential Client, then it MUST authenticate to the Token Endpoint using the authentication method registered for its client_id

```
 POST /token HTTP/1.1
  Host: server.example.com
  Content-Type: application/x-www-form-urlencoded
  Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

  grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

### Token Request Validation

1. Ensure the Authorization Code was issued to the authenticated Client.
2. Verify that the Authorization Code is valid.
3. If possible, verify that the Authorization Code has not been previously used.
4. Ensure that the redirect_uri parameter value is identical to the redirect_uri parameter value that was included in the initial Authorization Request. If the redirect_uri parameter value is not present when there is only one registered redirect_uri value, the Authorization Server MAY return an error (since the Client should have included the parameter) or MAY proceed without an error (since OAuth 2.0 permits the parameter to be omitted in this case).
5. Verify that the Authorization Code used was issued in response to an OpenID Connect Authentication Request (so that an ID Token will be returned from the Token Endpoint).

### Successful Token Response

1. After receiving and validating a valid and authorized Token Request from the Client, the Authorization Server returns a successful response that includes an ID Token and an Access Token. 	The response uses the application/json media type.
2. The OAuth 2.0 token_type response parameter value MUST be Bearer, as specified in OAuth 2.0 Bearer Token Usage [RFC6750], unless another Token Type has been negotiated with the Client. Servers SHOULD support the Bearer Token Type; use of other Token Types is outside the scope of this specification. Note that the token_type value is case insensitive.

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  Cache-Control: no-store

  {
   "access_token": "SlAV32hkKG",
   "token_type": "Bearer",
   "refresh_token": "8xLOxBtZp8",
   "expires_in": 3600,
   "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzc
     yI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5
     NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZ
     fV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5Nz
     AKfQ.ggW8hZ1EuVLuxNuuIJKX_V8a_OMXzR0EHR9R6jgdqrOOF4daGU96Sr_P6q
     Jp6IcmD3HP99Obi1PRs-cwh3LO-p146waJ8IhehcwL7F09JdijmBqkvPeB2T9CJ
     NqeGpe-gccMg4vfKjkM8FcGvnzZUN4_KSP0aAp1tOJ1zZwgjxqGByKHiOtX7Tpd
     QyHE5lcMiKPXfEIQILVq0pc_E2DzL7emopWoaoZTF_m0_N0YzFC6g6EJbOEoRoS
     K5hoDalrcvRYLSrQAZZKflyuVCyixEoV9GfNQC3_osjzw2PAithfubEEBLuVVk4
     XUVrWOLrLl0nx7RkKU8NXNHq-rvKMzqg"
  }
```

### ID Token Validation

1. If the ID Token is encrypted, decrypt it using the keys and algorithms that the Client specified during Registration that the OP was to use to encrypt the ID Token. If encryption was negotiated with the OP at Registration time and the ID Token is not encrypted, the RP SHOULD reject it.
2. The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
3. The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience. The aud (audience) Claim MAY contain an array with more than one element. The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
4. If the implementation is using extensions (which are beyond the scope of this specification) that result in the azp (authorized party) Claim being present, it SHOULD validate the azp value as specified by those extensions.
5. This validation MAY include that when an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
6. If the ID Token is received via direct communication between the Client and the Token Endpoint (which it is in this flow), the TLS server validation MAY be used to validate the issuer in place of checking the token signature. The Client MUST validate the signature of all other ID Tokens according to JWS [JWS] using the algorithm specified in the JWT alg Header Parameter. The Client MUST use the keys provided by the Issuer.
7. The alg value SHOULD be the default of RS256 or the algorithm sent by the Client in the id_token_signed_response_alg parameter during Registration.
8. If the JWT alg Header Parameter uses a MAC based algorithm such as HS256, HS384, or HS512, the octets of the UTF-8 [RFC3629] representation of the client_secret corresponding to the client_id contained in the aud (audience) Claim are used as the key to validate the signature. For MAC based algorithms, the behavior is unspecified if the aud is multi-valued.
9. The current time MUST be before the time represented by the exp Claim.
10. The iat Claim can be used to reject tokens that were issued too far away from the current time, limiting the amount of time that nonces need to be stored to prevent attacks. The acceptable range is Client specific.
11. If a nonce value was sent in the Authentication Request, a nonce Claim MUST be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The Client SHOULD check the nonce value for replay attacks. The precise method for detecting replay attacks is Client specific.
12. If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate. The meaning and processing of acr Claim Values is out of scope for this specification.
13. If the auth_time Claim was requested, either through a specific request for this Claim or by using the max_age parameter, the Client SHOULD check the auth_time Claim value and request re-authentication if it determines too much time has elapsed since the last End-User authentication.


### SAML Authentication

Security Assertion Markup Language (SAML) is a login standard that helps users access applications based on sessions in another context. It’s a single sign-on (SSO) login method offering more secure authentication (with a better user experience) than usernames and passwords.

SAML stands for Security Assertion Markup Language. It is an XML-based
open-standard for transferring identity data between two parties: an
identity provider (IdP) and a service provider (SP).

* **Identity Provider:** Performs authentication and passes the user’s identity and authorization level to the service provider.
* **Service Provider:** Trusts the identity provider and authorizes the given user to access the requested resource.

### Benefits of SAML Authentication

* Improved User Experience
* Increased Security
* Loose Coupling of Directories
* Reduced Costs for Service Providers

### Spring boot SAML 2.0 Login Overview

https://docs.spring.io/spring-security/reference/servlet/saml2/login/overview.html

Spring Security/Servlet Applications/SAML2/SAML2 Log In/SAML2 Log In Overview

OAuth 2.0 Login, Spring Security takes the user to a third party for performing authentication. It does this through a series of redirects:

![Spring boot SAML-2](img/spring-boot-saml-2.png)

**Note:** The figure above builds off our SecurityFilterChain and AbstractAuthenticationProcessingFilter diagrams:

1. First, a user makes an unauthenticated request to the /private resource, for which it is not authorized.
2. Spring Security’s AuthorizationFilter indicates that the unauthenticated request is Denied by throwing an AccessDeniedException.
3. number 3 Since the user lacks authorization, the ExceptionTranslationFilter initiates Start Authentication. The configured AuthenticationEntryPoint is an instance of LoginUrlAuthenticationEntryPoint, which redirects to the <saml2:AuthnRequest> generating endpoint, Saml2WebSsoAuthenticationRequestFilter. Alternatively, if you have configured more than one asserting party, it first redirects to a picker page.
4. Next, the Saml2WebSsoAuthenticationRequestFilter creates, signs, serializes, and encodes a <saml2:AuthnRequest> using its configured Saml2AuthenticationRequestFactory.
5. number 5 Then the browser takes this <saml2:AuthnRequest> and presents it to the asserting party. The asserting party tries to authentication the user. If successful, it returns a <saml2:Response> back to the browser.
6.  The browser then POSTs the <saml2:Response> to the assertion consumer service endpoint.

The following image shows how Spring Security authenticates a <saml2:Response>.


![SAML 2 - SSO - AUTH ](img/saml2-web-sso-authentication-filter.png)

**Note:** The figure builds off our SecurityFilterChain diagram.

1. When the browser submits a <saml2:Response> to the application, it delegates to Saml2WebSsoAuthenticationFilter. This filter calls its configured AuthenticationConverter to create a Saml2AuthenticationToken by extracting the response from the HttpServletRequest. This converter additionally resolves the RelyingPartyRegistration and supplies it to Saml2AuthenticationToken.
2. Next, the filter passes the token to its configured AuthenticationManager. By default, it uses the OpenSamlAuthenticationProvider.
3. If authentication fails, then Failure.
   * The SecurityContextHolder is cleared out.
   * The AuthenticationEntryPoint is invoked to restart the authentication process.
4. If authentication is successful, then Success.
   * The Authentication is set on the SecurityContextHolder.
   * The Saml2WebSsoAuthenticationFilter invokes FilterChain#doFilter(request,response) to continue with the rest of the application logic.

```
<repositories>
    <!-- ... -->
    <repository>
        <id>shibboleth-releases</id>
        <url>https://build.shibboleth.net/nexus/content/repositories/releases/</url>
    </repository>
</repositories>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-saml2-service-provider</artifactId>
</dependency>
```

Specifying Identity Provider Metadata

```
spring:
  security:
    saml2:
      relyingparty:
        registration:
          adfs:
            identityprovider:
              entity-id: https://idp.example.com/issuer
              verification.credentials:
                - certificate-location: "classpath:idp.crt"
              singlesignon.url: https://idp.example.com/issuer/sso
              singlesignon.sign-request: false
```

**where**

* idp.example.com/issuer is the value contained in the Issuer attribute of the SAML responses that the identity provider issues.
* classpath:idp.crt is the location on the classpath for the identity provider’s certificate for verifying SAML responses.
* idp.example.com/issuer/sso is the endpoint where the identity provider is expecting AuthnRequest instances.
* adfs is an arbitrary identifier you choose

### How SAML 2.0 Login Integrates with OpenSAML

Spring Security’s SAML 2.0 support has a couple of design goals:

* Rely on a library for SAML 2.0 operations and domain objects. To achieve this, Spring Security uses OpenSAML.

* Ensure that this library is not required when using Spring Security’s SAML support. To achieve this, any interfaces or classes where Spring Security uses OpenSAML in the contract remain encapsulated. This makes it possible for you to switch out OpenSAML for some other library or an unsupported version of OpenSAML.

As a natural outcome of these two goals, Spring Security’s SAML API is quite small relative to other modules. Instead, such classes as OpenSamlAuthenticationRequestFactory and OpenSamlAuthenticationProvider expose Converter implementations that customize various steps in the authentication process.

For example, once your application receives a SAMLResponse and delegates to Saml2WebSsoAuthenticationFilter, the filter delegates to OpenSamlAuthenticationProvider:


![OPEN SAML AUTH ](img/open-saml-authentication-provider.png)

This figure builds off of the Saml2WebSsoAuthenticationFilter diagram.

1. The Saml2WebSsoAuthenticationFilter formulates the Saml2AuthenticationToken and invokes the AuthenticationManager.
2. The AuthenticationManager invokes the OpenSAML authentication provider.
3. The authentication provider deserializes the response into an OpenSAML Response and checks its signature. If the signature is invalid, authentication fails.
4. Then the provider decrypts any EncryptedAssertion elements. If any decryptions fail, authentication fails.
5. Next, the provider validates the response’s Issuer and Destination values. If they do not match what’s in the RelyingPartyRegistration, authentication fails.
6. After that, the provider verifies the signature of each Assertion. If any signature is invalid, authentication fails. Also, if neither the response nor the assertions have signatures, authentication fails. Either the response or all the assertions must have signatures.
7. Then, the provider ,decrypts any EncryptedID or EncryptedAttribute elements]. If any decryptions fail, authentication fails.
8. Next, the provider validates each assertion’s ExpiresAt and NotBefore timestamps, the <Subject> and any <AudienceRestriction> conditions. If any validations fail, authentication fails.
9. Following that, the provider takes the first assertion’s AttributeStatement and maps it to a Map<String, List<Object>>. It also grants the ROLE_USER granted authority.
10. And finally, it takes the NameID from the first assertion, the Map of attributes, and the GrantedAuthority and constructs a Saml2AuthenticatedPrincipal. Then, it places that principal and the authorities into a Saml2Authentication.


The resulting Authentication#getPrincipal is a Spring Security Saml2AuthenticatedPrincipal object, and Authentication#getName maps to the first assertion’s NameID element. Saml2AuthenticatedPrincipal#getRelyingPartyRegistrationId holds the identifier to the associated RelyingPartyRegistration.




































