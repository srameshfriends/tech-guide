### ArangoDB

Installation via Package Manager

First add the repository key to apt like this:

```
curl -OL https://download.arangodb.com/arangodb311/DEBIAN/Release.key
sudo apt-key add - < Release.key
```

Use apt-get to install arangodb:

```
echo 'deb https://download.arangodb.com/arangodb311/DEBIAN/ /' | sudo tee /etc/apt/sources.list.d/arangodb.list
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install arangodb3=3.11.6-1
```

After installation ArangoDB only listens to localhost, which is set by default. To expose the service to another network, you have to adjust the ArangoDB configuration.

Edit the configuration. Default location /etc/arangodb3/arangod.conf (Ubuntu)

```
#endpoint = tcp://127.0.0.1:8529     // comment out that line
endpoint = tcp://192.168.123.4:8529  // add your servers IP address
```

Or expose it to all networks (if wanted):

```
endpoint = tcp://0.0.0.0:8529  // listen to all networks
```

Perform a restart of the ArangoDB service:

```
sudo systemctl restart arangodb3
```

