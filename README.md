
# Interactive Explainable Artificial Intelligence (XAI) System for Student Grade Prediction

## Usgae
The system is broken into a front-end and a back-end. The front-end web pages intend to communicate the back-end server at [http://localhost:7777](http://localhost:7777), as specified in `client/src/const.ts`. You need to modified this constant if the back-end server address is changed.

### Front-End

First, you need to ensure the `Node.js >= v12.22.7` is properly installed on your computer. In this project, we use 
`yarn` for package management, so that you need to install `yarn`:

    npm install -g yarn
Second, you need to install the front-end dependencies properly:

    cd client
    yarn # For first time only
Third, you can launched the front-end development server. The default port of the server is at `3000`.

    yarn start
 Alternatively, you can build the static html pages and deploy on any static page services you like (such as Github pages). The outputs will be generated on the `build` folder.
 
    yarn build

### Back-end
First, make sure you have `Python >= 3.7.3` properly installed on your computer and navigate to the root of the project folder.

Second, you need to install the dependencies properly:

    pip install -r requirements.txt
Third, you can launched the back-end server on port `7777`.

    python -m server.cli --dataset student-grade

 
