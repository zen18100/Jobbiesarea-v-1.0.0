import { Subject } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'chem',
    code: 'CH 110',
    name: 'Chemistry (CH 110)',
    icon: '🧪',
    iconClass: 'chem-icon',
    description: 'Study of matter, its properties, how and why substances combine or separate.',
    topics: [
      'Atomic Structure & Periodic Properties',
      'Chemical Bonding & Molecular Geometry',
      'Stoichiometry & Reaction Kinetics',
      'Chemical Equilibrium & Acid-Base Systems',
      'Thermodynamics & Electrochemistry',
      'Introductory Organic Chemistry'
    ]
  },
  {
    id: 'physics',
    code: 'PH 110',
    name: 'Physics (PH 110)',
    icon: '⚛️',
    iconClass: 'phy-icon',
    description: 'The science concerned with the nature and properties of matter and energy.',
    topics: [
      'Vectors, Kinematics & Newton\'s Laws',
      'Work, Energy & Linear Momentum',
      'Rotational Dynamics & Gravitation',
      'Oscillations, Waves & Sound',
      'Fluid Mechanics & Thermal Physics',
      'Electrostatics & DC Circuits'
    ]
  },
  {
    id: 'la111',
    code: 'LA 111',
    name: 'Communication Skills (LA 111)',
    icon: '🗣️',
    iconClass: 'comm-icon',
    description: 'Developing effective verbal, non-verbal, and written communication techniques.',
    topics: [
      'Principles of Effective Academic Writing',
      'Oral Presentations & Public Speaking',
      'Reading Comprehension & Critical Analysis',
      'Note-Taking, Summarizing & Paraphrasing',
      'Research Methodologies & Citation (APA/MLA)',
      'Interpersonal & Professional Communication'
    ]
  },
  {
    id: 'ed111',
    code: 'ED 111-211',
    name: 'Engineering Drawing (ED 111-211)',
    icon: '📐',
    iconClass: 'draw-icon',
    description: 'Mastering technical drawings and blueprints for mechanical and structural designs.',
    topics: [
      'Drawing Instruments & Standard Lettering',
      'Geometric Constructions & Orthographic Projections',
      'Isometric & Axonometric Projections',
      'Sectional Views & Dimensioning Standards',
      'Machine Components & Assembly Drawing',
      'Introduction to CAD Software Fundamentals'
    ]
  },
  {
    id: 'cs110',
    code: 'CS 110',
    name: 'Computer Science (CS 110)',
    icon: '💻',
    iconClass: 'comp-icon',
    description: 'Introduction to programming, hardware, software, and fundamental algorithms.',
    topics: [
      'Computer Architecture & Data Representation',
      'Algorithm Design & Flowcharts',
      'Core Programming (Variables, Loops, Conditionals)',
      'Functions, Modularity & Scope',
      'Basic Data Structures (Arrays, Lists, Maps)',
      'Introduction to Object-Oriented Programming'
    ]
  },
  {
    id: 'biology',
    code: 'Bio',
    name: 'Biology (Bio)',
    icon: '🧬',
    iconClass: 'bio-icon',
    description: 'The natural science that studies life and living organisms.',
    topics: [
      'Cell Structure, Organelles & Membrane Transport',
      'Cellular Respiration & Photosynthesis',
      'Mendelian Genetics & DNA Replication',
      'Gene Expression & Protein Synthesis',
      'Evolutionary Biology & Taxonomy',
      'Ecology & Biodiversity Conservation'
    ]
  },
  {
    id: 'math',
    code: 'MA 110',
    name: 'Math (MA 110)',
    icon: '➗',
    iconClass: 'bio-icon',
    description: 'De Morgan\'s laws, sets, algebra and more.',
    topics: [
      'Set Theory, Venn Diagrams & De Morgan\'s Laws',
      'Relations, Functions & Coordinate Geometry',
      'Polynomials, Quadratic Equations & Inequalities',
      'Trigonometry & Polar Coordinates',
      'Complex Numbers & De Moivre\'s Theorem',
      'Limits, Continuity & Introduction to Derivatives'
    ]
  }
];
