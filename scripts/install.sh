if [ "sqldb" == "${@node.nodeGroup}" ]; then \
	PASSWORD=`cat /var/log/jem.log | grep "passwd" | awk -F \ \ '{print $6}' | tail -n1` \
	; if [ "`expr index ${@node.nodeType} mysql`" == "0" ]; then \
      nodeType=mysql \
      nodeTypeSQL=mysql \
		  userName=root \
		  REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${@node.address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
		  sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
	; fi \
	; if [ "`expr index ${@node.nodeType} maria`" == "0" ]; then \
	    nodeType=maria \
		  nodeTypeSQL=maria \
		  userName=root \
		  REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${@node.address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
		  sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
	; fi \
  ; if [ "`expr index ${@node.nodeType} postgres`" == "0" ]; then \
      nodeType=postgres \
      nodeTypeSQL=postgresql \
      userName=webadmin \
      REPLACEMENT='db.${nodeType}.driverClass=org.${nodeTypeSQL}.Driver\ndb.${nodeType}.url=jdbc:${nodeTypeSQL}://${@node.address}/\ndb.${nodeType}.username=${userName}\ndb.${nodeType}.password=${PASSWORD}' \
      sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
  ; fi \
; elif [ "cp" == "${@node.nodeGroup}" ]; then \
    REPLACEMENT='nodes.cp.url=${@node.url}\nnodes.cp.nodeId=${@node.id}\nnodes.cp.address=${@node.address}\nnodes.cp.port=${@node.port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "bl" == "${@node.nodeGroup}" ]; then \
    REPLACEMENT='nodes.bl.url=${@node.url}\nnodes.bl.nodeId=${@node.id}\nnodes.bl.address=${@node.address}\nnodes.bl.port=${@node.port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "cache" == "${@node.nodeGroup}" ]; then \
    REPLACEMENT='nodes.${@node.nodeType}.name=${@node.name}\nnodes.${@node.nodeType}.nodeType=${@node.nodeType}\nnodes.${@node.nodeType}.nodeId=${@node.id}\nnodes.${@node.nodeType}.address=${@node.address}\nnodes.${@node.nodeType}.port=${@node.port}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi \
; if [ "nosqldb" == "${@node.nodeGroup}" ]; then \
    grep -q 'u admin' /var/log/jem.log && grep 'u admin' /var/log/jem.log | grep -o '[^ ]*$' | tail -n1 >> /var/lib/jelastic/keys/password.txt || cat /var/log/jem.log | grep passwd | awk '{print $NF}' >> /var/lib/jelastic/keys/password.txt; \
    PASSWORD=$(< /var/lib/jelastic/keys/password.txt) \
    rm /var/lib/jelastic/keys/password.txt \
    REPLACEMENT='nodes.${@node.nodeType}.name=${@node.name}\nnodes.${@node.nodeType}.url=${@node.url}\\nnodes.${@node.nodeType}.nodeId=${@node.id}\\nnodes.${@node.nodeType}.address=${@node.address}\nnodes.${@node.nodeType}.port=${@node.port}\nnodes.${@node.nodeType}.password=${PASSWORD}' \
    sed "s~//StartJel~//StartJel\n${REPLACEMENT}\n~g" ${HOME}/mobileapp-server-api.properties \
; fi
