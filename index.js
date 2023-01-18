const fs=require('fs');
const yaml=require('yamljs');
const files=fs.readdirSync("../origin");
var child_process=require('child_process');

function work(id){
    if(id==files.length)return;
    var file=files[id];
    console.log(file);

    var datas=yaml.load(`../origin/${file}/problem.yaml`);
    var judgeconfig=yaml.load(`../origin/${file}/testdata/config.yaml`);
    if(judgeconfig==null)judgeconfig={time: "1s", memory: "256m"};
    if(judgeconfig.time==undefined)judgeconfig.time="1s";
    if(judgeconfig.memory==undefined)judgeconfig.memory="256m";

    var problemconfig={limits:{}};
    problemconfig.title=datas.title;
    problemconfig.tags=datas.tag;
    problemconfig.limits.time=judgeconfig.time;
    problemconfig.limits.memory=judgeconfig.memory;
    console.log(problemconfig);

    fs.mkdir(`../datas/${datas.pid}`,(err)=>{
        fs.writeFile(`../datas/${datas.pid}/config.json`,JSON.stringify(problemconfig),(err)=>{
            fs.readFile(`../origin/${file}/problem.md`,'utf8',(err,statement)=>{
                fs.writeFile(`../datas/${datas.pid}/statement.md`,statement,(err)=>{
                    child_process.spawn('cp',['-r',`../origin/${file}/additional_file/`,`../datas/${datas.pid}/files`]); 
                    work(id+1);
                });
            });
        });
    });
}

work(0);