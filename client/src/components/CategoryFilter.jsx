import { useMemo, useState } from 'react'
import { Autocomplete, Button, Stack, TextField } from '@mui/material'
import { schools, programs, courses } from '../data/mockCategories'

function CategoryFilter({ onChange }) {
  const [school, setSchool] = useState(null)
  const [program, setProgram] = useState(null)
  const [course, setCourse] = useState(null)

  const programOptions = useMemo(
    () =>
      school ? programs.filter((p) => p.schoolId === school.id) : programs,
    [school],
  )

  const courseOptions = useMemo(() => {
    if (program) return courses.filter((c) => c.programId === program.id)
    if (school) {
      const programIds = programs
        .filter((p) => p.schoolId === school.id)
        .map((p) => p.id)
      return courses.filter((c) => programIds.includes(c.programId))
    }
    return courses
  }, [school, program])

  const hasActiveFilter = school || program || course

  function emitChange(next) {
    onChange?.(next)
  }

  function handleSchoolChange(value) {
    setSchool(value)
    // Byter skola -> rensa program/kurs om de inte längre hör till den skolan
    const stillValidProgram =
      value && program && program.schoolId === value.id ? program : null
    const stillValidCourse =
      stillValidProgram && course && course.programId === stillValidProgram.id
        ? course
        : null
    setProgram(stillValidProgram)
    setCourse(stillValidCourse)
    emitChange({
      school: value,
      program: stillValidProgram,
      course: stillValidCourse,
    })
  }

  function handleProgramChange(value) {
    setProgram(value)
    const stillValidCourse =
      value && course && course.programId === value.id ? course : null
    setCourse(stillValidCourse)
    emitChange({ school, program: value, course: stillValidCourse })
  }

  function handleCourseChange(value) {
    setCourse(value)
    emitChange({ school, program, course: value })
  }

  function handleClear() {
    setSchool(null)
    setProgram(null)
    setCourse(null)
    emitChange({ school: null, program: null, course: null })
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      flexWrap="wrap"
      useFlexGap
      alignItems="center"
    >
      <Autocomplete
        size="small"
        options={schools}
        value={school}
        onChange={(_, value) => handleSchoolChange(value)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 220 }}
        renderInput={(params) => <TextField {...params} label="School" />}
      />

      <Autocomplete
        size="small"
        options={programOptions}
        value={program}
        onChange={(_, value) => handleProgramChange(value)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 260 }}
        renderInput={(params) => <TextField {...params} label="Program" />}
      />

      <Autocomplete
        size="small"
        options={courseOptions}
        value={course}
        onChange={(_, value) => handleCourseChange(value)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 220 }}
        renderInput={(params) => <TextField {...params} label="Course" />}
      />

      {hasActiveFilter && (
        <Button
          size="small"
          onClick={handleClear}
          sx={{ textTransform: 'none' }}
        >
          Reset filter
        </Button>
      )}
    </Stack>
  )
}

export default CategoryFilter
