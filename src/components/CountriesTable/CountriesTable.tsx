import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@mui/icons-material';
import { FC, Fragment, ReactElement, useState } from 'react';
import { DataType } from 'types/dataType';

import Link from 'next/link';
import styles from './CountriesTable.module.css';

type OrderByType = {
    countries: DataType[];
    value: keyof DataType | null;
    direction?: string | null;
}

const orderBy = ({ countries, value, direction }: OrderByType): DataType[] => {
    // FIXME
    if (direction === 'asc' && value && countries) {
        return [...countries].sort((a, b) =>
            Number(a[value]) > Number(b[value]) ? 1 : -1);
    }
    if (direction === 'desc' && value && countries) {
        return [...countries].sort((a, b) =>
            Number(a[value]) > Number(b[value]) ? -1 : 1);
    }

    return countries
}


enum Direction {
    Asc = 'asc',
    Desc = 'desc',
}
enum Value {
    Population = 'population',
    Name = 'name',
    Area = 'area',
    Gini = 'gini',
}
interface SortArrowPropsType {
    direction?: string | null
}

const SortArrow: FC<SortArrowPropsType> = ({ direction = null }): ReactElement | null => {
    if (!direction) {
        return <></>
    }

    if (direction === Direction.Desc) {
        return <span className={ styles.heading__arrow }><KeyboardArrowDownRounded color="inherit" /></span>
    } else {
        return <span className={ styles.heading__arrow }><KeyboardArrowUpRounded color="inherit" /></span>
    }
}

interface PropsType {
    children?: never;
    countries?: DataType[]
}

const CountriesTable: FC<PropsType> = ({ countries = [] }): ReactElement => {
    const [direction, setDirection] = useState<string | null>(null)
    const [value, setValue] = useState<keyof DataType | null>(null)

    const orderedCountries = orderBy({ countries, value, direction })

    const switchDirection = (): void => {
        if (!direction) {
            setDirection(Direction.Desc)
        } else if (direction === Direction.Desc) {
            setDirection(Direction.Asc)
        } else if (direction === Direction.Asc) {
            setDirection(null)
        }
    }

    const setValueDirection = (valueData: keyof DataType): void => {
        switchDirection()
        setValue(valueData)
    }

    return (
        <>
            <div>
                <div className={ styles.heading }>
                    <div className={styles.heading__flag}></div>
                    <button className={ styles.heading__name } onClick={ () => setValueDirection(Value.Name) }>
                        <span>Name</span>
                        { value === Value.Name && <SortArrow direction={ direction } /> }
                    </button>
                    <button className={ styles.heading__population } onClick={ () => setValueDirection(Value.Population) }>
                        <span>Population</span>
                        { value === Value.Population && <SortArrow direction={ direction } /> }
                    </button>
                    <button className={ styles.heading__area } onClick={ () => setValueDirection(Value.Area) }>
                        <span>Area (km<sup style={ { fontSize: "0.5rem" } }>2</sup> )</span>
                        { value === Value.Area && <SortArrow direction={ direction } /> }
                    </button>
                    <button className={ styles.heading__gini } onClick={ () => setValueDirection(Value.Gini) }>
                        <span>Gini</span>
                        { value === Value.Gini && <SortArrow direction={ direction } /> }
                    </button>
                </div>

                { orderedCountries?.map((country): ReactElement => {

                    return (
                        <Fragment key={ country.name.common }>
                            <Link href={ `/country/${ country.cca3 }` }>
                                <a className={ styles.row }>
                                    {/* <div > */}
                                        <div className={ styles.flag }>
                                            <img src={ country.flags.svg } alt="" />
                                        </div>
                                        <div className={ styles.name }> { country.name.common } </div>
                                        <div className={ styles.population }> { country.population } </div>
                                        <div className={ styles.area }> { country.area ?? 0 } </div>
                                        <div className={ styles.gini }> { Boolean(country?.gini) ? Object.values(country.gini ?? {})[0] : 0 } </div>
                                    {/* </div> */}
                                </a>
                            </Link>
                        </Fragment>
                    )
                }) }

            </div>
        </>
    )
}

export default CountriesTable
