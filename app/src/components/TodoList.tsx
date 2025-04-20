import { List, Paper, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import { TodoListProps } from '../types/todo';

const TodoList = ({ todos, onToggle, onDelete, onEdit }: TodoListProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: 'transparent',
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      {todos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            No todos yet. Add one above!
          </Typography>
        </motion.div>
      ) : (
        <List>
          <AnimatePresence>
            {todos.sort((a) => a.completed ? 1 : -1).map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </List>
      )}
    </Paper>
  );
};

export default TodoList;