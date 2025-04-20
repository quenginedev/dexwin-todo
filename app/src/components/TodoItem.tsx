import { useState } from 'react';
import {
  ListItem,
  Checkbox,
  IconButton,
  TextField,
  Box,
  ListItemText,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoItemProps } from '../types/todo';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    if (isEditing && editedTitle.trim() !== todo.title) {
      onEdit(todo.id, editedTitle.trim());
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <ListItem
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          mb: 1,
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        secondaryAction={
          <Box>
            <IconButton edge="end" onClick={handleEdit} sx={{ mr: 1 }}>
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
            <IconButton edge="end" onClick={() => onDelete(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      >
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          sx={{ '&.Mui-checked': { color: 'primary.main' } }}
        />
        <AnimatePresence mode="wait">
          {isEditing ? (
            <TextField
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="standard"
              autoFocus
              sx={{ ml: 2 }}
            />
          ) : (
            <ListItemText
              primary={todo.title}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              }}
            />
          )}
        </AnimatePresence>
      </ListItem>
    </motion.div>
  );
};

export default TodoItem;