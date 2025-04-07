import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { FixedSizeList } from "react-window";

function CategoryList({ categories, onSelectCategory, selectedCategory }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
    setIsDialogOpen(false); // đóng dialog sau khi chọn
  };

  const renderRow = ({ index, style }) => {
    const category = categories[index];

    return (
      <ListItem style={style} key={category.id} component="div" disablePadding>
        <ListItemButton onClick={() => handleCategorySelect(category)}>
          <ListItemText primary={category.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={toggleDialog}
        fullWidth
        sx={{ mb: 2 }}
      >
        {selectedCategory?.name || "CHỌN DANH MỤC"}
      </Button>

      <Dialog open={isDialogOpen} onClose={toggleDialog} fullWidth maxWidth="sm">
        <DialogTitle>Chọn danh mục</DialogTitle>
        <DialogContent>
          <FixedSizeList
            height={400}
            width="100%"
            itemSize={46}
            itemCount={categories.length}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CategoryList;
