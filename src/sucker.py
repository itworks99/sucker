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
FILEBuiltMessage = "# Note: This option is only available"

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
JSONrebuiltConditionNote = ',\r"onlyavailableifrebuiltwith": '
JSONConfigFileFooter = "\r}"

defaultSquidConfigSections = []
squidVersion = []
helpTagSectionText = ""
helpTagSectionStart: bool = False


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


def extractSections(
    currentLine, previousLine, defaultSquidConfigSectionPassed, sectionNumber
):
    if currentLine.startswith(FILESectionMarker):
        sectionName = previousLine.replace(FILEDefaultValueDisabledMarker, "").strip()
        defaultSquidConfigSections.append(sectionName)
        defaultSquidConfigSectionPassed = True
        sectionNumber += 1
    return defaultSquidConfigSectionPassed, sectionNumber


def extractTagName(currentLine, currentTagName, switchable, helpTagSectionStart):
    if currentLine.startswith(FILETagMarker):

        currentTagName = currentLine.strip(FILETagMarker).replace("\t", " ").strip()

        if currentTagName.strip().endswith("off"):
            switchable = 1
            currentTagName = currentTagName.strip()
        else:
            switchable = 0

        helpTagSectionStart = True
    return currentTagName, switchable, helpTagSectionStart


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
            or defaultValue.strip().startswith(currentTagName) is not True
        ):
            defaultValue = currentTagName
        else:
            defaultValue = currentLine.replace(FILEDefaultValueDisabledMarker, "")

        enabled = 0
        passRecordToArray = True

    elif (
        currentLine.strip() != ""
        and currentLine.strip().startswith(currentTagName)
        and currentTagName != ""
    ):
        enabled = 1
        defaultValue = currentLine
        passRecordToArray = True

    return passRecordToArray, defaultValue, enabled


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
warningMessage = ""
passRecordToArray = False
tempSetArray = []
tempTagArray = []
tempValueArray = []
tempEnabledArray = []
tempHelpArray = []
tempSwitchArray = []
tempSwitchPosArray = []
tempMultilineArray = []
tempWarningMessageArray = []

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

        if helpTagSectionStart or previousLine.startswith(FILEDefaultValueMarker):
            helpTagSectionText = helpTagSectionText + currentLine.replace(
                FILEDefaultValueDisabledMarker, " "
            ).replace("\t", "")

            if previousLine.startswith(FILEBuiltMessage):
                warningMessage = currentLine.strip(
                    FILEDefaultValueDisabledMarker
                ).strip()

            if (
                currentLine.startswith(FILEDefaultValueMarker)
                or currentLine.strip().startswith(currentTagName)
                or not currentLine.startswith(FILEDefaultValueDisabledMarker)
            ):
                helpTagSectionStart = False

    if passRecordToArray is True:
        tempSetArray.append(sectionNumber)
        tempTagArray.append(currentTagName)
        tempValueArray.append(defaultValue)
        tempEnabledArray.append(enabled)
        tempSwitchArray.append(switchable)
        tempSwitchPosArray.append(returnSwitchPosition())
        tempHelpArray.append(helpTagSectionText)
        tempWarningMessageArray.append(warningMessage)

        helpTagSectionText = ""
        warningMessage = ""
        passRecordToArray = False
        helpTagSectionStart = False

squidConfig.close()

i = 0
previousLine = ""
multiLineEntry = ""
for readTagEntry in tempTagArray:
    previousLine = currentLine
    currentLine = readTagEntry
    if currentLine == previousLine and tempValueArray[i - 1] != currentLine:
        tempValueArray[i] += tempValueArray[i - 1]
        tempTagArray[i - 1] = ""
        tempValueArray[i - 1] = ""
        tempEnabledArray[i - 1] = ""
        tempSwitchArray[i - 1] = ""
        tempSwitchPosArray[i - 1] = ""
        if tempTagArray[i] not in tempMultilineArray and tempTagArray[i] != "":
            tempSwitchArray[i - 1] = 0
            tempSwitchArray[i] = 2
    if tempValueArray[i - 1] == currentLine:
        tempTagArray[i - 1] = ""
        tempValueArray[i - 1] = ""
    i += 1

tempSetArray2 = []
tempTagArray2 = []
tempValueArray2 = []
tempEnabledArray2 = []
tempSwitchArray2 = []
tempSwitchPosArray2 = []
tempWarningMessageArray2 = []
i = 0
for readTagEntry in tempTagArray:
    currentLine = readTagEntry
    if currentLine != "":
        tempSetArray2.append(tempSetArray[i])
        tempTagArray2.append(currentLine)
        tempValueArray2.append(tempValueArray[i])
        tempEnabledArray2.append(tempEnabledArray[i])
        tempSwitchArray2.append(tempSwitchArray[i])
        tempSwitchPosArray2.append(tempSwitchPosArray[i])
        tempWarningMessageArray2.append(tempWarningMessageArray[i])
    i += 1

tempHelpArray2 = []
for readHelpEntry in tempHelpArray:
    currentLine = readHelpEntry
    if currentLine != "":
        tempHelpArray2.append(currentLine)

jsonConfigFile = open(defaultJSONConfigFile, "w")

jsonConfigFile.write(JSONConfigFileHeader)

json.dump(tempSetArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileTag)
json.dump(tempTagArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileValue)
json.dump(tempValueArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileEnabled)
json.dump(tempEnabledArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileAllSections)
json.dump(defaultSquidConfigSections, jsonConfigFile)

jsonConfigFile.write(JSONConfigSwitchable)
json.dump(tempSwitchArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigSwitchPosition)
json.dump(tempSwitchPosArray2, jsonConfigFile)

jsonConfigFile.write(JSONrebuiltConditionNote)
json.dump(tempWarningMessageArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigVersion)
json.dump(squidVersion, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileHelp)
json.dump(tempHelpArray2, jsonConfigFile)

jsonConfigFile.write(JSONConfigFileFooter)
jsonConfigFile.close()

if __name__ == "__main__":
    app.debug = debug
# app.run()
