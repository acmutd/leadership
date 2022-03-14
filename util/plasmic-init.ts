import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "c8zUhfuHpW9hNwNfWdVRzW",  // ID of a project you are using
      token: "W6casV1pIRfWEWmSKY3iqF6Rwm8QMWP3cVgh7jvYk3w43M0mwNduSqcdjLSYLa7f2PjQ64J5w4QjVxPJDg"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})