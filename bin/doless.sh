#!/bin/bash

for file in $(find application/source/resource/skilltester/css/ -name *.less)
do
	css="${file//less/css}"
	#/usr/local/bin/lessc "$file" > "$css"
	/usr/local/share/npm/bin/lessc "$file" > "$css"
done
