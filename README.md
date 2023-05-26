# LMS Frontend

Co-developed with TinkerTanker

## Overview

1. NextJS framework - Built on top of ReactJS. Chosen for its built-in router and future-proofing for SSR and SSG.
2. React Context - More lightweight than Redux, so Context fits our use case better
3. TailwindCSS - A uility-based CSS framework. Comes with a design system, but does not impose design choices.\
4. Axios - For handling APIs

## Auth

We store JWT tokens in localStorage. Before each API call, we first verify if the access token is still valid. The auth handling code can be found in _contexts/Auth.Context.js_.
