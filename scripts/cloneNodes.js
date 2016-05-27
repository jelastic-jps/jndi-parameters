import com.hivext.api.environment.Environment;
import com.hivext.api.environment.File;

var env,
    SQLDB_MISSION = 'sqldb',
    CACHE_MISSION = 'cache',
    NOSQL_MISSION = 'nosqldb',
    PROCEDURE = "SQLReplace",
    NODE_MISSION_COMPUTE = "cp",
    NODE_MISSION_BALANCER = "bl",
    APPID = hivext.local.getParam("TARGET_APPID"),
    SESSION = hivext.local.getParam("session"),
    envInfoResponse,
    cloneNodes,
    nodes,
    softNodeProperties,
    oResp,
    node,
    oRespDelPass,
    execCmdArray = [],
    execCmdArrayNoSQL = [],
    execCmdArrayDel = [],
    nodeType = '',
    userName,
    nodeTypeSQL,
    callArgs = [],
    oNodeMissionArray = [];

env = hivext.local.exp.wrapRequest(new Environment(APPID, SESSION));

envInfoResponse = env.getEnvInfo();
if (!envInfoResponse.isOK()) {
    return envInfoResponse;
}

nodes = envInfoResponse.getNodes();
iterator = nodes.iterator();
execCmdArrayDel.push({command: "rm /var/lib/jelastic/keys/password.txt"});
command = "cat /var/log/jem.log | grep \"passwd\" | awk \"{print $NF}\" | tail -n1 >> /var/lib/jelastic/keys/password.txt";
execCmdArray.push({command : command});
while(iterator.hasNext()) {
    softNode = iterator.next();
    softNodeProperties = softNode.getProperties();
    var nodeMission = softNodeProperties.getNodeMission();

    oNodeMissionArray[softNodeProperties.getNodeMission()] = oNodeMissionArray[softNodeProperties.getNodeMission()] || [];
    oNodeMissionArray[softNodeProperties.getNodeMission()].push(softNode);
    file = hivext.local.exp.wrapRequest(new File(APPID, SESSION));
    if (SQLDB_MISSION.equals(softNodeProperties.getNodeMission())) {

        oResp = toNative(env.execCmdById({
            nodeid : softNode.id,
            commandList : execCmdArray
        }));
        if (oResp.result != 0 || !oResp.responses) {
            return oResp;
        }
        oResp = toNative(file.read({
            nodeid : softNode.id,
            nodeType : softNode.properties.nodeType,
            path : "/var/lib/jelastic/keys/password.txt"
        }));
        if (oResp.result != 0 || !oResp.body){
            return oResp;
        }
        oRespDelPass = toNative(env.execCmdById({
            nodeid : softNode.id,
            commandList : execCmdArrayDel
        }));

        if (softNode.properties.nodeType.indexOf("mysql") == 0) {
            nodeType = "mysql";
            nodeTypeSQL = "mysql";
            userName = "root";
        }
        if (softNode.properties.nodeType.indexOf("maria") == 0) {
            nodeType = "maria";
            nodeTypeSQL = "maria";
            userName = "root";
        }
        if (softNode.properties.nodeType.indexOf("postgres") == 0) {
            nodeType = "postgres";
            nodeTypeSQL = "postgresql";
            userName = "webadmin";
        }
        callArgs.push({
            procedure : PROCEDURE,
            params : {
                replacement : "db." + nodeType + ".driverClass=org." + nodeTypeSQL + ".Driver\ndb." + nodeType + ".url=jdbc:" + nodeTypeSQL + "://" + softNode.address + "/\ndb." + nodeType + ".username=" + userName +"\ndb." + nodeType + ".password=" + oResp.body
            }
        });
    }
    else if (NODE_MISSION_COMPUTE.equals(softNodeProperties.getNodeMission())) {
        callArgs.push({
            procedure : PROCEDURE,
            params : {
                replacement : "nodes.cp.url=" + softNode.url + "\nnodes.cp.nodeId=" + softNode.id + "\nnodes.cp.address=" + softNode.address + "\nnodes.cp.port=" + softNode.properties.port
            }
        });
    }

    if (NODE_MISSION_BALANCER.equals(softNodeProperties.getNodeMission())) {
        callArgs.push({
            procedure : PROCEDURE,
            params : {
                replacement : "nodes.bl.url=" + softNode.url + "\nnodes.bl.nodeId=" + softNode.id + "\nnodes.bl.address=" + softNode.address + "\nnodes.bl.port=" + softNode.properties.port
            }
        });

    }

    if (CACHE_MISSION.equals(softNodeProperties.getNodeMission())) {
        callArgs.push({
            procedure : PROCEDURE,
            params : {
                replacement : "nodes." + softNodeProperties.getNodeType() + ".name=" + softNode.properties.name + "\nnodes." + softNodeProperties.getNodeType() + ".nodeType=" + softNode.properties.nodeType + "\nnodes." + softNodeProperties.getNodeType() + ".nodeId=" + softNode.id + "\nnodes." + softNodeProperties.getNodeType() + ".address=" + softNode.address + "\nnodes." + softNodeProperties.getNodeType() + ".port=" + softNode.properties.port
            }
        });

    }

    if (NOSQL_MISSION.equals(softNodeProperties.getNodeMission())) {
        command = "grep -q 'u admin' /var/log/jem.log && grep 'u admin' /var/log/jem.log | grep -o '[^ ]*$' | tail -n1 >> /var/lib/jelastic/keys/password.txt || cat  /var/log/jem.log | grep passwd | awk '{print $NF}' >> /var/lib/jelastic/keys/password.txt";
        execCmdArrayNoSQL.push({command : command});
        oResp = toNative(env.execCmdById({
            nodeid : softNode.id,
            commandList : execCmdArrayNoSQL
        }));
        if (oResp.result != 0 || !oResp.responses) {
            return oResp;
        }
        oResp = toNative(file.read({
            nodeid : softNode.id,
            nodeType : softNode.properties.nodeType,
            path : "/var/lib/jelastic/keys/password.txt"
        }));
        if (oResp.result != 0 || !oResp.body){
            return oResp;
        }
        oRespDelPass = toNative(env.execCmdById({
            nodeid : softNode.id,
            commandList : execCmdArrayDel
        }));

        callArgs.push({
            procedure : PROCEDURE,
            params : {
                replacement : "nodes." + softNodeProperties.getNodeType() + ".name=" + softNode.properties.name + "\nnodes." + softNodeProperties.getNodeType() + ".url=" + softNode.url + "\nnodes." + softNodeProperties.getNodeType() + ".nodeId=" + softNode.id + "\nnodes." + softNodeProperties.getNodeType() + ".address=" + softNode.address + "\nnodes." + softNodeProperties.getNodeType() + ".port=" + softNode.properties.port + "\nnodes." + softNodeProperties.getNodeType() + ".password=" + oResp.body
            }
        });

    }
}


if ('${application.settings.addition_envs}'.length > 0) {
    var obj = {};
    aAdditingEnvs = '${application.settings.addition_envs}'.split(',');
    for (var i = 0; i < aAdditingEnvs.length; i ++) {
        obj[aAdditingEnvs[i]] = i;
    }
    envsResponse = env.getEnvs();
    var oEnvs = envsResponse.getResponses();
    envsIterator = oEnvs.iterator();
    while (envsIterator.hasNext()) {

        oneOfTheEnvs = envsIterator.next();
        var sShortDomain = oneOfTheEnvs.getAppNodes().getDomain().getDomain();
        if (obj[sShortDomain] != undefined) {

            nodes = oneOfTheEnvs.getNodes();
            var nodeIterator = nodes.iterator();
            while (nodeIterator.hasNext()) {
                node = nodeIterator.next();
                var nodeProperties = node.getProperties();
                if (!oNodeMissionArray[nodeProperties.getNodeMission()]) {
                    var sReplace = '';
                    var sDBUrl = '',
                        sMission = 'nodes',
                        nodeTypeSQL = nodeProperties.getNodeType();
                    if (nodeProperties.getNodeMission().indexOf('sql') == 0) {
                        if (nodeProperties.getNodeType().indexOf('postgres') == 0) {
                            nodeTypeSQL = 'postgresql';
                            nodeType = 'postgres';
                        }
                        if (nodeProperties.getNodeType().indexOf('mysql') == 0) {
                            nodeTypeSQL = 'mysql';
                        }
                        if (nodeProperties.getNodeType().indexOf('maria') == 0) {
                            nodeTypeSQL = 'maria';
                        }
                        sMission = 'db';
                        sDBUrl = '';
                        sDBUrl = sMission + "." + nodeType + ".url=jdbc:" + nodeTypeSQL + "://" + node.getAddress() + "/";
                        sReplace = "\n" + sMission + "." + nodeType + ".password=";
                        env = hivext.local.exp.wrapRequest(new Environment(oneOfTheEnvs.getAppNodes().getAppid(), SESSION));
                        file = hivext.local.exp.wrapRequest(new File(oneOfTheEnvs.getAppNodes().getAppid(), SESSION));
                        oResp = toNative(env.execCmdById({
                            nodeid : node.getId(),
                            commandList : execCmdArray
                        }));
                        if (oResp.result != 0 || !oResp.responses) {
                            return oResp;
                        }
                        oResp = toNative(file.read({
                            nodeid : node.getId(),
                            nodeType : nodeProperties.getNodeType(),
                            path : "/var/lib/jelastic/keys/password.txt"
                        }));
                        if (oResp.result != 0 || !oResp.body){
                            return oResp;
                        }
                        oRespDelPass = toNative(env.execCmdById({
                            nodeid : node.getId(),
                            commandList : execCmdArrayDel
                        }));

                        sReplace = sReplace + oResp.body;
                    }

                    var sqlDB = sDBUrl ? sDBUrl : sMission +"." + nodeProperties.getNodeType() + ".url=" + node.getUrl();
                    if (node.getUrl() == null) {
                        nodeType = nodeProperties.getNodeType();
                        sqlDB = "";
                    }
                    callArgs.push({
                        procedure : PROCEDURE,
                        params : {
                            replacement : sMission+ "." + nodeType + ".name=" + nodeProperties.getName() + "\n" + sMission + "." + nodeType + ".nodeId=" + node.getId() + "\n" + sMission + "." + nodeType + ".address=" + node.getAddress() + "\n" + sMission + "." + nodeType + ".port=" + nodeProperties.getPort() + "\n" + sReplace + sqlDB
                        }
                    });
                }
            }}
    }
}


return {
    result : 0,
    onAfterReturn : {
        call : callArgs
    }
};