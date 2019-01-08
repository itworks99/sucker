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
tagLineMarker = "#  TAG:"
defaultValueMarker = "#Default:"
disabledLineMarker = "#"
FILEVersionMarker = "WELCOME TO SQUID"
FILEBuiltMessage = "# Note: This option is only available"
FILEWarningMessage = "WARNING:"
dropdownTagMarker = "on|off"
dropdownTagMarkerBrackets = "(on|off)"

JSONsectionDelimeter = ",\r"
JSONConfigFileHeader = '{\r"sections": '
JSONConfigFileTag = ',\r"entry": '
JSONConfigFileValue = ',\r"value": '
JSONConfigFileUnits = ',\r"units": '
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
        currentLine.replace(disabledLineMarker, " ")
            .strip().startswith(FILEVersionMarker)):
        squidVersion.append(
            currentLine.replace(disabledLineMarker, "").replace(
                FILEVersionMarker, "").replace("\r", "").strip()
        )


def extractSections(
        currentLine,
        previousLine,
        defaultSquidConfigSectionPassed,
        sectionNumber):
    if currentLine.startswith(FILESectionMarker):
        sectionName = previousLine.replace(
            disabledLineMarker, "").strip()
        defaultSquidConfigSections.append(sectionName)
        defaultSquidConfigSectionPassed = True
        sectionNumber += 1
    return defaultSquidConfigSectionPassed, sectionNumber


def extractTagName(currentLine,
                   currentTagName,
                   switchable,
                   helpTagSectionStart,
                   currentUnit):
    if currentLine.startswith(tagLineMarker):

        currentTagName = currentLine.strip(
            tagLineMarker).replace("\t", " ").strip()

        if currentTagName.endswith(dropdownTagMarker):
            currentTagName = currentTagName.strip(dropdownTagMarker)
        if currentTagName.endswith(dropdownTagMarkerBrackets):
            currentTagName = currentTagName.strip(dropdownTagMarkerBrackets)

        if currentTagName.strip().endswith(")"):

            currentUnit = currentTagName[
                currentTagName.find("(") + 1: currentTagName.find(")")
            ]
            currentTagName = currentTagName.replace(
                currentUnit, "").strip(')').strip('(')

        helpTagSectionStart = True
    return currentTagName, switchable, helpTagSectionStart, currentUnit


def extractValue(currentLine,
                 previousLine,
                 currentTagName,
                 defaultValue):
    passRecordToArray = False
    tagIsEnabled = 0

    if (currentTagName != ""):

        if (
            currentLine.startswith(disabledLineMarker)
            and previousLine.startswith(defaultValueMarker)
        ) or (
            currentLine.startswith(
                (disabledLineMarker + currentTagName))
            and currentTagName != ""
        ):

            if (defaultValue.strip().startswith(currentTagName) is not True):
                if (
                    currentLine.strip(disabledLineMarker)
                    .strip()
                    .startswith(currentTagName)
                ):
                    defaultValue = (
                        currentLine.strip(disabledLineMarker)
                        .strip()
                        .strip("\n")
                    )
                else:
                    defaultValue = currentTagName
            else:
                defaultValue = currentLine.strip(disabledLineMarker)

            tagIsEnabled = 0
            passRecordToArray = True

        elif (
            currentLine.strip() != ""
            and currentLine.strip().startswith(currentTagName)

        ):
            tagIsEnabled = 1
            defaultValue = currentLine
            passRecordToArray = True

    return passRecordToArray, defaultValue, tagIsEnabled


def returnSwitchableStatus():
    if (
        defaultValue.strip().endswith(" off")
        # to avoid situations with the words like 'version'
        or defaultValue.strip().endswith(" on")
    ):
        switchable = 1
    else:
        switchable = 0

    return switchable


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
currentUnit = ""
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
tempUnitArray = []

squidConfig = open(squidDefaultconfigFile)

extractVersion(squidConfig.readline())

for readSquidConfigLine in squidConfig:

    previousLine = currentLine
    currentLine = readSquidConfigLine
    previousTagName = currentTagName

    defaultSquidConfigSectionPassed, sectionNumber = extractSections(
        currentLine,
        previousLine,
        defaultSquidConfigSectionPassed,
        sectionNumber
    )

    if defaultSquidConfigSectionPassed is True:

        if not helpTagSectionStart:
            currentTagName, switchable, helpTagSectionStart, currentUnit = extractTagName(
                currentLine,
                currentTagName,
                switchable,
                helpTagSectionStart,
                currentUnit
            )
            tagIsEnabled: int
            passRecordToArray, defaultValue, tagIsEnabled = extractValue(
                currentLine,
                previousLine,
                currentTagName,
                defaultValue
            )

        if helpTagSectionStart or previousLine.startswith(defaultValueMarker):
            helpTagSectionText = helpTagSectionText + currentLine.replace(
                disabledLineMarker, " "
            ).replace("\t", " ")

            if previousLine.startswith(FILEBuiltMessage):
                warningMessage = currentLine.strip(
                    disabledLineMarker
                ).strip()

            if (
                currentLine.startswith(defaultValueMarker)
                or currentLine.strip().startswith(currentTagName)
                or not currentLine.startswith(disabledLineMarker)
            ):
                helpTagSectionStart = False

    if passRecordToArray is True:
        tempSetArray.append(sectionNumber)
        tempTagArray.append(currentTagName)
        tempValueArray.append(defaultValue)
        tempEnabledArray.append(tagIsEnabled)
        tempSwitchArray.append(returnSwitchableStatus())
        tempSwitchPosArray.append(returnSwitchPosition())
        tempHelpArray.append(helpTagSectionText)
        tempWarningMessageArray.append(warningMessage)
        tempUnitArray.append(currentUnit)

        helpTagSectionText = ""
        warningMessage = ""
        passRecordToArray = False
        helpTagSectionStart = False
        currentUnit = ""
        defaultValue = ""

squidConfig.close()

i = 0
previousLine = ""
multiLineEntry = ""
for readTagEntry in tempTagArray:
    previousLine = currentLine.strip()
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
tempUnitArray2 = []
i = 0
for readTagEntry in tempTagArray:
    currentLine = readTagEntry
    if currentLine != "":
        tempSetArray2.append(tempSetArray[i])
        tempTagArray2.append(currentLine)
        tempValueArray2.append(tempValueArray[i])
        tempUnitArray2.append(tempUnitArray[i])
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

jsonConfigFile.write(JSONConfigFileUnits)
json.dump(tempUnitArray2, jsonConfigFile)

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
