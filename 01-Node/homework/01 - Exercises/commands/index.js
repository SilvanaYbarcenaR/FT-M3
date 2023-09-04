const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");

const pwd = (print) => {
    print(process.cwd());
}

const date = (print) => {
    print(Date());
}

const echo = (print, args) => {
    print(args);
}

const ls = (print) => {
    fs.readdir(".", (error, files) => {
        if(error) throw Error(error);
        print(files.join(" "));
    })
}

const cat = (print, args) => {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error) throw Error(error);
        print(data);
    })
}

const head = (print, args) => {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error) throw Error(error);
        print(data.split(/\n/)[0])
    })
}

const tail = (print, args) => {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error) throw Error(error);
        print(data.split(/\n/).at(-1).trim())
    })
}

const curl = (print, args) => {
    utils.request(`http://${args}`, (error, response) => {
        if(error) throw Error(error);
        print(response);
    })
}

module.exports = {
    pwd,
    date,
    echo,
    ls,
    cat,
    head,
    tail,
    curl
};
