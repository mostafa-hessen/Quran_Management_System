import type { StudentFormValues } from "./schemas/studentSchema";
import { StudentStatus, type Gender } from "./types";

// Applying type safety converting empty strings to null for the DB layer
export const formDataToEntity = (data: StudentFormValues) => {
  return {
    student: {
      first_name: data.first_name,
      father_name: data.father_name?.trim() || null,
      grandfather_name: data.grandfather_name?.trim() || null,
      family_name: data.family_name,
      gender: data.gender,
      birth_date: data.birth_date || null,
      address: data.address?.trim() || null,
      status: StudentStatus.ACTIVE,
    },
    phones: data.phones.map((phone) => ({
      phone: phone.phone,
      guardian_relation: phone.guardian_relation,
      label: phone.label,
    }))
  };
};

export const entityToFormData = (entity: any): StudentFormValues => {
  return {
    first_name: entity.first_name || "",
    father_name: entity.father_name || "",
    grandfather_name: entity.grandfather_name || "",
    family_name: entity.family_name || "",
    gender: (entity.gender as Gender) || "ذكر",
    birth_date: entity.birth_date || "",
    address: entity.address || "",
    phones: entity.phones?.length 
      ? entity.phones 
      : [{ phone: "", guardian_relation: "أب", label: "أساسي" }],
  };
};
