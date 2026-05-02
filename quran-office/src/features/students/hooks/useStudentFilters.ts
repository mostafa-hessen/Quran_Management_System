import { useState, useMemo } from 'react';
import type { StudentFilterState, ExtendedStudent } from '../types';

export const useStudentFilters = (students: ExtendedStudent[] = []) => {
  const [filters, setFilters] = useState<StudentFilterState>({
    searchTerm: '',
    phoneTerm: '',
    status: 'all',
    gender: 'all',
    halaqaId: 'all',
    teacherId: 'all',
  });

  const updateFilter = (key: keyof StudentFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      phoneTerm: '',
      status: 'all',
      gender: 'all',
      halaqaId: 'all',
      teacherId: 'all',
    });
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search term (Name)
      const fullName = `${student.first_name} ${student.father_name || ''} ${student.family_name}`.toLowerCase();
      if (filters.searchTerm && !fullName.includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Phone term
      if (filters.phoneTerm) {
        const hasPhone = student.phones?.some(p => p.phone.includes(filters.phoneTerm));
        if (!hasPhone) return false;
      }

      // Status
      if (filters.status !== 'all' && student.status !== filters.status) {
        return false;
      }

      // Gender
      if (filters.gender !== 'all' && student.gender !== filters.gender) {
        return false;
      }

      // Halaqa
      // Note: ExtendedStudent should have halaqa_id or we filter by halaqa_name if provided
      // Assuming ExtendedStudent has halaqa_id from the fetch join
      if (filters.halaqaId !== 'all' && (student as any).halaqa_id !== filters.halaqaId) {
        return false;
      }

      // Teacher
      if (filters.teacherId !== 'all' && (student as any).teacher_id !== filters.teacherId) {
        return false;
      }

      return true;
    });
  }, [students, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredStudents,
  };
};
