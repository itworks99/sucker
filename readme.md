# Sucker

Visual editor of new/existing configuration files for Squid proxy.

### To install and run:

### 1. In a local docker container:

```shell
docker pull itworks99/sucker
docker run -d -p 8080:8080 itworks99/sucker
```

### 2. On a local system (Debian/Ubuntu):

```shell
sudo apt-get install git python3 python3-pip -y
git clone https://github.com/itworks99/sucker.git
cd sucker
pip3 install -r requirements.txt
python3 src/sucker.py
```

### To use:

Navigate to http://localhost:8080/

### Screenshot:

![Screenshot](Screenshot_Sucker.png)
