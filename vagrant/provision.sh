#!/bin/bash
set -e -u -x

function os_bootstrap
{
  export LANGUAGE=en_US.UTF-8
  export LANG=en_US.UTF-8
  export LC_ALL=en_US.UTF-8
  sudo locale-gen en_US.UTF-8
  sudo dpkg-reconfigure locales -f noninteractive
  sudo apt-get update
  sudo apt-get install -y git unzip automake autoconf libreadline-dev libncurses5-dev libssl-dev libyaml-dev libxslt-dev libffi-dev libtool unixodbc-dev build-essential inotify-tools bash-completion linux-headers-$(uname -r) dkms
  sudo apt-get install -y ubuntu-desktop
}

function sass_bootstrap
{
  wget https://github.com/sass/dart-sass/releases/download/1.24.4/dart-sass-1.24.4-linux-x64.tar.gz -P ~/
  tar -xvf ~/dart-sass-1.24.4-linux-x64.tar.gz --directory ~/
  sudo mv ~/dart-sass/* /usr/local/bin
  rm -rf ~/dart-sass
  rm ~/dart-sass-1.24.4-linux-x64.tar.gz
}

function vscode_bootstrap
{
  wget https://go.microsoft.com/fwlink/?LinkID=760868 -O ~/vscode.deb -P ~/
  sudo apt install ~/vscode.deb
  rm -rf ~/vscode.deb
}

function nvm_bootstrap
{
  wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

  . /home/vagrant/.nvm/nvm.sh
}

function node_bootstrap
{
  nvm install 13.6.0
  npm install -g uglify-js
}

function prov_done
{
  sudo shutdown -h now
}

function elm_bootstrap
{
  curl -L -o ~/elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
  gunzip ~/elm.gz
  chmod +x elm
  sudo mv elm /usr/local/bin
}

os_bootstrap
nvm_bootstrap
node_bootstrap
sass_bootstrap
elm_bootstrap
vscode_bootstrap
prov_done
