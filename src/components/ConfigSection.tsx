import React, {useMemo} from 'react';
import {Accordion, Container, Grid, Icon, Popup, Table} from 'semantic-ui-react';
import type {DataJSON} from '../types';
import {ConfigEntry} from './ConfigEntry';

interface ConfigSectionProps {
  dataJSON: DataJSON;
  sectionIndex: number;
  activeAccordionIndex: number;
  activeRowIndex: number;
  componentRefs: Record<number, React.RefObject<any>>;
  onAccordionClick: (index: number) => void;
  onToggleEntry: (index: number) => void;
  onValueChange: (index: number, value: string) => void;
  onFocusEntry: (index: number) => void;
  onHelpClick: (index: number) => void;
  onMultilineClick: (index: number) => void;
}

const COLORS = {
  purple: 'purple',
} as const;

export function ConfigSection({
  dataJSON,
  sectionIndex,
  activeAccordionIndex,
  activeRowIndex,
  componentRefs,
  onAccordionClick,
  onToggleEntry,
  onValueChange,
  onFocusEntry,
  onHelpClick,
  onMultilineClick,
}: ConfigSectionProps) {
  const {entries, hasEnabledOptions, sectionTags} = useMemo(() => {
    const entries: React.ReactNode[] = [];
    let hasEnabled = false;
    const tags: string[] = [];

    for (let n = 0; n < dataJSON.tags.length; n += 1) {
      if (dataJSON.section_number[n] !== sectionIndex) continue;

      if (dataJSON.is_enabled[n] > 0) {
        hasEnabled = true;
      }

      tags.push(dataJSON.tags[n]);

      if (!componentRefs[n]) {
        componentRefs[n] = React.createRef();
      }

      entries.push(
        <ConfigEntry
          key={`entry-${n}`}
          entryNumber={n}
          tag={dataJSON.tags[n]}
          value={dataJSON.value[n]}
          isEnabled={dataJSON.is_enabled[n] > 0}
          switchable={dataJSON.switchable[n]}
          switchPosition={dataJSON.switch_position[n]}
          unit={dataJSON.units[n]}
          messageBuilt={dataJSON.message_built[n]}
          messageWarning={dataJSON.message_warning[n]}
          isActive={activeRowIndex === n}
          componentRef={componentRefs[n]}
          onToggle={onToggleEntry}
          onValueChange={onValueChange}
          onFocus={onFocusEntry}
          onHelpClick={onHelpClick}
          onMultilineClick={onMultilineClick}
        />
      );
    }

    return {
      entries,
      hasEnabledOptions: hasEnabled,
      sectionTags: tags.join('\n'),
    };
  }, [
    dataJSON,
    sectionIndex,
    activeRowIndex,
    componentRefs,
    onToggleEntry,
    onValueChange,
    onFocusEntry,
    onHelpClick,
    onMultilineClick,
  ]);

  const iconColor = hasEnabledOptions ? COLORS.purple : undefined;

  return (
    <Container key={`section-${sectionIndex}`}>
      <Accordion.Title
        active={activeAccordionIndex === sectionIndex}
        index={sectionIndex}
        onClick={() => onAccordionClick(sectionIndex)}
      >
        <Popup
          trigger={<Icon name="dropdown" />}
          size="tiny"
          position="left center"
          header="Tags in this section:"
          content={
            <Grid centered columns={1}>
              <Grid.Column textAlign="left">
                <pre>{sectionTags}</pre>
              </Grid.Column>
            </Grid>
          }
        />
        <Icon name="tags" color={iconColor} />
        &nbsp;
        {dataJSON.all_sections[sectionIndex]}
      </Accordion.Title>
      <Accordion.Content active={activeAccordionIndex === sectionIndex}>
        <Table striped compact basic="very">
          <Table.Body>{entries}</Table.Body>
        </Table>
      </Accordion.Content>
    </Container>
  );
}
