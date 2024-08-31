# section7
**Bước 1: Thiết lập dự án**
1. Tạo một dự án React Native mới:
   npx create-expo-app TodoApp
   cd TodoApp
2. Cài đặt các dependencies cần thiết:
    npm install @react-navigation/native @react-navigation/native-stack react-redux @reduxjs/toolkit
**Bước 2: Cấu trúc thư mục**
Tạo cấu trúc thư mục sau trong thư mục src:
     mkdir src
    cd src
    mkdir components
    mkdir screens
    mkdir store
    cd store
    mkdir context
    mkdir redux
    cd ..
    mkdir types
    cd ..
**Bước 3: Định nghĩa kiểu Todo**
Tạo file src/types/Todo.ts:
    export interface Todo {
      id: string;
      text: string;
      completed: boolean;
    }
**Bước 4: Thiết lập Context API**
Tạo file src/store/context/TodoContext.tsx:   
          import React, { createContext, useState, useContext, ReactNode } from 'react';
          import { Todo } from '../../types/Todo';
          
          type TodoContextType = {
            todos: Todo[];
            addTodo: (text: string) => void;
            toggleTodo: (id: string) => void;
            removeTodo: (id: string) => void;
          };
          
          const TodoContext = createContext<TodoContextType>({
            todos: [],
            addTodo: () => {},
            toggleTodo: () => {},
            removeTodo: () => {},
          });
          
          export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
            const [todos, setTodos] = useState<Todo[]>([]);
          
            const addTodo = (text: string) => {
              setTodos((currentTodos) => [
                ...currentTodos,
                { id: Date.now().toString(), text, completed: false },
              ]);
            };
          
            const toggleTodo = (id: string) => {
              setTodos((currentTodos) =>
                currentTodos.map((todo) =>
                  todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
              );
            };
          
            const removeTodo = (id: string) => {
              setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
            };
          
            return (
              <TodoContext.Provider value={{ todos, addTodo, toggleTodo, removeTodo }}>
                {children}
              </TodoContext.Provider>
            );
          };
          
          export const useTodos = () => useContext(TodoContext);
**Bước 5: Thiết lập Redux**
Tạo file src/store/redux/todoSlice.ts:
      import { createSlice, PayloadAction } from '@reduxjs/toolkit';
      import { Todo } from '../../types/Todo';
      
      interface TodoState {
        todos: Todo[];
      }
      
      const initialState: TodoState = {
        todos: [],
      };
      
      const todoSlice = createSlice({
        name: 'todos',
        initialState,
        reducers: {
          addTodo: (state, action: PayloadAction<string>) => {
            state.todos.push({
              id: Date.now().toString(),
              text: action.payload,
              completed: false,
            });
          },
          toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((todo) => todo.id === action.payload);
            if (todo) {
              todo.completed = !todo.completed;
            }
          },
          removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
          },
        },
      });
      
      export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
      export default todoSlice.reducer;
Tạo file src/store/redux/store.ts:
      import { configureStore } from '@reduxjs/toolkit';
      import todoReducer from './todoSlice';
      
      export const store = configureStore({
        reducer: {
          todos: todoReducer,
        },
      });
      
      export type RootState = ReturnType<typeof store.getState>;
      export type AppDispatch = typeof store.dispatch;
**Bước 6: Tạo components**
Tạo file src/components/TodoItem.tsx:
    import React from 'react';
    import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
    import { Todo } from '../types/Todo';
    
    interface TodoItemProps {
      todo: Todo;
      onToggle: () => void;
      onRemove: () => void;
    }
    
    const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onRemove }) => {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={onToggle} style={styles.todoText}>
            <Text style={[styles.text, todo.completed && styles.completed]}>
              {todo.text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      todoText: {
        flex: 1,
      },
      text: {
        fontSize: 16,
      },
      completed: {
        textDecorationLine: 'line-through',
        color: '#888',
      },
      removeButton: {
        padding: 5,
      },
      removeButtonText: {
        color: 'red',
        fontWeight: 'bold',
      },
    });
    
    export default TodoItem;
**Bước 7: Tạo màn hình**
Tạo file src/screens/TodoListScreen.tsx:
    import React, { useState } from 'react';
    import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
    import { useSelector, useDispatch } from 'react-redux';
    import { RootState } from '../store/redux/store';
    import { addTodo, toggleTodo, removeTodo } from '../store/redux/todoSlice';
    import { useTodos } from '../store/context/TodoContext';
    import TodoItem from '../components/TodoItem';
    
    const TodoListScreen = () => {
      const [text, setText] = useState('');
      const reduxTodos = useSelector((state: RootState) => state.todos.todos);
      const dispatch = useDispatch();
      const { todos: contextTodos, addTodo: contextAddTodo, toggleTodo: contextToggleTodo, removeTodo: contextRemoveTodo } = useTodos();
    
      const handleAddTodo = () => {
        if (text.trim()) {
          dispatch(addTodo(text));
          contextAddTodo(text);
          setText('');
        }
      };
    
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Add a new todo"
          />
          <Button title="Add Todo" onPress={handleAddTodo} />
          <FlatList
            data={reduxTodos}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={() => dispatch(toggleTodo(item.id))}
                onRemove={() => dispatch(removeTodo(item.id))}
              />
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={contextTodos}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={() => contextToggleTodo(item.id)}
                onRemove={() => contextRemoveTodo(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
    });
    
    export default TodoListScreen;
**Bước 8: Cập nhật index.tsx**
Thay đổi nội dung file index.tsx ở thư mục gốc:
    import React from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import { Provider } from 'react-redux';
    import { store } from './src/store/redux/store';
    import { TodoProvider } from './src/store/context/TodoContext';
    import TodoListScreen from './src/screens/TodoListScreen';
    
    const Stack = createNativeStackNavigator();
    
    export default function App() {
      return (
        <Provider store={store}>
          <TodoProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Todo List" component={TodoListScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </TodoProvider>
        </Provider>
      );
    }
**Bước 9: Chạy ứng dụng**
Chạy ứng dụng bằng lệnh: 
  npx start
