#!/bin/bash
# My first script

echo "Expost node Path "
export NODE_PATH="/home/nodejs/erp/node_modules"

echo "Start ProGateway servere"

forever start app.js

forever list