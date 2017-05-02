#!/bin/sh
if builtin command -v node > /dev/null ; then
  echo already installed nodejs
else
  echo installing nodejs ...
  brew install node
fi
NODE_VERSION_RAW=`node -v`
NODE_VERSION_STR=${NODE_VERSION_RAW:1}
NODE_VERSION=$(echo $NODE_VERSION_STR | awk -F. '{printf "%2d%02d%02d", $1,$2,$3}')
echo "required node version is >= 7.5.0"
echo "your node version is $NODE_VERSION_STR"
if [ ! "$NODE_VERSION" -ge 70500 ]; then
  echo updating nodejs ...
  if command -v n > /dev/null ; then
    echo already installed n
  else
    npm i -g n
  fi
  n latest
fi

echo "ready to run, maybe"
