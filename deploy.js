var Service = require('node-windows').Service;

// Create a new service object 
var svc = new Service({
  name:'nodeSupportCompanies',
  description: '支撑单位管理系统',
  script: 'D:\\novback\\server.js'
});

// Listen for the "install" event, which indicates the 
// process is available as a service. 
svc.on('install',function(){
  svc.start();
});

svc.install();