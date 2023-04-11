const express = require("express");
const processRoutes = express.Router();
const process = require("process");
const os = require("os");
const numCors = os.cpus().length;
const compression=require("compression")

processRoutes.get("/info", compression(), async (req, res) => {
    try {
        const info={
            Arg:`Argumentos de entrada ${process.argv}`,
            Sistema:`Sistema ${process.platform}`,
            VersionNode:`Version de Node${process.version}`,
            Memoria:`Uso de memoria ${JSON.stringify(process.memoryUsage())}`,
            PathExe:`Path de ejecucion ${process.title}`,
            ProcessId:`Id del proceso ${process.pid}`,
            Carpeta:`Directorio ${process.cwd()}`,
            Procesadores:`Numero de procesadores presentes ${numCors}`,
        }
        res.send(info);
    } catch (error) {
        return res.status(400).send({
            error: `An error occurred trying to read products ${error.message}`,
        });
    }
});

module.exports = processRoutes;