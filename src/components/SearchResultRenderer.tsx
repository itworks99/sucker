import {Header} from 'semantic-ui-react';
import type {DataJSON, SearchResult} from '../types';
import {JSX} from "react";

export function createSearchResultRenderer(dataJSON: DataJSON) {
    return ({title, record}: SearchResult): JSX.Element => {
        return (
            <Header key={record} size="tiny">
                {title}
                <Header.Subheader>
                    {dataJSON.all_sections[dataJSON.section_number[record]].toLowerCase()}
                </Header.Subheader>
            </Header>
        );
    };
}
