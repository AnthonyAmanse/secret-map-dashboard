#!/bin/bash

# add linux1 to member of docker group
echo -e "adding linux1 to docker group"
sudo usermod -aG docker linux1

# install docker-compose
echo -e "*** Installing docker-compose. ***\n"
sudo zypper install -y python-pyOpenSSL python-setuptools
sudo easy_install pip
sudo pip install docker-compose==1.18.0
echo -e “*** Done with docker-compose. ***\n”

echo -e "I guess you should log out and log back in???"
