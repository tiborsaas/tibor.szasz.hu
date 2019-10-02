module.exports = {
  siteMetadata: {
    title: `Tibor Szasz - Brain landfill`,
    name: `TiborSaas`,
    siteUrl: `https://tibor.szasz.hu/blog`,
    pathPrefix: `/blog`,
    description: `This is my blog and personal space to offload stuff from my brain.`,
    hero: {
      heading: `A blog, a journal to infrequently offload some random stuff`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/tiborsaas`,
      },
      {
        name: `github`,
        url: `https://github.com/tiborsaas`,
      },
      {
        name: `instagram`,
        url: `https://instagram.com/tiborsaas`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: false,
        pathPrefix: `/blog`,
        sources: {
          local: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/blog`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
  ],
};
