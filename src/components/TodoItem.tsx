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