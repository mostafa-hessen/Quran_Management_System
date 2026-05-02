import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import HalaqatList from "@/features/halaqat/components/HalaqatList";
import AddHalaqaModal from "@/features/halaqat/components/AddHalaqaModal";

const HalaqatPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4 
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "stone.900", mb: 0.5 }}>
            إدارة الحلقات
          </Typography>
          <Typography variant="body2" sx={{ color: "stone.500" }}>
            إدارة الحلقات التعليمية والمستويات والمواعيد
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddModalOpen(true)}
          sx={{ 
            borderRadius: "12px", 
            px: 3, 
            py: 1.2,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          }}
        >
          إضافة حلقة جديدة
        </Button>
      </Box>

      {/* Search & Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="البحث عن حلقة..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "white",
              "& fieldset": { borderColor: "#f5f5f4" },
              "&:hover fieldset": { borderColor: "primary.light" },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "stone.400" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* List Section */}
      <HalaqatList searchTerm={searchTerm} />

      {/* Add Modal */}
      <AddHalaqaModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </Box>
  );
};

export default HalaqatPage;
