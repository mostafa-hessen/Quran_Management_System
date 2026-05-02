import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Drawer,
  Grid,
} from "@mui/material";
import {
  Close,
  Assignment,
} from "@mui/icons-material";
import { useCreateHomework } from "../hooks/useHomework";
import { Button, Input, SearchableSelect } from "@/shared/components/ui";
import { useNotification } from "@/shared/hooks/useNotification";
import { useHalaqaSessions } from "@/features/sessions/hooks/useSessions";
import { useHalaqaEnrollments } from "@/features/enrollments/hooks/useEnrollment";

interface AddHomeworkDrawerProps {
  open: boolean;
  onClose: () => void;
  halaqaId: string;
}

const AddHomeworkDrawer: React.FC<AddHomeworkDrawerProps> = ({
  open,
  onClose,
  halaqaId,
}) => {
  const { notify } = useNotification();
  const { data: sessions } = useHalaqaSessions(halaqaId);
  const { data: enrollments } = useHalaqaEnrollments(halaqaId);
  const homeworkMutation = useCreateHomework();

  // Homework form state
  const [hwTitle, setHwTitle] = useState("");
  const [hwType, setHwType] = useState<any>("حفظ");
  const [hwScope, setHwScope] = useState<any>("general");
  const [hwStudentId, setHwStudentId] = useState<string | null>(null);
  const [hwSessionId, setHwSessionId] = useState<string | null>(null);
  const [hwDescription, setHwDescription] = useState("");

  const handleCreateHomework = () => {
    homeworkMutation.mutate(
      {
        title: hwTitle,
        type: hwType,
        scope: hwScope,
        session_id: hwSessionId || undefined,
        student_id: hwScope === "personal" ? (hwStudentId || undefined) : undefined,
        description: hwDescription,
      },
      {
        onSuccess: () => {
          onClose();
          setHwTitle("");
          setHwDescription("");
          notify("تم إسناد الواجب بنجاح", "success");
        },
        onError: (err: any) => {
          notify(err.message || "حدث خطأ أثناء إضافة الواجب", "error");
        },
      }
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          p: 3,
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "stone.800" }}>
          إسناد واجب جديد
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Stack spacing={3}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
            عنوان الواجب *
          </Typography>
          <Input
            fullWidth
            placeholder="مثلاً: حفظ سورة الملك"
            value={hwTitle}
            onChange={(e) => setHwTitle(e.target.value)}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid  size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
              النوع
            </Typography>
            <SearchableSelect
              options={[
                { label: "حفظ", value: "حفظ" },
                { label: "مراجعة", value: "مراجعة" },
                { label: "تجويد", value: "تجويد" },
                { label: "قراءة", value: "قراءة" },
              ]}
              value={hwType}
              onChange={(val) => setHwType(val)}
            />
          </Grid>
          <Grid  size={{ xs: 6 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
              الجلسة المرتبطة
            </Typography>
            <SearchableSelect
              placeholder="اختر الجلسة..."
              options={
                sessions?.map((s) => ({
                  label: `${s.session_date} (${s.status === "completed" ? "تمت" : "مجدولة"})`,
                  value: s.session_id,
                })) || []
              }
              value={hwSessionId}
              onChange={(val) => setHwSessionId(val as string)}
            />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
            النطاق
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant={hwScope === "general" ? "contained" : "outlined"}
              onClick={() => setHwScope("general")}
              sx={{ flex: 1 }}
            >
              الحلقة كاملة
            </Button>
            <Button
              variant={hwScope === "personal" ? "contained" : "outlined"}
              onClick={() => setHwScope("personal")}
              sx={{ flex: 1 }}
            >
              طالب محدد
            </Button>
          </Stack>
        </Box>

        {hwScope === "personal" && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
              اختر الطالب
            </Typography>
            <SearchableSelect
              placeholder="اختر الطالب..."
              options={
                enrollments?.map((e: any) => ({
                  label: `${e.student?.first_name} ${e.student?.family_name}`,
                  value: e.student_id,
                })) || []
              }
              value={hwStudentId}
              onChange={(val) => setHwStudentId(val as string)}
            />
          </Box>
        )}

        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: "stone.500", fontWeight: 600 }}>
            الوصف / التعليمات
          </Typography>
          <Input
            fullWidth
            multiline
            rows={3}
            placeholder="اكتب تعليمات الواجب هنا..."
            value={hwDescription}
            onChange={(e) => setHwDescription(e.target.value)}
          />
        </Box>

        <Button
          colorType="primary"
          fullWidth
          size="large"
          startIcon={<Assignment />}
          disabled={!hwTitle || homeworkMutation.isPending}
          onClick={handleCreateHomework}
        >
          {homeworkMutation.isPending ? "جاري الإسناد..." : "إسناد الواجب"}
        </Button>
      </Stack>
    </Drawer>
  );
};

export default AddHomeworkDrawer;
