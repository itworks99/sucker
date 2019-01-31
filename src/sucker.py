from bottle import Bottle, request, response, run
from parser import parse_config_file_squid, parse_imported_config_squid

from bottle import Bottle, run, static_file, request

app = Bottle()


@app.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@app.route("/")
@app.route("/index.html")
@app.get("/")
def root():
    indexFile = ''
    indexFileHandler = open('build/index.html', "r")
    for readIndexLine in indexFileHandler:
        indexFile += readIndexLine
    indexFileHandler.close()
    return (indexFile)


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='build/static')


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
    errorFileHandler = open('build/error.html', "r")
    for readErrorLine in errorFileHandler:
        errorFile += readErrorLine
    errorFileHandler.close()
    return (errorFile)


if __name__ == "__main__":
    run(app=app, server='auto', host='0.0.0.0',
        port=8080, reloader=True, debug=True)
