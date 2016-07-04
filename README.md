[![JNDI Parameters](images/postaddon.png)](../../../jndi-parameters)
## JNDI Parameters

The JPS package deploys JNDI Parameters that initially contains 1 application server and 1 database container. 

### Highlights
This package is designed to deploy JNDI Parameters environment is an JPS-based installation packadge for tomcat + mysql environment creation.<br />
Create tomcat + mysql environment. Create mobileapp-server-api.properties file and store environment parameters (cp.url, cp.nodeId, cp.address, cp.port, db cretentials/url, bl.url, bl.nodeId, bl.address, bl.port) in it.

### Environment Topology

![JNDI Parameters Topology](https://docs.google.com/drawings/d/1QotJRxHlNVesRTOscuZcx3DGOCOib05hgnGoSYDEyeQ/pub?w=505&h=216)

### Specifics

Layer                |     Server    | Number of CTs <br/> by default | Cloudlets per CT <br/> (reserved/dynamic) | Options
-------------------- | --------------| :----------------------------: | :---------------------------------------: | :-----:
AS                   | Tomcat Java |       1                        |           1 / 16                          | -
DB                   |    MySQL      |       1                        |           1 / 16                           | -

* AS - Application server 
* DB - Database 
* CT - Container

**Alfresco Version**: x.x<br/>
**Tomcat Version**: 7.0.67<br/>
**Java Engine**: Java 6<br/>
**MySQL Database**: 5.7.12

### Deployment

In order to get this solution instantly deployed, click the "Get It Hosted Now" button, specify your email address within the widget, choose one of the [Jelastic Public Cloud providers](https://jelastic.cloud) and press Install.

[![GET IT HOSTED](https://raw.githubusercontent.com/jelastic-jps/jpswiki/master/images/getithosted.png)](https://jelastic.com/install-application/?manifest=https%3A%2F%2Fgithub.com%2Fjelastic-jps%2Fjndi-parameters%2Fraw%2Fmaster%2Fmanifest.jps)

To deploy this package to Jelastic Private Cloud, import [this JPS manifest](../../raw/master/manifest.jps) within your dashboard ([detailed instruction](https://docs.jelastic.com/environment-export-import#import)).

More information about Jelastic JPS package and about installation widget for your website can be found in the [Jelastic JPS Application Package](https://github.com/jelastic-jps/jpswiki/wiki/Jelastic-JPS-Application-Package) reference.