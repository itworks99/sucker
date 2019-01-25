def parse_config_file_squid():
    global tag_enabled, section_number, pass_records_to_arrays, main_config_section_started
    import simplejson as json
    import tempfile
    import io

    # SET_OUTPUT = 'obj'
    # # SET_OUTPUT = 'file'

    FILE_DEFAULT_SQUID_CONFIG = "squid.conf"
    # FILE_DEFAULT_JSON_OUTPUT = "config.json"

    TXT_FILE_SECTION = "# --"
    TXT_TAG_LINE = "#  TAG:"
    TXT_DFLT_VALUE = "#Default:"
    TXT_DISABLED_LINE = "#"
    TXT_VERSION = "WELCOME TO SQUID"
    TXT_BUILT_MESSAGE = "# Note: This option is only available"
    TXT_WARNING_MESSAGE = "#	WARNING:"
    TXT_ON_OFF = "on|off"
    TXT_NEW_LINE = "\n"
    TXT_RETURN = "\r"
    TXT_TAB = "\t"

    JSON_CONFIGFILE_SECTIONS = '{"section_number": '
    JSON_CONFIGFILE_TAG = ',"tags": '
    JSON_CONFIGFILE_VALUE = ',"value": '
    JSON_CONFIGFILE_UNITS = ',"units": '
    JSON_CONFIGFILE_ENABLED = ',"is_enabled": '
    JSON_CONFIGFILE_ALLSECTIONS = ',"all_sections": '
    JSON_CONFIGFILE_HELP = ',"help": '
    JSON_CONFIGFILE_VERSION = ',"squid_version": '
    JSON_CONFIGFILE_SWITCHABLE = ',"switchable": '
    JSON_CONFIGFILE_SWITCHPOSITION = ',"switch_position": '
    JSON_CONFIGFILE_BUILTWITH_NOTE = ',"message_built": '
    JSON_CONFIGFILE_WARNING_NOTE = ',"message_warning": '
    JSON_CONFIGFILE_FOOTER = '}'

    ENTRY_INPUT = 0
    ENTRY_DROPDOWN = 1
    ENTRY_MULTILINE = 2

    config_sections_default = []
    squid_version = []
    help_section_text = ""
    help_section_start: bool = False

    def extract_config_version(line_current_local):
        if (
            line_current_local.replace(TXT_DISABLED_LINE, " ")
                .strip().startswith(TXT_VERSION)):
            squid_version.append(
                line_current_local.replace(TXT_DISABLED_LINE, "").replace(
                    TXT_VERSION, "").replace(TXT_RETURN, "").strip()
            )

    def extract_sections(
            line_current_local,
            line_previous_local):

        global section_number, main_config_section_started

        if line_current_local.startswith(TXT_FILE_SECTION):
            sectionName = line_previous_local.replace(
                TXT_DISABLED_LINE, "").strip()
            config_sections_default.append(sectionName)
            main_config_section_started = True
            section_number += 1

    def return_switchable_status():
        if (
            # to avoid situations with the words like 'version'
            value_default.strip().endswith(" off")
            or value_default.strip().endswith(" on")
        ):
            return ENTRY_DROPDOWN
        else:
            return ENTRY_INPUT

    def return_switch_position():
        if value_default.strip().endswith("off"):
            return 0
        elif value_default.strip().endswith("on"):
            return 1

    line_current = ""
    main_config_section_started = False
    tag_current = ""
    value_default = ""
    section_number = -1
    tag_switchable = 0
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

    squid_config_file_handle = open(FILE_DEFAULT_SQUID_CONFIG, 'r')

    extract_config_version(squid_config_file_handle.readline())

    for config_file_line in squid_config_file_handle:

        line_previous = line_current
        line_current = config_file_line

        extract_sections(
            line_current,
            line_previous
        )

        if main_config_section_started is True:

            if not help_section_start:

                if line_current.startswith(TXT_TAG_LINE):

                    tag_current = line_current.strip(
                        TXT_TAG_LINE).replace(TXT_TAB, " ").strip()

                    if tag_current.strip(')').endswith(TXT_ON_OFF):
                        tag_current = tag_current.strip(
                            TXT_ON_OFF).strip('()')

                    if tag_current.strip().endswith(")"):

                        unit_current = tag_current[
                            tag_current.find("(") + 1:
                            tag_current.find(")")
                        ]
                        tag_current = tag_current.replace(
                            unit_current, "").strip(')').strip('(')

                    help_section_start = True

            pass_records_to_arrays = False
            tag_enabled = 0

            if tag_current != "":

                if (
                        line_current.startswith(TXT_DISABLED_LINE)
                        and line_previous.startswith(TXT_DFLT_VALUE)
                ) or (
                        line_current.startswith(
                        (TXT_DISABLED_LINE + tag_current))
                        and line_previous.startswith(TXT_DFLT_VALUE)
                        and tag_current != ""
                ):

                    if value_default.strip().startswith(tag_current) is not True:
                        if (
                            line_current.strip(TXT_DISABLED_LINE)
                            .strip()
                            .startswith(tag_current)
                        ):
                            value_default = (
                                line_current.strip(TXT_DISABLED_LINE)
                                .strip()
                                .strip("\n")
                            )
                        else:
                            value_default = tag_current
                    else:
                        value_default = line_current.strip(
                            TXT_DISABLED_LINE)

                    tag_enabled = 0
                    pass_records_to_arrays = True

                elif (
                        line_current.strip() != ""
                        and line_current.strip().startswith(tag_current)

                ):
                    tag_enabled = 1
                    value_default = line_current
                    pass_records_to_arrays = True

            if help_section_start or line_previous.startswith(TXT_DFLT_VALUE):
                help_section_text = help_section_text + line_current.replace(
                    TXT_DISABLED_LINE, " "
                ).replace(TXT_TAB, " ")

                if line_previous.startswith(TXT_BUILT_MESSAGE):
                    message_built = line_current.strip(
                        TXT_DISABLED_LINE
                    ).strip()

                if line_current.startswith(TXT_WARNING_MESSAGE):
                    message_warning = message_warning + \
                        line_current.replace(
                            TXT_DISABLED_LINE, '').replace(TXT_TAB, '')

                if (
                    line_current.startswith(TXT_DFLT_VALUE)
                    or line_current.strip().startswith(tag_current)
                    or not line_current.startswith(TXT_DISABLED_LINE)
                ):
                    help_section_start = False

        if pass_records_to_arrays is True:
            array_sections.append(section_number)
            array_tags.append(tag_current)
            array_values.append(value_default)
            array_enabled.append(tag_enabled)
            array_switch.append(return_switchable_status())
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
            if line_current_local.startswith(array_tags[line_number]) and line_previous_local.startswith(
                    array_tags[line_number]) and array_tags[line_number] is array_tags[line_number-1]:
                if array_values[line_number - 1] != array_tags[line_number]:
                    array_values[line_number] = array_values[line_number - 1] + \
                        array_values[line_number]
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

    json_config_for_output = ''

    jsonConfig = io.StringIO()
    jsonConfig.write(JSON_CONFIGFILE_SECTIONS)
    json.dump(array_sections, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_TAG)
    json.dump(array_tags, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_VALUE)
    json.dump(array_values, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_UNITS)
    json.dump(array_units, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_ENABLED)
    json.dump(array_enabled, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_ALLSECTIONS)
    json.dump(config_sections_default, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_SWITCHABLE)
    json.dump(array_switch, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_SWITCHPOSITION)
    json.dump(array_switch_position, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_BUILTWITH_NOTE)
    json.dump(array_warning_message, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_WARNING_NOTE)
    json.dump(array_warning_built, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_VERSION)
    json.dump(squid_version, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_HELP)
    json.dump(array_help, jsonConfig)
    jsonConfig.write(JSON_CONFIGFILE_FOOTER)

    json_config_for_output = jsonConfig.getvalue()
    jsonConfig.close()

    return (json_config_for_output)
