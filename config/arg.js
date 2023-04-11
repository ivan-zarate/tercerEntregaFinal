const ParsedArgs= require("minimist");

const arguments= process.argv.slice(2);
const args=ParsedArgs(arguments, {
    alias:{
        p:"port",
        m:"mode"
    },
    default:{
        p:8080,
        m:"FORK"
    }
});
const {port, mode}= args;
const newArgs= {port, mode};
module.exports=newArgs