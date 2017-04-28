#!/bin/zsh

t=`date  +%Y%m%d%H%M.%S`;mina deploy stage=production02 t=$t; mina deploy stage=production03 t=$t;
