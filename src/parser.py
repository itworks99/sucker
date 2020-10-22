import simplejson as json
import io
import os

JSON_CONFIGFILE_SECTIONS = '{"section_number": '
JSON_CONFIGFILE_TAG = ',"tags": '
JSON_CONFIGFILE_VALUE = ',"value": '
JSON_CONFIGFILE_SWITCHABLE = ',"switchable": '
JSON_CONFIGFILE_SWITCHPOSITION = ',"switch_position": '
JSON_CONFIGFILE_FOOTER = "}"

ENTRY_INPUT = 0
ENTRY_DROPDOWN = 1
ENTRY_MULTILINE = 2

TXT_NEW_LINE = "\n"
TXT_RETURN = "\r"
TXT_TAB = "\t"

TXT_DISABLED_LINE = "#"

sectn_number = 0
tag_en = 0
pass_records_to_arrays = False
main_cfg_sect_start = False


def list_available_config_files(dir):

    config_file_versions = []

    for file_name in os.listdir(dir):
        if file_name.startswith("squid"):
            line = file_name.strip("squid").strip(".conf")
            if len(line) > 2:
                line = line[:2] + "." + line[2:]
            line = line[:1] + "." + line[1:]
            config_file_versions.append(line)
    return config_file_versions


def parse_config_file_squid(action, config_file_versions, return_config_ver):
    global tag_en, sectn_number, pass_records_to_arrays, main_cfg_sect_start

    FILE_DEFAULT_SQUID_CONFIG = "src/squid" + return_config_ver + ".conf"

    TXT_FILE_SECTION = "# --"
    TXT_TAG_LINE = "#  TAG:"
    TXT_DFLT_VALUE = "#Default:"

    TXT_VERSION = "WELCOME TO SQUID"
    TXT_BUILT_MESSAGE = "# Note: This option is only available"
    TXT_WARNING_MESSAGE = "#	WARNING:"
    TXT_ON_OFF = "on|off"
    TXT_ON_OFF_WARN = "on|off|warn"
    TXT_ON_OFF_T_T_D = "on|off|transparent|truncate|delete"
    TXT_TIME_UNITS = "time-units"

    JSON_CONFIGFILE_UNITS = ',"units": '
    JSON_CONFIGFILE_ENABLED = ',"is_enabled": '
    JSON_CONFIGFILE_ALLSECTIONS = ',"all_sections": '
    JSON_CONFIGFILE_HELP = ',"help": '
    JSON_CONFIGFILE_VERSION = ',"squid_version": '
    JSON_AVAILABLE_SQUID_VERSIONS = ',"available_versions": '

    JSON_CONFIGFILE_BUILTWITH_NOTE = ',"message_built": '
    JSON_CONFIGFILE_WARNING_NOTE = ',"message_warning": '

    config_sections_default = []
    squid_version = []
    help_section_text = ""
    help_section_start = False

    def extract_config_version(line_current_local):
        if (
            line_current_local.replace(TXT_DISABLED_LINE, " ")
            .strip()
            .startswith(TXT_VERSION)
        ):
            squid_version.append(
                line_current_local.replace(TXT_DISABLED_LINE, "")
                .replace(TXT_VERSION, "")
                .replace("STABLE", "")
                .replace(TXT_RETURN, "")
                .strip()
            )

    def extract_sections(line_current_local, line_previous_local):

        global sectn_number, main_cfg_sect_start

        if line_current_local.startswith(TXT_FILE_SECTION):
            section_name = line_previous_local.replace(
                TXT_DISABLED_LINE, "").strip()
            config_sections_default.append(section_name)
            main_cfg_sect_start = True
            sectn_number += 1

    def return_switchable_status(tag_switchable):
        if (
            # to avoid situations with the words like 'version'
            value_default.strip().endswith(" off")
            or value_default.strip().endswith(" on")
        ) and tag_switchable > 0:
            return ENTRY_DROPDOWN
        else:
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
    sectn_number = 0
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

    squid_config_file_handle = open(FILE_DEFAULT_SQUID_CONFIG, "r")

    extract_config_version(squid_config_file_handle.readline())

    for config_file_line in squid_config_file_handle:

        ln_previous = ln_current
        ln_current = config_file_line

        extract_sections(ln_current, ln_previous)

        if not help_section_start:

            # extracting tags
            if ln_current.startswith(TXT_TAG_LINE):

                tag_current = (
                    ln_current.strip(TXT_TAG_LINE).replace(
                        TXT_TAB, " ").strip()
                )

                if tag_current.strip(")").endswith(TXT_ON_OFF):
                    tag_current = tag_current.strip(")").strip(
                        TXT_ON_OFF).strip("(")
                    tag_switchable = 1
                elif tag_current.strip(")").endswith(TXT_ON_OFF_T_T_D):
                    tag_current = (
                        tag_current.strip(")").replace(
                            TXT_ON_OFF_T_T_D, "").strip("(")
                    )
                    tag_switchable = 0
                elif tag_current.strip(")").endswith(TXT_ON_OFF_WARN):
                    tag_current = (
                        tag_current.strip(")").replace(
                            TXT_ON_OFF_WARN, "").strip("(")
                    )
                    tag_switchable = 0
                # extracting units
                if tag_current.strip().endswith(")"):

                    unit_current = tag_current[
                        tag_current.find("(") + 1: tag_current.find(")")
                    ]
                    tag_current = (
                        tag_current.replace(
                            unit_current, "").strip(")").strip("(")
                    )

                if tag_current.strip().endswith(TXT_TIME_UNITS):
                    tag_current = tag_current.strip().strip(TXT_TIME_UNITS)
                    unit_current = TXT_TIME_UNITS.replace("-", " ")

                help_section_start = True

        pass_records_to_arrays = False
        tag_en = 0

        if tag_current != "":

            # extracting values
            if (
                ln_current.startswith(TXT_DISABLED_LINE)
                and ln_previous.startswith(TXT_DFLT_VALUE)
            ) or (
                ln_current.startswith((TXT_DISABLED_LINE + tag_current))
                and ln_previous.startswith(TXT_DFLT_VALUE)
                and tag_current != ""
            ):

                if value_default.strip().startswith(tag_current) is not True:
                    if (
                        ln_current.strip(TXT_DISABLED_LINE)
                        .strip()
                        .startswith(tag_current)
                    ):
                        value_default = (
                            ln_current.strip(
                                TXT_DISABLED_LINE).strip().strip("\n")
                        )
                    else:
                        value_default = tag_current
                else:
                    value_default = ln_current.strip(TXT_DISABLED_LINE)
                # tag value is disabled
                tag_en = 0
                pass_records_to_arrays = True

            elif ln_current.strip() != "" and ln_current.strip().startswith(
                tag_current
            ):
                # tag value is enabled
                tag_en = 1
                value_default = ln_current
                pass_records_to_arrays = True

        # extracting help
        if help_section_start or ln_previous.startswith(TXT_DFLT_VALUE):
            help_section_text = help_section_text + ln_current.replace(
                TXT_DISABLED_LINE, " "
            ).replace(TXT_TAB, " ")

            # extracting message
            if ln_previous.startswith(TXT_BUILT_MESSAGE):
                message_built = ln_current.strip(TXT_DISABLED_LINE).strip()

            # extracting warnings
            if ln_current.strip(
                TXT_DISABLED_LINE
            ).strip() == "" or ln_current.startswith(TXT_DFLT_VALUE):
                warning_message_start = False
            elif (
                ln_current.startswith(TXT_WARNING_MESSAGE)
                or warning_message_start is True
            ):
                message_warning = message_warning + ln_current.replace(
                    TXT_DISABLED_LINE, ""
                ).replace(TXT_TAB, "")
                warning_message_start = True

            if (
                ln_current.startswith(TXT_DFLT_VALUE)
                or ln_current.strip().startswith(tag_current)
                or not ln_current.startswith(TXT_DISABLED_LINE)
            ):
                warning_message_start = False
                help_section_start = False

        if pass_records_to_arrays is True:
            array_sections.append(sectn_number)
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
            help_section_start = False
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
            if (
                line_current_local.startswith(array_tags[line_number])
                and line_previous_local.startswith(array_tags[line_number])
                and array_tags[line_number] is array_tags[line_number - 1]
            ):
                if array_values[line_number - 1] != array_tags[line_number]:
                    array_values[line_number] = (
                        array_values[line_number - 1] +
                        array_values[line_number]
                    )
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
        json_config.write(JSON_CONFIGFILE_SWITCHPOSITION)
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
    else:
        return array_tags


def parse_imported_config_squid(imported_cfg, cfg_file_ver, cfg_ver):

    JSON_CONFIGFILE_ID = '{"id":'

    tag_current = ""

    array_entry_id = []
    array_tags = []
    array_values = []
    array_switch = []
    array_switch_position = []
    items_to_remove = []

    base_cfg_tags = parse_config_file_squid(
        "", cfg_file_ver, cfg_ver)

    for line in imported_cfg:

        line_current = str(line.decode("UTF-8"))

        if line_current.startswith(TXT_DISABLED_LINE) is not True:
            if line_current is not TXT_NEW_LINE:
                array_values.append(line_current.strip(TXT_NEW_LINE))

    array_values = sorted(array_values)

    for line in array_values:

        tag_current = line[0: line.find(" ")]

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
                array_values[line_number] = (
                    array_values[line_number - 1]
                    + TXT_NEW_LINE
                    + array_values[line_number]
                )
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
    pstn = 0
    for line_array in array_tags:
        for line_base_config in base_cfg_tags:
            if array_tags[line_number].strip() == base_cfg_tags[pstn].strip():
                record_id = pstn
            pstn += 1
        array_entry_id.append(record_id)
        record_id = 999
        line_number += 1
        pstn = 0

    json_for_output = ""
    json_config = io.StringIO()

    json_config.write(JSON_CONFIGFILE_ID)
    json.dump(array_entry_id, json_config)
    json_config.write(JSON_CONFIGFILE_TAG)
    json.dump(array_tags, json_config)
    json_config.write(JSON_CONFIGFILE_VALUE)
    json.dump(array_values, json_config)
    json_config.write(JSON_CONFIGFILE_SWITCHABLE)
    json.dump(array_switch, json_config)
    json_config.write(JSON_CONFIGFILE_SWITCHPOSITION)
    json.dump(array_switch_position, json_config)
    json_config.write(JSON_CONFIGFILE_FOOTER)

    json_for_output = json_config.getvalue()
    json_config.close()

    return json_for_output
