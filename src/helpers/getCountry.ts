import { MAIN_URL } from 'constants/index';
import { DataType } from 'types/dataType';

export const getCountry = async (id: string | string[] | undefined): Promise<DataType[]> =>
    (await fetch(`${ MAIN_URL }/alpha/${ id }`)).json();
