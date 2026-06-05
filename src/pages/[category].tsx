import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import { SearchProvider, ViewMode } from '@/components/contexts/SearchContext';
import HomePage from '@/components/pages/HomePage';
import { getHomePageProps, HomePageProps } from '@/lib/getHomePageProps';
import { CATEGORY_PATHS, categoryToViewMode, isValidCategory } from '@/util/viewMode';

interface CategoryPageProps extends HomePageProps {
    initialViewMode: ViewMode;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
    initialViewMode,
    ...homePageProps
}) => {
    return (
        <SearchProvider initialViewMode={initialViewMode}>
            <HomePage {...homePageProps} />
        </SearchProvider>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: CATEGORY_PATHS.map(category => ({ params: { category } })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
    const category = params?.category as string;

    if (!category || !isValidCategory(category)) {
        return { notFound: true };
    }

    const viewMode = categoryToViewMode(category);
    if (!viewMode) {
        return { notFound: true };
    }

    const homePageData = await getHomePageProps();

    return {
        ...homePageData,
        props: {
            ...homePageData.props,
            initialViewMode: viewMode,
        },
    };
};

export default CategoryPage;
