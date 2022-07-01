import { GetServerSideProps, NextPage } from 'next';
import { ReactElement, useEffect, useId, useState } from 'react';

import { DataType } from 'types/dataType';

import { Layout } from 'components/Layout';

import styles from './CountryPage.module.css'
import { getCountry } from 'helpers/getCountry';


interface PropsType {
    children?: never,
    country: DataType
}

const CountryPage: NextPage<PropsType> = ({ country }): ReactElement => {
    const id = useId();
    const [borders, setBorders] = useState<DataType[][] | undefined | void>([])

    // const borders = country?.borders?.map(b => b).join(', ') ?? 'No border countries'

    const getBorders = async () => {
        if (country.borders) {
            await Promise.all(
                country.borders.map(border => getCountry(border))).then((value) => {
                    setBorders(value)
                    console.log('value =>', value);
                }, reason => {
                    console.log('reason =>', reason)
                });
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        getBorders()

        return () => controller.abort()
    }, [])

    return (
        <Layout title={ country.name?.common }>
            <div className={ styles.container }>
                <div className={ styles.container__left }>
                    <div className={ styles.overview_panel }>
                        <img src={ country.flags?.svg } alt={ country.name?.common } />

                        <h1 className={ styles.overview_name }>{ country.name?.official } </h1>
                        <p className={ styles.overview_region }>{ country.region } </p>

                        <div className={ styles.overview_numbers }>
                            <div className={ styles.overview_population }>
                                <p className={ styles.value }>{ country.population } </p>
                                <p className={ styles.label }>Population</p>
                            </div>
                            <div className={ styles.overview_area }>
                                <p className={ styles.value }>{ country.area } </p>
                                <p className={ styles.label }>Area</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={ styles.container__right }>
                    <div className={ styles.details_panel }>
                        <h4 className={ styles.details_panel__heading }>Details</h4>

                        <div className={ styles.details_panel__row }>
                            <div className={ styles.details_panel__label }>Language</div>
                            <div className={ styles.details_panel__value }>{ Object.values(country.languages).join(', ') } </div>
                        </div>
                        <div className={ styles.details_panel__row }>
                            <div className={ styles.details_panel__label }>Currencies</div>
                            <div className={ styles.details_panel__value }>
                                { Object.values(country.currencies)
                                    .map(c => c.name)
                                    .join(', ') }
                            </div>
                        </div>
                        <div className={ styles.details_panel__row }>
                            <div className={ styles.details_panel__label }>Native Name</div>
                            <div className={ styles.details_panel__value }>
                                { Object.values(country.name.nativeName)
                                    .map(n => n.common)
                                    .join(', ') }
                            </div>
                        </div>
                        <div className={ styles.details_panel__row }>
                            <div className={ styles.details_panel__label }>Gini</div>
                            <div className={ styles.details_panel__value }>
                                { Boolean(country.gini) ? `${Object.values(country.gini ?? {})[0]}%` : 0 }
                            </div>
                        </div>

                        <div className={ styles.details_panel_borders }>
                            <div className={ styles.details_panel_borders__label }>Neighbouring countries</div>
                            <div className={ styles.details_panel_borders__container }>
                                <>
                                    { borders && Boolean(borders?.length) && borders?.map(b => {
                                        return (
                                            <div key={id} className={ styles.details_panel_borders__country }>
                                                <img src={ b[0].flags?.svg } alt={ b[0].name.common } />
                                                <div>{ b[0].name.common }</div>
                                            </div>
                                        )
                                    }) }
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
}


export const getServerSideProps: GetServerSideProps<PropsType> = async ({ params }) => {
    const country = await getCountry(params?.id);

    return {
        props: {
            country: country[0]
        }
    }
}

export default CountryPage
