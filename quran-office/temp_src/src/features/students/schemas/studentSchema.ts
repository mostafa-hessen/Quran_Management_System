import { z } from "zod";
import { GENDER_OPTIONS, RELATION_OPTIONS, PHONE_LABEL_OPTIONS } from "../types";

export const phoneSchema = z.object({
  phone_id: z.string().optional(),
  phone: z.string().regex(/^01\d{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 أرقام"),
  guardian_relation: z.enum(RELATION_OPTIONS),
  label: z.enum(PHONE_LABEL_OPTIONS),
});

export const studentSchema = z.object({
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  father_name: z.string().optional(),
  grandfather_name: z.string().optional(),
  family_name: z.string().min(1, "اسم العائلة مطلوب"),
  gender: z.enum(GENDER_OPTIONS),
  birth_date: z.string().optional().nullable(),
  address: z.string().optional(),
  phones: z.array(phoneSchema).default([]),
});


export type StudentFormValues = z.infer<typeof studentSchema>;
export type PhoneFormValues = z.infer<typeof phoneSchema>;

export const DEFAULT_STUDENT_FORM_VALUES: StudentFormValues = {
  first_name: "",
  father_name: "",
  grandfather_name: "",
  family_name: "",
  gender: "ذكر",
  birth_date: "",
  address: "",
  phones: [{ phone: "", guardian_relation: "أب", label: "أساسي" }],

};
