
#### nodejs - NPM - choco

###  About Nodejs

* As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications
* Node.js is similar in design to, and influenced by, systems like Ruby's Event Machine and Python's Twisted.
* HTTP is a first-class citizen in Node.js, designed with streaming and low latency in mind. This makes Node.js well suited for the foundation of a web library or framework.
* Node.js is an open-source and cross-platform JavaScript runtime environment. It is a popular tool for almost any kind of project!
* Node.js runs the V8 JavaScript engine, the core of Google Chrome, outside of the browser. This allows Node.js to be very performant.

#### Install Node.js

Official packages for all the major platforms are available at: https://nodejs.org/download/.

**nvm** is a popular way to run Node.js. It allows you to easily switch the Node.js version, and install new versions to try and easily rollback if something breaks. It is also very useful to test your code with old Node.js versions.

An Example Node.js Application, save it as a server.js file and run node server.js in your terminal.

```

const http = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

```

Start the server as follows

```
node server.js
```

Here are the most common shutdown signals in Node. js: SIGINT: The SIGINT signal is generated when the user presses CTRL+C on the terminal.

More example for nodejs : https://github.com/nodejs/examples

###  About npm

https://docs.npmjs.com/about-npm

**npm** is the software registry

Open source developers from every continent use npm to share and borrow packages

npm consists of three distinct components:

1. Website
2. Command Line Interface (CLI)
3. Registry


**Use npm to**

* Adapt packages of code for your apps, or incorporate packages as they are.
* Download standalone tools you can use right away.
* Run packages without downloading using npx. https://docs.npmjs.com/cli/v10/commands/npx
* Share code with any npm user, anywhere.
* Restrict code to specific developers.
* Create organizations to coordinate package maintenance, coding, and developers.
* Form virtual teams by using organizations.
* Manage multiple versions of code and code dependencies.
* Update applications easily when underlying code is updated.
* Discover multiple ways to solve the same puzzle.
* Find other developers who are working on similar problems and projects.

#### Setting up your npm user account

* Creating a new user account on the public registry
* Creating a strong password, Receiving a one-time password over email
* Configuring two-factor authentication
* Accessing npm using two-factor authentication
* Recovering your 2FA-enabled account

Checking your version of npm and Node.js

```
node -v
npm -v
```

## About Chocolatey Software

Chocolatey is a software management solution unlike any you've ever experienced on Windows. Think of it like this - you create a software deployment package using a little PowerShell, then you can deploy it anywhere you have Windows with everything (like Puppet, SCCM, Altiris, Connectwise Automate, etc).
    
**Features**
1. Deploy Anywhere You Have Windows/Cloud Ready, Deploy with Everything
2. Packages are Independent and Portable, Completely Offline and Secure
3. Test Your Deployments, Create Your Own Deployment Packages
4. PowerShell Automation, Manage Dependencies With Ease
5. Open Source Licensing Is Ready for Business

#### Installing Chocolatey CLI

1. First, ensure that you are using an administrative shell
2. Copy the text specific to your command shell - cmd.exe or powershell.exe.

-  Why do I need to enable TLS 1.2 in PowerShell? Shouldn't it be on by default when I load PowerShell?

Install with cmd.exe
Run the following command:


```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

Install with PowerShell.exe

With PowerShell, there is an additional step. You must ensure Get-ExecutionPolicy is not Restricted. We suggest using Bypass to bypass the policy to get things installed or AllSigned for quite a bit more security.

Run Get-ExecutionPolicy. If it returns Restricted, then run Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process.
Now run the following command:

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

```

Upgrading Chocolatey

```
choco upgrade chocolatey
```

**Uninstall** visit the following web size : https://docs.chocolatey.org/en-us/choco/uninstallation


# NPM

**npm run command**

The npm run command lets you define custom scripts in your **package.json** , so you can reduce complex node-related shell scripts into simple one-liners.

Available Scripts

In the project directory, you can run:

Runs the app in the development mode.

To start node server

```
npm start
```

The page will reload when you make changes.
You may also see any lint errors in the console.


```
npm test
```

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```
npm run build
```

#### Eject

This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

```
npm run eject
```




