import os

import flask
import simplejson as json
from flask import Flask, render_template

app = Flask(__name__)
debug = True


@app.route("/")
def index():
    return render_template("index.html")


squidDefaultconfigFile = "squid.conf"
defaultJSONConfigFile = "config.json"

FILESectionMarker = "# --"
FILETagMarker = "#  TAG: "
FILEDefaultValueMarker = "#Default:"
FILEDefaultValueDisabledMarker = "#"
FILEVersionMarker = "WELCOME TO SQUID"

JSONsectionDelimeter = ",\r"
JSONConfigFileHeader = '{\r"sections": '
JSONConfigFileTag = ',\r"entry": '
JSONConfigFileValue = ',\r"value": '
JSONConfigFileEnabled = ',\r"isenabled": '
JSONConfigFileAllSections = ',\r"allsections": '
JSONConfigFileHelp = ',\r"help": '
JSONConfigVersion = ',\r"version": '
JSONConfigSwitchable = ',\r"switchable": '
JSONConfigFileFooter = "\r}"

defaultSquidConfigStorage = []
defaultSquidConfigSections = []
squidVersion = []


def parseSquidconfig(fileName):
    currentLine = ""
    helpTagSectionStart = False
    helpTagSectionText = ""
    defaultSquidConfigSectionPassed = False
    currentTagName = ""
    sectionNumber = -1
    switchable = 0

    squidConfig = open(fileName)

    for readSquidConfigLine in squidConfig:

        previousLine = currentLine
        currentLine = readSquidConfigLine

        if currentLine.replace("#", "").strip().startswith(FILEVersionMarker):
            squidVersion.append(
                currentLine.replace("#", "")
                .replace(FILEVersionMarker, "")
                .replace("\r", "")
                .strip()
            )

        if helpTagSectionStart is True:
            helpTagSectionText = helpTagSectionText + currentLine.replace("#", "")

        if currentLine.startswith(FILESectionMarker):
            sectionName = previousLine.replace("# ", "").strip()
            defaultSquidConfigSections.append(sectionName)
            defaultSquidConfigSectionPassed = True
            helpTagSectionStart = False
            sectionNumber += 1

        if defaultSquidConfigSectionPassed is True:
            if currentLine.startswith(FILETagMarker):
                currentTagName = (
                    currentLine.replace(FILETagMarker, "").replace("\t", " ").strip()
                )

                if currentTagName.strip().endswith("off"):
                    switchable = 1
                else:
                    switchable = 0

                helpTagSectionStart = True
                helpTagSectionText = ""

            if (
                currentLine.startswith(FILEDefaultValueDisabledMarker)
                and previousLine.startswith(FILEDefaultValueMarker)
            ) or (
                currentLine.startswith(FILEDefaultValueDisabledMarker + currentTagName)
                and currentTagName != ""
            ):
                defaultValue = currentLine.replace(
                    FILEDefaultValueDisabledMarker, ""
                ).strip()
                if (
                    defaultValue == "none"
                    or defaultValue.strip().startswith(currentTagName) is not True
                ):
                    defaultValue = ""
                enabled = 0
                helpTagSectionStart = False
                appendConfigData(
                    sectionNumber,
                    currentTagName,
                    defaultValue,
                    enabled,
                    helpTagSectionText,
                    switchable,
                )

            elif (
                currentLine.strip() != ""
                and currentLine.strip().startswith(currentTagName)
                and currentTagName != ""
            ):
                enabled = 1
                helpTagSectionStart = False
                defaultValue = currentLine.strip()
                appendConfigData(
                    sectionNumber,
                    currentTagName,
                    defaultValue,
                    enabled,
                    helpTagSectionText,
                    switchable,
                )

    squidConfig.close()
    return defaultSquidConfigStorage, defaultSquidConfigSections, squidVersion


def appendConfigData(
    sectionNameC, currentTagNameC, defaultValue, enabled, helpTagSectionText, switchable
):
    defaultSquidConfigStorage.append(sectionNameC)
    defaultSquidConfigStorage.append(currentTagNameC)
    defaultSquidConfigStorage.append(defaultValue)
    defaultSquidConfigStorage.append(enabled)
    defaultSquidConfigStorage.append(switchable)
    defaultSquidConfigStorage.append(helpTagSectionText)


def saveToJSON(objectjson, fileName):
    jsonConfigFile = open(fileName, "w")

    tempSetArray = []
    tempTagArray = []
    tempValueArray = []
    tempEnabledArray = []
    tempHelpArray = []
    tempSwitchArray = []

    jsonConfigFile.write(JSONConfigFileHeader)

    counter = 0

    for readSquidConfigLine in objectjson:
        if counter == 0:
            tempSetArray.append(readSquidConfigLine)
            counter += 1

        elif counter == 1:
            tempTagArray.append(readSquidConfigLine)
            counter += 1

        elif counter == 2:
            tempValueArray.append(readSquidConfigLine)
            counter += 1

        elif counter == 3:
            tempEnabledArray.append(readSquidConfigLine)
            counter += 1

        elif counter == 4:
            tempSwitchArray.append(readSquidConfigLine)
            counter += 1

        elif counter == 5:
            tempHelpArray.append(readSquidConfigLine)
            counter = 0

    json.dump(tempSetArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileTag)
    json.dump(tempTagArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileValue)
    json.dump(tempValueArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileEnabled)
    json.dump(tempEnabledArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileAllSections)
    json.dump(defaultSquidConfigSections, jsonConfigFile)

    jsonConfigFile.write(JSONConfigSwitchable)
    json.dump(tempSwitchArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileHelp)
    json.dump(tempHelpArray, jsonConfigFile)

    jsonConfigFile.write(JSONConfigVersion)
    json.dump(squidVersion, jsonConfigFile)

    jsonConfigFile.write(JSONConfigFileFooter)
    jsonConfigFile.close()
    return


parseSquidconfig(squidDefaultconfigFile)
saveToJSON(defaultSquidConfigStorage, defaultJSONConfigFile)

if __name__ == "__main__":
    app.debug = debug
# app.run()
