import '../lib/styles.css';

import { Middleware, Store, applyMiddleware, compose, createStore } from 'redux';
import reducer, { rootSaga } from '../reducers';

import type { AppProps } from 'next/app';
import { FC } from 'react';
import Layout from 'components/layout';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist/es/types';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import persistStore from 'redux-persist/lib/persistStore';
import { useStore } from 'react-redux';
import withReduxSaga from 'next-redux-saga';

interface MyAppProps extends AppProps {}

const MyApp: FC<MyAppProps> = ({ Component, pageProps, ...props }) => {
  const store = useStore() as Store & { __persistor: Persistor };

  return (
    <PersistGate persistor={store.__persistor} loading={null}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PersistGate>
  );
};
const sagaMiddleware = createSagaMiddleware();

const configureStore = (initialState: any) => {
  const isServer = typeof window === 'undefined';
  const middlewares: Middleware<any, any, any>[] = [sagaMiddleware];
  if (isServer) {
    return createStore(reducer, undefined, applyMiddleware(...middlewares));
  } else {
    const enhancer =
      process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));
    const store = createStore(reducer, initialState, enhancer) as Store & { __persistor?: Persistor };

    store.__persistor = persistStore(store);

    sagaMiddleware.run(rootSaga);

    return store;
  }
};

const wrapper = createWrapper(configureStore);

export default wrapper.withRedux(withReduxSaga(MyApp));
