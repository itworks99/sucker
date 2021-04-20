from bottle import Bottle, Route, run, static_file, request, response

from parser import list_available_config_files, parse_config_file_squid, parse_imported_config_squid

CONFIG_FILE_DIRECTORY = "./srv/templates/"

cfg_file_ver = list_available_config_files(CONFIG_FILE_DIRECTORY)
cfg_ver = cfg_file_ver[1].replace(".", "")

app = Bottle()


@app.hook("after_request")
def enable_cors():
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, access-control-allow-headers, " \
        "access-control-allow-methods, access-control-allow-origin "


@app.route("/")
@app.route("/index.html")
@app.route("/static/<filepath:path>")
def server_static(filepath):
    return static_file(filepath, root="./build/static")


@app.route('/favicon.ico', method='GET')
def get_favicon():
    print("favicon requested")
    return static_file('favicon.ico', root='./public/')


@app.route("/json", method="GET")
def send_json():
    print("Json data request received.")
    return parse_config_file_squid("config", cfg_file_ver, cfg_ver)


@app.route("/version", method="OPTIONS")
def process_and_return_requested_version():
    data = request.json
    if type(data) is dict:
        cfg_ver = data["version"]
        cfg_ver = cfg_ver.replace(".", "").strip()
        return parse_config_file_squid("config", cfg_file_ver, cfg_ver)
    return ""


@app.route("/import", method="POST")
def import_config():
    return parse_imported_config_squid(
        request.body, cfg_file_ver, cfg_ver
    )


@app.get("/")
def root():
    index_file = ""
    index_file_handler = open("./build/index.html", "r")
    for read_index_line in index_file_handler:
        index_file += read_index_line
    index_file_handler.close()
    return index_file


@app.get("/static/img/<filepath:re:.*\.(jpg|png|gif|ico)>")
def img(filepath):
    return static_file(filepath, root="./build/static/img")


@app.error(404)
@app.error(500)
def error404(error):
    error_file = ""
    error_file_handler = open("./build/error.html", "r")
    for read_error_line in error_file_handler:
        error_file += read_error_line
    error_file_handler.close()
    return error_file


if __name__ == "__main__":
    run(
        app=app,
        server="gunicorn",
        host="0.0.0.0",
        port=3000,
        reloader=True,
        debug=True
    )
