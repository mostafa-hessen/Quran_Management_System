import { z } from "zod";

export const scheduleSchema = z.object({
  day_of_week: z.string().min(1, "اليوم مطلوب"),
  start_time: z.string().min(1, "وقت البدء مطلوب"),
  end_time: z.string().min(1, "وقت الانتهاء مطلوب"),
});

export const halaqaSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  teacher_id: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  capacity: z.number().min(1, "السعة يجب أن تكون 1 على الأقل"),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  schedules: z.array(scheduleSchema),
});

export type HalaqaFormData = z.infer<typeof halaqaSchema>;
