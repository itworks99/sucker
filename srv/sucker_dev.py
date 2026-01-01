#!/usr/bin/env python3
"""
Development server for Sucker backend.
Runs on port 8000 to avoid conflicts with Vite dev server on port 3000.
"""
import os
import sys

from bottle import Bottle, run, request, response

# Add srv to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'srv'))

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


@app.route("/json", method=["GET", "OPTIONS"])
def send_json():
    if request.method == "OPTIONS":
        return {}
    print("Json data request received.")
    return parse_config_file_squid("config", cfg_file_ver, cfg_ver)


@app.route("/version", method=["POST", "OPTIONS"])
def process_and_return_requested_version():
    if request.method == "OPTIONS":
        return {}
    data = request.json
    if type(data) is dict:
        cfg_ver = data["version"]
        cfg_ver = cfg_ver.replace(".", "").strip()
        return parse_config_file_squid("config", cfg_file_ver, cfg_ver)
    return ""


@app.route("/import", method=["POST", "OPTIONS"])
def import_config():
    if request.method == "OPTIONS":
        return {}
    return parse_imported_config_squid(
        request.body, cfg_file_ver, cfg_ver
    )


if __name__ == "__main__":
    print("=" * 60)
    print("Sucker Backend Development Server")
    print("=" * 60)
    print(f"Backend API running on: http://localhost:8000")
    print(f"Config directory: {CONFIG_FILE_DIRECTORY}")
    print(f"Available versions: {cfg_file_ver}")
    print("=" * 60)
    print()

    run(
        app=app,
        host="0.0.0.0",
        port=8000,
        reloader=True,
        debug=True
    )
