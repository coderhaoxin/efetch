#!/usr/bin/env bash

DIR=`pwd`
CMD="node"
DEST="${DIR}/test/server.js"

ACTION=$1

get_pid() {
  PID=`ps ax | grep ${CMD} | grep ${DEST} | awk '{print $1}'`
}

start() {
  get_pid

  if [ -z $PID ]; then
    echo "starting"
    $CMD $DEST 2>&1 &
    get_pid
    echo "start success. server pid=${PID}"
  else
    echo "already running. server pid=${PID}"
  fi
}

stop() {
  get_pid

  if [ -z $PID ]; then
    echo "server not running"
  else
    kill -15 $PID
    echo "server stopped"
  fi
}

test() {
  stop
  start
  node_modules/karma/bin/karma start test/karma.conf.js
}

case "$ACTION" in
  test)
    test
  ;;
  *)
    test
  ;;
esac
