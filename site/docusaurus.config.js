// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'JustValidate',
  tagline:
    'Modern, simple, lightweight (~5kb gzip) form validation library written in Typescript, with no dependencies (no JQuery!). Support a wide range of predefined rules, async, files, dates validation, custom error messages and styles, localization. Support writing custom rules and plugins.',
  url: 'https://just-validate.dev/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/horprogs/just-validate-plugin-date/tree/master/site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-Y079DXWNMF',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'JustValidate',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
          height: 60,
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          { to: '/examples', label: 'Examples', position: 'left' },
          { to: '/playground', label: 'Playground', position: 'left' },
          {
            href: 'https://github.com/horprogs/Just-validate',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
              { to: '/examples', label: 'Examples', position: 'left' },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/horprogs/Just-validate',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} JustValidate. Built with Docusaurus. Thanks to 
          <a href="https://margaritaperepecho.com/" target="_blank">Margarita Perepecho</a> for the fresh main's page design. 🔥`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'GZ2IHL2HRY',

        // Public API key: it is safe to commit it
        apiKey: '015b93a43ebe7da9c097fe9940278ab3',

        indexName: 'just-validate',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: 'search',

        //... other Algolia params
      },
    }),
};

module.exports = config;
