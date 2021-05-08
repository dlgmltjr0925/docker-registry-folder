import '../lib/styles.css';

import withReduxSaga from 'next-redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import { FC } from 'react';
import { useSelector, useStore } from 'react-redux';
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/lib/persistStore';
import createSagaMiddleware from 'redux-saga';

import reducer, { rootSaga, RootState } from '../reducers';

import type { AppProps } from 'next/app';
interface MyAppProps extends AppProps {}

const MyApp: FC<MyAppProps> = ({ Component, pageProps }) => {
  const store = useStore() as Store & { __persistor: Persistor };

  return (
    <PersistGate persistor={store.__persistor} loading={null}>
      <Component {...pageProps} />
    </PersistGate>
  );
};

const sagaMiddleware = createSagaMiddleware();

const configureStore = (initialState: any) => {
  const isServer = typeof window === 'undefined';
  const middlewares: Middleware<any, any, any>[] = [sagaMiddleware];
  if (isServer) {
    console.log('store', 'isServer');
    return createStore(reducer, undefined, applyMiddleware(...middlewares));
  } else {
    console.log('store', 'isClient');
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
