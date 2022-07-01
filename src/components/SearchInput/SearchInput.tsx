import { ChangeEvent, FC, ReactElement } from 'react';
import SearchRounded from '@mui/icons-material/SearchRounded'

import styles from './SearchInput.module.css'

interface PropsType {
    children?: never;
    placeholder?: string;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: FC<PropsType> = ({onInputChange, ...rest }): ReactElement => {
    return (
        <>
            <div className={ styles.wrapper }>
                <SearchRounded color="inherit" />
                <input className={ styles.input } onChange={(event)=>onInputChange(event)} { ...rest } />
            </div>
        </>
    );
}

export default SearchInput;
