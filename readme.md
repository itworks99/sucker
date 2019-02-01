# Sucker

Editor for Squid proxy configuration files based on default squid.conf.

### install as local docker container

Pull from ![Docker repo](https://hub.docker.com/r/itworks99/sucker):

```s
docker pull itworks99/sucker
docker run -d -p 8080:8080 itworks99/sucker
```

### install on a local system

```shell
sudo apt-get install git python3 python3-pip -y
https://github.com/itworks99/sucker.git
cd sucker
pip3 install -r requirements.txt
python3 src/sucker.py
```

### to run

Navigate to http://localhost:8080/

## Screenshots

![Screenshot](Screenshot_Sucker.png)
