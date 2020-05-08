const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Primitive Documentation',
    description: 'Documention for the Primitive Protocol',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: { initialColorMode: 'dark' },
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [
          'Getting Started',
          {
            name: 'Architecture',
            menu: ['Primitives', 'Extensions', 'Systems'],
          },
          'Contracts',
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: ['README.md'],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root:
          'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Primitive Documentation',
        description: 'Documention for the Primitive Protocol',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs',
          templates:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz',
          cache:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\.cache',
          app:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app',
          appPackageJson:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\package.json',
          appTsConfig:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\tsconfig.json',
          gatsbyConfig:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app\\index.html',
          db:
            'C:\\Users\\alexa\\OneDrive\\Documents\\Master\\Blockchain\\primitive-docs\\.docz\\app\\db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
