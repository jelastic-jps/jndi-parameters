#!/bin/bash
nodeGroup=$1
nodeType=$2
address=$3
url=$4
id=$5
port=$6
name=$7

if [ "sqldb" == "${nodeGroup}" ]; then \
   PASSWORD=`cat /var/log/jem.log | grep "passwd" | awk -F " " '{print $6}' | tail -n1` \
   ; if [ "`expr index ${nodeType} mysql`" == "0" ]; then \
      nodeType=mysql \
      nodeTypeSQL=mysql \
      userName=root \
      REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
      sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
   ; fi \
   ; if [ "`expr index ${nodeType} maria`" == "0" ]; then \
      nodeType=maria \
      nodeTypeSQL=maria \
      userName=root \
      REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
      sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
  ; fi \
  ; if [ "`expr index ${nodeType} postgres`" == "0" ]; then \
      nodeType=postgres \
      nodeTypeSQL=postgresql \
      userName=webadmin \
      REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
      sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
  ; fi \
; elif [ "cp" == "${nodeGroup}" ]; then \
    REPLACEMENT='nodes.cp.url=${url}\nnodes.cp.nodeId=${id}\nnodes.cp.address=${address}\nnodes.cp.port=${port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "bl" == "${nodeGroup}" ]; then \
    REPLACEMENT='nodes.bl.url=${url}\nnodes.bl.nodeId=${id}\nnodes.bl.address=${address}\nnodes.bl.port=${port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "cache" == "${nodeGroup}" ]; then \
    REPLACEMENT='nodes.${nodeType}.name=${name}\nnodes.${nodeType}.nodeType=${nodeType}\nnodes.${nodeType}.nodeId=${id}\nnodes.${nodeType}.address=${address}\nnodes.${nodeType}.port=${port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "nosqldb" == "${nodeGroup}" ]; then \
    grep -q 'u admin' /var/log/jem.log && grep 'u admin' /var/log/jem.log | grep -o '[^ ]*$' | tail -n1 >> /var/lib/jelastic/keys/password.txt || cat /var/log/jem.log | grep passwd | awk '{print $NF}' >> /var/lib/jelastic/keys/password.txt; \
    PASSWORD=$(< /var/lib/jelastic/keys/password.txt) \
    rm /var/lib/jelastic/keys/password.txt \
    REPLACEMENT='nodes.${nodeType}.name=${name}\nnodes.${nodeType}.url=${url}\\nnodes.${nodeType}.nodeId=${id}\\nnodes.${nodeType}.address=${address}\nnodes.${nodeType}.port=${port}\nnodes.${nodeType}.password=${PASSWORD}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi
