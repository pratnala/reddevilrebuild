import clipsLogo from '../assets/logos/clips-logo.png';
import logo from '../assets/logos/logo.png';
import predictionsLogo from '../assets/logos/predictions-logo.png';

const description = 'Follow Manchester United\'s (never-ending) rebuilding journey with Pratyush and Delwyn!';

export const pages = [
    {
        slug: undefined,
        title: 'Red Devil Rebuild',
        description,
        metaDescription: 'Red Devil Rebuild is a Manchester United podcast from Pratyush and Delwyn, covering matches, tactics, transfers and the club\'s long road back.',
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
        metaDescription: 'Quick Manchester United takes and moments from Red Devil Rebuild, in under a minute.',
        logo,
        category: 'short',
        itemsPerPage: 12,
        isShort: true
    },
    {
        slug: 'predictions',
        title: 'Predictions | Red Devil Rebuild',
        description,
        metaDescription: 'Pratyush and Delwyn predict Manchester United\'s results ahead of matchdays on Red Devil Rebuild.',
        logo: predictionsLogo,
        category: 'prediction',
        itemsPerPage: 6,
        isShort: true
    },
    {
        slug: 'clips',
        title: 'Clips | Red Devil Rebuild',
        description,
        metaDescription: 'The best moments from Red Devil Rebuild episodes, in short Manchester United clips.',
        logo: clipsLogo,
        category: 'clip',
        itemsPerPage: 6
    }
];
