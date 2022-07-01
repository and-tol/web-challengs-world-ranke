import { GetStaticProps } from 'next'
import { ChangeEvent, ReactElement, useState } from 'react';
import { Layout } from 'components/Layout'
import type { NextPage } from 'next'

import styles from '../styles/Home.module.css'
import { DataType } from 'types/dataType';
import { SearchInput } from 'components/SearchInput';
import { CountriesTable } from 'components/CountriesTable';
import { MAIN_URL } from 'constants/index';

interface PropsType {
    children?: never;
    countries: DataType[];
}

const Home: NextPage<PropsType> = ({ countries }): ReactElement => {
    const [keyword, setKeyword] = useState<string>('')
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(keyword) ||
        country.name.official.toLowerCase().includes(keyword) ||
        country.region.toLowerCase().includes(keyword) ||
        country.subregion?.toLowerCase().includes(keyword)
    )

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()

        setKeyword(event.target.value.toLowerCase())
    }

    return (
        <Layout>
            <div className={ styles.input_container }>
                <div className={ styles.counts }>Found { countries.length } countries</div>
                <div className={ styles.input }>
                    <SearchInput placeholder="Filter by name, Region or SubRegion" onInputChange={ onInputChange } />
                </div>
            </div>

            <CountriesTable countries={ filteredCountries } />
        </Layout>
    )
}

export default Home

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps<PropsType> = async (ctx) => {
    const res = await fetch(`${ MAIN_URL }/all`)  // your fetch function here 
    const countries = await res.json();

    return {
        props: {
            countries
        }
    }
}
