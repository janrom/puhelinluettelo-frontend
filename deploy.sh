#!/bin/sh
npm run build
rm -r ../puhelinluettelo-backend/build
cp -r build ../puhelinluettelo-backend
