import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/redux/store';
import { TodoProvider } from '../src/store/context/TodoContext';

export default function AppLayout() {
  return (
    <Provider store={store}>
      <TodoProvider>
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Todo List',
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
            }}
          />
        </Tabs>
      </TodoProvider>
    </Provider>
  );
}