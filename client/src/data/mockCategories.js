export const schools = [
    { id: 'lu', name: 'Lunds universitet' },
    { id: 'kth', name: 'KTH' },
    { id: 'chalmers', name: 'Chalmers' },
]

export const programs = [
    { id: 'civing-itek', name: 'Civilingenjör i informations- och kommunikationsteknik', schoolId: 'lu' },
    { id: 'civing-teknisk-matematik', name: 'Civilingenjör i teknisk matematik', schoolId: 'lu' },
    { id: 'civing-datateknik', name: 'Civilingenjör i datateknik', schoolId: 'kth' },
    { id: 'civing-maskinteknik', name: 'Civilingenjör i maskinteknik', schoolId: 'chalmers' },
]

export const courses = [
    { id: 'webbutveckling', name: 'Webbutveckling', programId: 'civing-itek' },
    { id: 'diskret-matematik', name: 'Diskret matematik', programId: 'civing-itek' },
    { id: 'envariabelanalys', name: 'Envariabelanalys', programId: 'civing-teknisk-matematik' },
    { id: 'linjar-algebra', name: 'Linjär algebra', programId: 'civing-teknisk-matematik' },
    { id: 'algoritmer-datastrukturer', name: 'Algoritmer och datastrukturer', programId: 'civing-datateknik' },
    { id: 'mekanik', name: 'Mekanik', programId: 'civing-maskinteknik' },
]
