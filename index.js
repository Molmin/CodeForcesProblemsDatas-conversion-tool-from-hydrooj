const fs=require('fs');
const yaml=require('yamljs');
const files=fs.readdirSync("../origin");
var child_process=require('child_process');

for(var i=0;i<files.length;i++){
    var files2=fs.readdirSync(`../origin/${files[i]}`);
    console.log(`${files[i]}/* :`,files2);
    for(var j=0;j<files2.length;j++){
        var file=files2[j];

        var datas=yaml.load(`../origin/${files[i]}/${file}/problem.yaml`);
        var judgeconfig=yaml.load(`../origin/${files[i]}/${file}/testdata/config.yaml`);
        if(judgeconfig==null)judgeconfig={time: "1s", memory: "256m"};
        if(judgeconfig.time==undefined)judgeconfig.time="1s";
        if(judgeconfig.memory==undefined)judgeconfig.memory="256m";

        var problemconfig={limits:{}};
        problemconfig.title=datas.title;
        problemconfig.tags=datas.tag;
        problemconfig.limits.time=judgeconfig.time;
        problemconfig.limits.memory=judgeconfig.memory;

        console.log(`Reading ${files[i]}/${file}`);
        console.log(`new problem:`,datas.pid,problemconfig.title);

        fs.mkdirSync(`../datas/${datas.pid}`,(err)=>{});
        fs.writeFileSync(`../datas/${datas.pid}/config.json`,JSON.stringify(problemconfig),(err)=>{});
        var statement=fs.readFileSync(`../origin/${files[i]}/${file}/problem.md`,'utf8');
        fs.writeFileSync(`../datas/${datas.pid}/statement.md`,statement,(err)=>{});
        child_process.spawn('cp',['-r',`../origin/${files[i]}/${file}/additional_file/`,`../datas/${datas.pid}/files`]);
        console.log(`done problem:`,datas.pid,problemconfig.title);
    }
}