import os
from parser import *

from bottle import Bottle, run, static_file, request

app = Bottle()


@app.route("/")
@app.route("/index.html")
def root():
    indexFile = ''
    indexFileHandler = open('../build/index.html', "r")
    for readIndexLine in indexFileHandler:
        indexFile += readIndexLine
    indexFileHandler.close()
    return (indexFile)


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='../build/static')


@app.route('/json', method='GET')
def send_json():
    return (parse_config_file_squid('config'))


@app.route('/import', method='POST')
def import_config():
    return (parse_imported_config_squid(request.body))


@app.error(404)
@app.error(500)
def error404(error):
    errorFile = ''
    errorFileHandler = open('../build/error.html', "r")
    for readErrorLine in errorFileHandler:
        errorFile += readErrorLine
    errorFileHandler.close()
    return (errorFile)


run(app, host='localhost', port=8080)
