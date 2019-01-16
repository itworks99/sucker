import simplejson as json
from flask import Flask, render_template

app = Flask(__name__)
debug = True


@app.route("/")
def index():
    return render_template("index.html")


FILE_DEFAULT_SQUID_CONFIG = "squid.conf"
FILE_DEFAULT_JSON_OUTPUT = "config.json"

MARKER_FILE_SECTION = "# --"
MARKER_TAG_LINE = "#  TAG:"
MARKER_DEFAULT_VALUE = "#Default:"
MARKER_DISABLED_LINE = "#"
MARKER_VERSION = "WELCOME TO SQUID"
MARKER_BUILT_MESSAGE = "# Note: This option is only available"
MARKER_WARNING_MESSAGE = "#	WARNING:"
MARKER_ON_OFF_DROPDOWN = "on|off"
MARKER_ON_OFF_DROPDOWN_MARKER = "(on|off)"
MARKER_NEW_LINE = "\n"
MARKER_RETURN = "\r"
MARKER_TAB = "\t"

JSON_CONFIGFILE_SECTION_DELIMETER = ",\r"
JSON_CONFIGFILE_SECTIONS = '{\r"sections": '
JSON_CONFIGFILE_TAG = ',\r"entry": '
JSON_CONFIGFILE_VALUE = ',\r"value": '
JSON_CONFIGFILE_UNITS = ',\r"units": '
JSON_CONFIGFILE_ENABLED = ',\r"isenabled": '
JSON_CONFIGFILE_ALLSECTIONS = ',\r"allsections": '
JSON_CONFIGFILE_HELP = ',\r"help": '
JSON_CONFIGFILE_VERSION = ',\r"version": '
JSON_CONFIGFILE_SWITCHABLE = ',\r"switchable": '
JSON_CONFIGFILE_SWITCHPOSITION = ',\r"switchposition": '
JSON_CONFIGFILE_BUILTWITH_NOTE = ',\r"onlyavailableifrebuiltwith": '
JSON_CONFIGFILE_WARNING_NOTE = ',\r"warning": '
JSON_CONFIGFILE_FOOTER = "\r}"

default_config_sections = []
squid_version = []
help_section_contents = ""
help_section_begin = False
line_current = ""
marker_configfile_main_section_started = False
current_tag_name = ""
previous_tag_name = ""
default_tag_value = ""
section_number = -1
current_tag_is_switchable = 0
warningMessage = ""
current_unit = ""
warningwarning = ""
readwarningmessage = False
pass_records_to_arrays = False
switch_position = 0
array_sections = []
array_tags = []
array_values = []
array_enabled = []
array_help = []
array_switch = []
array_switch_position = []
array_multiline_entry = []
array_warning_built = []
array_warning_message = []
array_units = []
tag_enabled = 0


def extract_version(line_current):
    if (
        line_current.replace(MARKER_DISABLED_LINE, " ")
        .strip()
        .startswith(MARKER_VERSION)
    ):
        squid_version.append(
            line_current.replace(MARKER_DISABLED_LINE, "")
            .replace(MARKER_VERSION, "")
            .replace(MARKER_RETURN, "")
            .strip()
        )


def extract_sections(
    line_current, line_previous, marker_configfile_main_section, section_number
):
    if line_current.startswith(MARKER_FILE_SECTION):
        section_name = line_previous.replace(MARKER_DISABLED_LINE, "").strip()
        default_config_sections.append(section_name)
        marker_configfile_main_section = True
        section_number += 1
    return marker_configfile_main_section, section_number


def extract_tags(
    line_current,
    current_tag_name,
    current_tag_is_switchable,
    help_section_begin,
    current_unit,
):
    if line_current.startswith(MARKER_TAG_LINE):

        current_tag_name = (
            line_current.strip(MARKER_TAG_LINE).replace(
                MARKER_TAB, " ").strip()
        )

        if current_tag_name.endswith(MARKER_ON_OFF_DROPDOWN):
            current_tag_name = current_tag_name.strip(MARKER_ON_OFF_DROPDOWN)
        if current_tag_name.endswith(MARKER_ON_OFF_DROPDOWN_MARKER):
            current_tag_name = current_tag_name.strip(
                MARKER_ON_OFF_DROPDOWN_MARKER)

        if current_tag_name.strip().endswith(")"):

            current_unit = current_tag_name[
                current_tag_name.find("(") + 1: current_tag_name.find(")")
            ]
            current_tag_name = (
                current_tag_name.replace(
                    current_unit, "").strip(")").strip("(")
            )

        help_section_begin = True
    return current_tag_name, current_tag_is_switchable, help_section_begin, current_unit


def check_if_tag_is_switchable(switch_position, current_tag_is_switchable):
    if line_current.strip().endswith(" off"):
        switch_position = 0
        current_tag_is_switchable = 1
        # space is added to avoid situations with the words like 'version'
    elif line_current.strip().endswith(" on"):
        switch_position = 1
        current_tag_is_switchable = 1
    return (switch_position, current_tag_is_switchable)


squidConfig = open(FILE_DEFAULT_SQUID_CONFIG)

extract_version(squidConfig.readline())

for readSquidConfigLine in squidConfig:

    line_previous = line_current
    line_current = readSquidConfigLine

    previous_tag_name = current_tag_name

    marker_configfile_main_section_started, section_number = extract_sections(
        line_current,
        line_previous,
        marker_configfile_main_section_started,
        section_number,
    )

    if marker_configfile_main_section_started is True:

        if not help_section_begin:
            current_tag_name, current_tag_is_switchable, help_section_begin, current_unit = extract_tags(
                line_current,
                current_tag_name,
                current_tag_is_switchable,
                help_section_begin,
                current_unit,
            )
            if line_current.startswith(MARKER_TAG_LINE) is not True:
                pass_records_to_arrays = False

                if line_previous.startswith(
                    MARKER_DEFAULT_VALUE
                ) and line_current.startswith(MARKER_DISABLED_LINE):
                    tag_enabled = 0
                    pass_records_to_arrays = True
                    current_tag_is_switchable = 0
                    default_tag_value = line_current.strip(
                        MARKER_DISABLED_LINE)
                    if default_tag_value.startswith(current_tag_name) is not True:
                        default_tag_value = current_tag_name
                        switch_position, current_tag_is_switchable = check_if_tag_is_switchable(
                            switch_position, current_tag_is_switchable
                        )

                elif line_current.startswith(current_tag_name):
                    tag_enabled = 1
                    pass_records_to_arrays = True
                    current_tag_is_switchable = 0
                    default_tag_value = line_current
                    switch_position, current_tag_is_switchable = check_if_tag_is_switchable(
                        switch_position, current_tag_is_switchable
                    )

        if help_section_begin or line_previous.startswith(MARKER_DEFAULT_VALUE):
            help_section_contents = help_section_contents + line_current.replace(
                MARKER_DISABLED_LINE, " "
            ).replace(MARKER_TAB, " ")

            if line_previous.startswith(MARKER_BUILT_MESSAGE):
                warningMessage = line_current.strip(
                    MARKER_DISABLED_LINE).strip()

            if line_current.startswith(MARKER_WARNING_MESSAGE):
                readwarningmessage = True

            if readwarningmessage is True:
                if line_current.strip(
                    MARKER_DISABLED_LINE
                ).strip() == "" or line_current.strip(
                    MARKER_DISABLED_LINE
                ).strip().startswith(MARKER_DEFAULT_VALUE):
                    readwarningmessage = False
                else:
                    warningwarning = warningwarning + \
                        line_current.replace(
                            MARKER_DISABLED_LINE, "").replace(MARKER_TAB, "")
            if (
                line_current.startswith(MARKER_DEFAULT_VALUE)
                or line_current.strip().startswith(current_tag_name)
                or not line_current.startswith(MARKER_DISABLED_LINE)
            ):
                help_section_begin = False

    if pass_records_to_arrays is True and current_tag_name != "":

        array_sections.append(section_number)
        array_tags.append(current_tag_name)
        array_values.append(default_tag_value)
        array_enabled.append(tag_enabled)
        array_switch.append(current_tag_is_switchable)
        array_switch_position.append(switch_position)
        array_help.append(help_section_contents)
        array_warning_built.append(warningMessage)
        array_units.append(current_unit)
        array_warning_message.append(warningwarning)

        help_section_contents = ""
        warningMessage = ""
        pass_records_to_arrays = False
        help_section_begin = False
        current_unit = ""
        # default_tag_value = ""
        warningwarning = ""

squidConfig.close()

position = 0
line_previous = ""
line_current = ""
for line in array_values:
    line_previous = line_current
    line_current = line
    if line_current.startswith(array_tags[position]) and line_previous.startswith(
        array_tags[position]
    ):
        array_values[position] = array_values[position - 1] + \
            array_values[position]
        array_switch[position] = 2
        array_values[position - 1] = ""
    position += 1
position = 0
items_to_remove = []
for line in array_values:
    if not line:
        items_to_remove.append(position)
    position += 1
items_to_remove.reverse()
for item in items_to_remove:
    array_sections.pop(item)
    array_tags.pop(item)
    array_values.pop(item)
    array_enabled.pop(item)
    array_switch.pop(item)
    array_switch_position.pop(item)
    array_help.pop(item)
    array_warning_built.pop(item)
    array_units.pop(item)
    array_warning_message.pop(item)


jsonConfigFile = open(FILE_DEFAULT_JSON_OUTPUT, "w")

jsonConfigFile.write(JSON_CONFIGFILE_SECTIONS)

json.dump(array_sections, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_TAG)
json.dump(array_tags, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_VALUE)
json.dump(array_values, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_UNITS)
json.dump(array_units, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_ENABLED)
json.dump(array_enabled, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_ALLSECTIONS)
json.dump(default_config_sections, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_SWITCHABLE)
json.dump(array_switch, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_SWITCHPOSITION)
json.dump(array_switch_position, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_BUILTWITH_NOTE)
json.dump(array_warning_built, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_WARNING_NOTE)
json.dump(array_warning_message, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_VERSION)
json.dump(squid_version, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_HELP)
json.dump(array_help, jsonConfigFile)

jsonConfigFile.write(JSON_CONFIGFILE_FOOTER)
jsonConfigFile.close()

if __name__ == "__main__":
    app.debug = debug
# app.run()
