# Sucker

Editor for Squid proxy configuration files based on default squid.conf.

### To install and run:

### 1. In a local docker container:

```shell
docker pull itworks99/sucker
docker run -d -p 8080:8080 itworks99/sucker
```

### 2. On a local system (Debian/Ubuntu):

```shell
sudo apt-get install git python3 python3-pip -y
https://github.com/itworks99/sucker.git
cd sucker
pip3 install -r requirements.txt
python3 src/sucker.py
```

### To use:

Navigate to http://localhost:8080/

### Screenshot:

![Screenshot](Screenshot_Sucker.png)
