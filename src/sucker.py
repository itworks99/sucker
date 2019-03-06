from bottle import Bottle, run, static_file, request, response
from parser import parse_config_file_squid, parse_imported_config_squid, list_available_config_files

CONFIG_FILE_DIRECTORY = "/src"

config_file_versions = list_available_config_files(CONFIG_FILE_DIRECTORY)
config_version = (config_file_versions[1].replace('.', ''))


app = Bottle()


@app.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS,POST'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@app.route("/")
@app.route("/index.html")
@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='../build/static')


@app.route('/json', method='GET')
def send_json():
    return (parse_config_file_squid('config', config_file_versions, config_version))


@app.route('/version', method='OPTIONS')
def process_and_return_requested_version():

    data = request.json

    if type(data) is dict:
        config_version = data["version"]
        config_version = config_version.replace('.', '').strip()
        return (parse_config_file_squid('config', config_file_versions, config_version))
    else:
        return


@app.route('/import', method='POST')
def import_config():
    return (parse_imported_config_squid(request.body, config_file_versions, config_version))


@app.get("/")
def root():
    indexFile = ''
    indexFileHandler = open("../build/index.html", "r")
    for readIndexLine in indexFileHandler:
        indexFile += readIndexLine
    indexFileHandler.close()
    return (indexFile)


@app.get("/static/img/<filepath:re:.*\.(jpg|png|gif|ico)>")
def img(filepath):
    return static_file(filepath, root="../build/static/img")


@app.error(404)
@app.error(500)
def error404(error):
    errorFile = ''
    errorFileHandler = open('../build/error.html', "r")
    for readErrorLine in errorFileHandler:
        errorFile += readErrorLine
    errorFileHandler.close()
    return (errorFile)


if __name__ == "__main__":
    run(app=app, server='gunicorn', host='0.0.0.0',
        port=3000, reloader=True, debug=True)
