import io
import os

import simplejson as json

JSON_CONFIGFILE_SECTIONS = '{"section_number": '
JSON_CONFIGFILE_TAG = ',"tags": '
JSON_CONFIGFILE_VALUE = ',"value": '
JSON_CONFIGFILE_SWITCHABLE = ',"switchable": '
JSON_CONFIGFILE_SWITCH_POSITION = ',"switch_position": '
JSON_CONFIGFILE_FOOTER = "}"
JSON_CONFIGFILE_UNITS = ',"units": '
JSON_CONFIGFILE_ENABLED = ',"is_enabled": '
JSON_CONFIGFILE_ALLSECTIONS = ',"all_sections": '
JSON_CONFIGFILE_HELP = ',"help": '
JSON_CONFIGFILE_VERSION = ',"squid_version": '
JSON_AVAILABLE_SQUID_VERSIONS = ',"available_versions": '

JSON_CONFIGFILE_BUILTWITH_NOTE = ',"message_built": '
JSON_CONFIGFILE_WARNING_NOTE = ',"message_warning": '

ENTRY_INPUT = 0
ENTRY_DROPDOWN = 1
ENTRY_MULTILINE = 2

TXT_NEW_LINE = "\n"
TXT_RETURN = "\r"
TXT_TAB = "\t"

config_section_start = "# --"
config_tag = "#  TAG:"
config_default_value = "#Default:"

config_version_line = "WELCOME TO SQUID"
config_note = "# Note: This option is only available"
config_warning = "#	WARNING:"
config_on_off = "on|off"
config_on_off_warn = "on|off|warn"
config_on_off_tr_tr_d = "on|off|transparent|truncate|delete"
config_time_units = "time-units"

disabled_config_line = "#"

section_number = 0
tag_en = 0
pass_records_to_arrays = False
main_cfg_sect_start = False


def list_available_config_files(directory):
    config_file_versions = []

    for file_name in os.listdir(directory):
        if file_name.startswith("squid"):
            line = file_name.strip("squid").strip(".conf")
            if len(line) > 2:
                line = line[:2] + "." + line[2:]
            line = line[:1] + "." + line[1:]
            config_file_versions.append(line)
    return config_file_versions


def parse_config_file_squid(action, config_file_versions, config_ver):
    global tag_en, section_number, pass_records_to_arrays, main_cfg_sect_start

    default_squid_config_path = "srv/templates/squid" + config_ver + ".conf"

    config_sections_default = []
    squid_version = []
    help_section_text = ""
    help_section_started = False

    def extract_config_version(line_current_local):
        if (line_current_local.replace(
                disabled_config_line,
                " ").strip().startswith(config_version_line)):
            squid_version.append(
                line_current_local.replace(disabled_config_line, "").replace(
                    config_version_line,
                    "").replace("STABLE", "").replace(TXT_RETURN, "").strip())

    def extract_sections(line_current_local, line_previous_local):

        global section_number, main_cfg_sect_start

        if line_current_local.startswith(config_section_start):
            section_name = line_previous_local.replace(disabled_config_line,
                                                       "").strip()
            config_sections_default.append(section_name)
            main_cfg_sect_start = True
            section_number += 1

    def return_switchable_status(switchable_tag):
        if (
                # to avoid situations with the words like 'version'
                value_default.strip().endswith(" off") or
                value_default.strip().endswith(" on")) and switchable_tag > 0:
            return ENTRY_DROPDOWN

        return ENTRY_INPUT

    def return_switch_position():
        if value_default.strip().endswith("off"):
            return 0
        elif value_default.strip().endswith("on"):
            return 1

    ln_current = ""
    main_cfg_sect_start = False
    tag_current = ""
    value_default = ""
    section_number = 0
    tag_switchable = 0
    warning_message_start = False
    message_built = ""
    unit_current = ""
    message_warning = ""
    pass_records_to_arrays = False
    array_sections = []
    array_tags = []
    array_values = []
    array_enabled = []
    array_help = []
    array_switch = []
    array_switch_position = []
    array_warning_message = []
    array_warning_built = []
    array_units = []

    config_sections_default.append("NOT YET SUPPORTED OR LEGACY")

    squid_config_file_handle = open(default_squid_config_path, "r")

    extract_config_version(squid_config_file_handle.readline())

    # Main parsing block

    for config_file_line in squid_config_file_handle:

        ln_previous = ln_current
        ln_current = config_file_line

        extract_sections(ln_current, ln_previous)

        if not help_section_started:

            # extracting tags
            if ln_current.startswith(config_tag):

                tag_current = (ln_current.strip(config_tag).replace(
                    TXT_TAB, " ").strip())

                if tag_current.strip(")").endswith(config_on_off):
                    tag_current = tag_current.strip(")").strip(
                        config_on_off).strip("(")
                    tag_switchable = 1
                elif tag_current.strip(")").endswith(config_on_off_tr_tr_d):
                    tag_current = (tag_current.strip(")").replace(
                        config_on_off_tr_tr_d, "").strip("("))
                    tag_switchable = 0
                elif tag_current.strip(")").endswith(config_on_off_warn):
                    tag_current = (tag_current.strip(")").replace(
                        config_on_off_warn, "").strip("("))
                    tag_switchable = 0
                # extracting units
                if tag_current.strip().endswith(")"):
                    unit_current = tag_current[tag_current.find("(") +
                                               1:tag_current.find(")")]
                    tag_current = (tag_current.replace(
                        unit_current, "").strip(")").strip("("))

                if tag_current.strip().endswith(config_time_units):
                    tag_current = tag_current.strip().strip(config_time_units)
                    unit_current = config_time_units.replace("-", " ")

                help_section_started = True

        pass_records_to_arrays = False
        tag_en = 0

        if tag_current != "":

            # extracting values
            if (ln_current.startswith(disabled_config_line)
                and ln_previous.startswith(config_default_value)) or (
                    ln_current.startswith(
                        (disabled_config_line + tag_current))
                    and ln_previous.startswith(config_default_value)
                    and tag_current != ""):

                if value_default.strip().startswith(tag_current) is not True:
                    if (ln_current.strip(disabled_config_line).strip().
                            startswith(tag_current)):
                        value_default = (ln_current.strip(
                            disabled_config_line).strip().strip("\n"))
                    else:
                        value_default = tag_current
                else:
                    value_default = ln_current.strip(disabled_config_line)
                # tag value is disabled
                tag_en = 0
                pass_records_to_arrays = True

            elif ln_current.strip() != "" and ln_current.strip().startswith(
                    tag_current):
                # tag value is enabled
                tag_en = 1
                value_default = ln_current
                pass_records_to_arrays = True

        # extracting help
        if help_section_started or ln_previous.startswith(
                config_default_value):
            help_section_text = help_section_text + ln_current.replace(
                disabled_config_line, " ").replace(TXT_TAB, " ")

            # extracting message
            if ln_previous.startswith(config_note):
                message_built = ln_current.strip(disabled_config_line).strip()

            # extracting warnings
            if ln_current.strip(disabled_config_line).strip(
            ) == "" or ln_current.startswith(config_default_value):
                warning_message_start = False
            elif (ln_current.startswith(config_warning)
                  or warning_message_start is True):
                message_warning = message_warning + ln_current.replace(
                    disabled_config_line, "").replace(TXT_TAB, "")
                warning_message_start = True

            if (ln_current.startswith(config_default_value)
                    or ln_current.strip().startswith(tag_current)
                    or not ln_current.startswith(disabled_config_line)):
                warning_message_start = False
                help_section_started = False

        if pass_records_to_arrays is True:
            array_sections.append(section_number)
            array_tags.append(tag_current)
            array_values.append(value_default)
            array_enabled.append(tag_en)
            array_switch.append(return_switchable_status(tag_switchable))
            array_switch_position.append(return_switch_position())
            array_help.append(help_section_text)
            array_warning_message.append(message_built)
            array_units.append(unit_current)
            array_warning_built.append(message_warning)

            help_section_text = ""
            message_built = ""
            pass_records_to_arrays = False
            help_section_started = False
            unit_current = ""
            value_default = ""
            message_warning = ""

    squid_config_file_handle.close()

    def consolidate_multiline_entries():
        line_number = 0
        line_current_local = ""
        for line in array_values:
            line_previous_local = line_current_local
            line_current_local = line
            if (line_current_local.startswith(array_tags[line_number])
                    and line_previous_local.startswith(array_tags[line_number])
                    and
                    array_tags[line_number] is array_tags[line_number - 1]):
                if array_values[line_number - 1] != array_tags[line_number]:
                    array_values[line_number] = (
                            array_values[line_number - 1] +
                            array_values[line_number])
                    array_switch[line_number] = ENTRY_MULTILINE
                    array_values[line_number - 1] = ""
                elif array_values[line_number - 1] == array_tags[line_number]:
                    array_values[line_number - 1] = ""
                # to retain help for multiline entry
                array_help[line_number] = array_help[line_number - 1]
            line_number += 1

    consolidate_multiline_entries()

    def cleanup_after_consolidation():
        line_number = 0
        items_to_remove = []
        for line in array_values:
            if not line or line is TXT_NEW_LINE:
                items_to_remove.append(line_number)
            line_number += 1
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

    cleanup_after_consolidation()

    print("Returning data.")

    if action == "config":
        json_config_for_output = ""

        json_config = io.StringIO()
        json_config.write(JSON_CONFIGFILE_SECTIONS)
        json.dump(array_sections, json_config)
        json_config.write(JSON_CONFIGFILE_TAG)
        json.dump(array_tags, json_config)
        json_config.write(JSON_CONFIGFILE_VALUE)
        json.dump(array_values, json_config)
        json_config.write(JSON_CONFIGFILE_UNITS)
        json.dump(array_units, json_config)
        json_config.write(JSON_CONFIGFILE_ENABLED)
        json.dump(array_enabled, json_config)
        json_config.write(JSON_CONFIGFILE_ALLSECTIONS)
        json.dump(config_sections_default, json_config)
        json_config.write(JSON_CONFIGFILE_SWITCHABLE)
        json.dump(array_switch, json_config)
        json_config.write(JSON_CONFIGFILE_SWITCH_POSITION)
        json.dump(array_switch_position, json_config)
        json_config.write(JSON_CONFIGFILE_BUILTWITH_NOTE)
        json.dump(array_warning_message, json_config)
        json_config.write(JSON_CONFIGFILE_WARNING_NOTE)
        json.dump(array_warning_built, json_config)
        json_config.write(JSON_CONFIGFILE_VERSION)
        json.dump(squid_version, json_config)
        json_config.write(JSON_CONFIGFILE_HELP)
        json.dump(array_help, json_config)
        json_config.write(JSON_AVAILABLE_SQUID_VERSIONS)
        json.dump(config_file_versions, json_config)
        json_config.write(JSON_CONFIGFILE_FOOTER)

        json_config_for_output = json_config.getvalue()
        json_config.close()

        return json_config_for_output

    return array_tags


def parse_imported_config_squid(imported_cfg, cfg_file_ver, cfg_ver):
    json_configfile_id = '{"id":'

    tag_current = ""

    array_entry_id = []
    array_tags = []
    array_values = []
    array_switch = []
    array_switch_position = []
    items_to_remove = []

    base_cfg_tags = parse_config_file_squid("", cfg_file_ver, cfg_ver)

    for line in imported_cfg:

        line_current = str(line.decode("UTF-8"))

        if line_current.startswith(disabled_config_line) is not True:
            if line_current is not TXT_NEW_LINE:
                array_values.append(line_current.strip(TXT_NEW_LINE))

    array_values = sorted(array_values)

    for line in array_values:

        tag_current = line[0:line.find(" ")]

        array_tags.append(tag_current)

        if line.endswith(" on"):
            array_switch.append(ENTRY_DROPDOWN)
            array_switch_position.append(1)
        elif line.endswith(" off"):
            array_switch.append(ENTRY_DROPDOWN)
            array_switch_position.append(0)
        else:
            array_switch.append(ENTRY_INPUT)
            array_switch_position.append(0)

    line_number = 0
    for line in array_tags:
        if line_number > 0:
            if array_tags[line_number] == array_tags[line_number - 1]:
                array_values[line_number] = (array_values[line_number - 1] +
                                             TXT_NEW_LINE +
                                             array_values[line_number])
                array_switch[line_number] = ENTRY_MULTILINE
                items_to_remove.append(line_number - 1)
        line_number += 1

    items_to_remove.reverse()

    for item in items_to_remove:
        array_tags.pop(item)
        array_values.pop(item)
        array_switch.pop(item)
        array_switch_position.pop(item)

    line_number = 0
    record_id = 999
    position = 0

    for line_array in array_tags:
        for line_base_config in base_cfg_tags:
            if array_tags[line_number].strip(
            ) == base_cfg_tags[position].strip():
                record_id = position
            position += 1
        array_entry_id.append(record_id)
        record_id = 999
        line_number += 1
        position = 0

    json_for_output = ""
    json_config = io.StringIO()

    json_config.write(json_configfile_id)
    json.dump(array_entry_id, json_config)
    json_config.write(JSON_CONFIGFILE_TAG)
    json.dump(array_tags, json_config)
    json_config.write(JSON_CONFIGFILE_VALUE)
    json.dump(array_values, json_config)
    json_config.write(JSON_CONFIGFILE_SWITCHABLE)
    json.dump(array_switch, json_config)
    json_config.write(JSON_CONFIGFILE_SWITCH_POSITION)
    json.dump(array_switch_position, json_config)
    json_config.write(JSON_CONFIGFILE_FOOTER)

    json_for_output = json_config.getvalue()
    json_config.close()

    return json_for_output
