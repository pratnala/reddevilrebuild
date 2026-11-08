import clipsLogo from '../assets/logos/clips-logo.png';
import logo from '../assets/logos/logo.png';
import predictionsLogo from '../assets/logos/predictions-logo.png';

const description = 'Follow Manchester United\'s (never-ending) rebuilding journey with Pratyush and Delwyn!';

export const pages = [
    {
        slug: undefined,
        title: 'Red Devil Rebuild',
        description,
        logo,
        category: 'podcast',
        itemsPerPage: 6,
        heroPadding: 'py-5',
        seasonTabs: true
    },
    {
        slug: 'shorts',
        title: 'Shorts | Red Devil Rebuild',
        description,
        logo,
        category: 'short',
        itemsPerPage: 12,
        isShort: true
    },
    {
        slug: 'predictions',
        title: 'Predictions | Red Devil Rebuild',
        description,
        logo: predictionsLogo,
        category: 'prediction',
        itemsPerPage: 6,
        isShort: true
    },
    {
        slug: 'clips',
        title: 'Clips | Red Devil Rebuild',
        description,
        logo: clipsLogo,
        category: 'clip',
        itemsPerPage: 6
    }
];
