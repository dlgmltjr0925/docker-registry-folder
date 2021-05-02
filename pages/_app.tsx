import withReduxSaga from 'next-redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import { FC } from 'react';
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';

import type { AppProps } from 'next/app';

interface MyAppProps extends AppProps {
  store: Store;
}

const App: FC<MyAppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

const sagaMiddleware = createSagaMiddleware();

const makeStore = (initialState: any) => {
  const middlewares: Middleware<any, any, any>[] = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, initialState, enhancer);

  // sagaMiddleware.run();

  return store;
};

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(withReduxSaga(App));
