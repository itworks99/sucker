# Sucker

Visual editor and migration tool for new or existing Squid proxy configuration files.

- [Sucker](#sucker)
  - [Features](#features)
    - [1. To install](#1-to-install)
    - [1.1. In a local docker container](#11-in-a-local-docker-container)
    - [1.2. On a local system (Debian/Ubuntu)](#12-on-a-local-system-debianubuntu)
    - [2. To use](#2-to-use)
    - [3. To add your own Squid config template](#3-to-add-your-own-squid-config-template)
    - [4. Screenshot](#4-screenshot)

## Features

- Support for Squid configuration files - versions 2 to 5
- Search over tags
- Import existing configurations
- Migrate between Squid versions
- Add your own config templates

### 1. To install

### 1.1. In a local docker container

```shell
docker pull itworks99/sucker
docker run -d -p 3000:3000 itworks99/sucker
```

### 1.2. On a local system (Debian/Ubuntu)

```shell
sudo apt-get install git python3 python3-pip -y
git clone https://github.com/itworks99/sucker.git
cd sucker
pip3 install -r requirements.txt
python3 srv/sucker.py
```

### 2. To use

Once you completed the installation, navigate to <http://localhost:3000/>

### 3. To add your own Squid config template

1. Follow steps in 1.2.
2. Copy squid.conf as squid[version number].conf to sucker/srv/templates with [version number] as a squid version (for example, squid.conf for Squid version 4.4 will became squid44.conf)
3. Rebuild local docker image and start/restart local docker container or restart with the python on a local system as outlined in 1.2.

### 4. Screenshot

![Screenshot](Screenshot_Sucker.png)
