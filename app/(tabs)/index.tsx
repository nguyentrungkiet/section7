import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store/redux/store';
import { addTodo, toggleTodo, removeTodo } from '../../src/store/redux/todoSlice';
import { useTodos } from '../../src/store/context/TodoContext';
import TodoItem from '../../src/components/TodoItem';
import { Todo } from '../../src/types/Todo';

const TodoListScreen = () => {
  const [text, setText] = useState('');
  const reduxTodos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();
  const { todos: contextTodos, addTodo: contextAddTodo, toggleTodo: contextToggleTodo, removeTodo: contextRemoveTodo } = useTodos();

  const handleAddTodo = useCallback(() => {
    if (text.trim()) {
      dispatch(addTodo(text));
      contextAddTodo(text);
      setText('');
    }
  }, [text, dispatch, contextAddTodo]);

  const renderTodoItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={() => dispatch(toggleTodo(item.id))}
      onRemove={() => dispatch(removeTodo(item.id))}
    />
  ), [dispatch]);

  const renderContextTodoItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={() => contextToggleTodo(item.id)}
      onRemove={() => contextRemoveTodo(item.id)}
    />
  ), [contextToggleTodo, contextRemoveTodo]);

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  const memoizedReduxTodos = useMemo(() => reduxTodos, [reduxTodos]);
  const memoizedContextTodos = useMemo(() => contextTodos, [contextTodos]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Công Việc</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Thêm công việc mới"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Danh sách Redux:</Text>
      <FlatList
        data={memoizedReduxTodos}
        renderItem={renderTodoItem}
        keyExtractor={keyExtractor}
        style={styles.list}
      />
      <Text style={styles.sectionTitle}>Danh sách Context:</Text>
      <FlatList
        data={memoizedContextTodos}
        renderItem={renderContextTodoItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={<Text>Không có công việc nào.</Text>}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
});

export default TodoListScreen;