# Tinkerfolio

Tinkerfolio is a learning management application co-developed by Tinker Tanker. It is designed to facilitate the tracking of assessments, assignments, and projects while allowing users to showcase their skills and projects.

## Technologies Used

1. NextJS framework - Built on top of ReactJS. Chosen for its built-in router and future-proofing for SSR and SSG.
2. React Context - More lightweight than Redux, so Context fits our use case better
3. TailwindCSS - A uility-based CSS framework. Comes with a design system, but does not impose design choices.
4. Axios - For handling APIs
5. Django - For the backend API
6. GitHub Actions - For CI/CD

## Authentication

Tinkerfolio employs token-based authentication for user authentication and authorization. Before each API call, it is first verified if the access token is still valid. The authentication handling code can be found in `_contexts/Auth.Context.js_`.

## License

Tinkerfolio is released under the MIT License. For more information, please refer to the [LICENSE](https://github.com/tinkertanker/LMS_Frontend/blob/main/LICENSE) file.
