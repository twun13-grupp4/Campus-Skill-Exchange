import { useEffect, useState } from 'react'
import { Alert, Autocomplete, Button, Stack, TextField } from '@mui/material'
import { getSchools, getPrograms, getCourses } from '../api/schools'
import { getErrorMessage } from '../api/client'

/**
 * Lets a user narrow questions by school, program, and course.
 * All three are independent and optional - picking one is never required
 * before the others, though picking a school/program narrows the lower
 * dropdowns' options. Reports the current selection to the parent via
 * onChange; fetching questions with it is the parent's job.
 */
function CategoryFilter({ onChange }) {
  const [schools, setSchools] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [loadError, setLoadError] = useState('')

  const [school, setSchool] = useState(null)
  const [program, setProgram] = useState(null)
  const [course, setCourse] = useState(null)

  // Load the full list of schools once.
  useEffect(() => {
    let isActive = true

    getSchools()
      .then((data) => {
        if (isActive) setSchools(data)
      })
      .catch((fetchError) => {
        if (isActive) setLoadError(getErrorMessage(fetchError))
      })

    return () => {
      isActive = false
    }
  }, [])

  // Load programs + courses for the selected school/program (or all, if none selected).
  useEffect(() => {
    let isActive = true

    Promise.all([getPrograms(school?._id), getCourses(school?._id, program?._id)])
      .then(([programsData, coursesData]) => {
        if (!isActive) return
        setPrograms(programsData)
        setCourses(coursesData)
      })
      .catch((fetchError) => {
        if (isActive) setLoadError(getErrorMessage(fetchError))
      })

    return () => {
      isActive = false
    }
  }, [school, program])

  const hasActiveFilter = school || program || course

  function emitChange(next) {
    onChange?.(next)
  }

  function handleSchoolChange(value) {
    setSchool(value)
    // Program/course lists are about to reload for the new school, so
    // whatever was picked before isn't guaranteed to still be valid.
    setProgram(null)
    setCourse(null)
    emitChange({ school: value, program: null, course: null })
  }

  function handleProgramChange(value) {
    setProgram(value)
    // The course list is about to reload for the new program, so whatever
    // was picked before isn't guaranteed to still belong to it.
    setCourse(null)
    emitChange({ school, program: value, course: null })
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
    <Stack spacing={1}>
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
          isOptionEqualToValue={(option, value) => option._id === value._id}
          sx={{ width: 220 }}
          renderInput={(params) => <TextField {...params} label="School" />}
        />

        <Autocomplete
          size="small"
          options={programs}
          value={program}
          onChange={(_, value) => handleProgramChange(value)}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          sx={{ width: 260 }}
          renderInput={(params) => <TextField {...params} label="Program" />}
        />

        <Autocomplete
          size="small"
          options={courses}
          value={course}
          onChange={(_, value) => handleCourseChange(value)}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value._id}
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

      {loadError && <Alert severity="error">{loadError}</Alert>}
    </Stack>
  )
}

export default CategoryFilter
