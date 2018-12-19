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
FILETagMarker = "#  TAG:"
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
JSONConfigSwitchPosition = ',\r"switchposition": '
JSONConfigFileFooter = "\r}"

defaultSquidConfigSections = []
squidVersion = []
helpTagSectionText = ""
helpTagSectionStart: bool = False


def extractValue(currentLine, previousLine, currentTagName, defaultValue):
    passRecordToArray = False
    enabled = 0
    if (
        currentLine.startswith(FILEDefaultValueDisabledMarker)
        and previousLine.startswith(FILEDefaultValueMarker)
    ) or (
        currentLine.startswith((FILEDefaultValueDisabledMarker + currentTagName))
        and currentTagName != ""
    ):
        if (
            defaultValue == "none"
            or defaultValue.strip().startswith(currentTagName) != True
        ):
            defaultValue = currentTagName
        else:
            defaultValue = currentLine.replace(
                FILEDefaultValueDisabledMarker, ""
            ).strip()

        enabled = 0
        passRecordToArray = True

    elif (
        currentLine.strip() != ""
        and currentLine.strip().startswith(currentTagName)
        and currentTagName != ""
    ):
        enabled = 1
        defaultValue = currentLine.strip()
        passRecordToArray = True

    return passRecordToArray, defaultValue, enabled


def extractTagName(currentLine, currentTagName, switchable, helpTagSectionStart):
    if currentLine.startswith(FILETagMarker):

        currentTagName = (
            currentLine.replace(FILETagMarker, "").replace("\t", " ").strip()
        )

        if currentTagName.strip().endswith("off"):
            switchable = 1
            currentTagName = currentTagName.strip()
        else:
            switchable = 0

        helpTagSectionStart = True
    return currentTagName, switchable, helpTagSectionStart


def extractSections(
    currentLine, previousLine, defaultSquidConfigSectionPassed, sectionNumber
):
    if currentLine.startswith(FILESectionMarker):
        sectionName = previousLine.replace(FILEDefaultValueDisabledMarker, "").strip()
        defaultSquidConfigSections.append(sectionName)
        defaultSquidConfigSectionPassed = True
        sectionNumber += 1
    return defaultSquidConfigSectionPassed, sectionNumber


def extractVersion(currentLine):
    if (
        currentLine.replace(FILEDefaultValueDisabledMarker, " ")
        .strip()
        .startswith(FILEVersionMarker)
    ):
        squidVersion.append(
            currentLine.replace(FILEDefaultValueDisabledMarker, "")
            .replace(FILEVersionMarker, "")
            .replace("\r", "")
            .strip()
        )


def returnSwitchPosition():
    switchPosition = ""
    if defaultValue.strip().endswith("off"):
        switchPosition = 0
    elif defaultValue.strip().endswith("on"):
        switchPosition = 1
    return switchPosition


currentLine = ""
defaultSquidConfigSectionPassed = False
currentTagName = ""
previousTagName = ""
defaultValue = ""
sectionNumber = -1
switchable = 0
passRecordToArray = False
tempSetArray = []
tempTagArray = []
tempValueArray = []
tempEnabledArray = []
tempHelpArray = []
tempSwitchArray = []
tempSwitchPosArray = []

squidConfig = open(squidDefaultconfigFile)

extractVersion(squidConfig.readline())

for readSquidConfigLine in squidConfig:

    previousLine = currentLine
    currentLine = readSquidConfigLine
    previousTagName = currentTagName

    defaultSquidConfigSectionPassed, sectionNumber = extractSections(
        currentLine, previousLine, defaultSquidConfigSectionPassed, sectionNumber
    )

    if defaultSquidConfigSectionPassed is True:

        if not helpTagSectionStart:
            currentTagName, switchable, helpTagSectionStart = extractTagName(
                currentLine, currentTagName, switchable, helpTagSectionStart
            )
            enabled: int
            passRecordToArray, defaultValue, enabled = extractValue(
                currentLine, previousLine, currentTagName, defaultValue
            )

        if helpTagSectionStart is True:
            helpTagSectionText = helpTagSectionText + currentLine.replace(
                FILEDefaultValueDisabledMarker, " "
            ).replace("\t", "")
            if currentLine.startswith(FILEDefaultValueMarker):
                helpTagSectionStart = False

    if passRecordToArray is True:
        tempSetArray.append(sectionNumber)
        tempTagArray.append(currentTagName)
        tempValueArray.append(defaultValue)
        tempEnabledArray.append(enabled)
        tempSwitchArray.append(switchable)
        tempSwitchPosArray.append(returnSwitchPosition())
        tempHelpArray.append(helpTagSectionText)

        helpTagSectionText = ""
        passRecordToArray = False

squidConfig.close()

jsonConfigFile = open(defaultJSONConfigFile, "w")

jsonConfigFile.write(JSONConfigFileHeader)

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

jsonConfigFile.write(JSONConfigSwitchPosition)
json.dump(tempSwitchPosArray, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileHelp)
json.dump(tempHelpArray, jsonConfigFile)

jsonConfigFile.write(JSONConfigVersion)
json.dump(squidVersion, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileFooter)
jsonConfigFile.close()

if __name__ == "__main__":
    app.debug = debug
# app.run()
