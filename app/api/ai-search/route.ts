import { NextRequest, NextResponse } from "next/server";

// The complete taxonomy injected as context so the model can do perfect fuzzy matching
const TAXONOMY = {
  subjects: ["Physics", "Chemistry", "Mathematics"],
  chapters: {
    Physics: [
      "Mechanics",
      "Electrostatics",
      "Current Electricity",
      "Electromagnetism",
      "Modern Physics",
      "Optics",
      "Thermodynamics",
      "Waves & Sound",
      "Simple Harmonic Motion",
      "Properties of Matter",
    ],
    Chemistry: [
      "Physical Chemistry - Basics",
      "Thermodynamics",
      "Equilibrium",
      "Electrochemistry & Kinetics",
      "Solutions & States of Matter",
      "Atomic Structure & Bonding",
      "Inorganic Chemistry",
      "Organic Chemistry - Basics",
      "Organic Chemistry - Reactions",
      "Biomolecules & Polymers",
    ],
    Mathematics: [
      "Algebra",
      "Trigonometry",
      "Coordinate Geometry - 2D",
      "Calculus - Differential",
      "Calculus - Integral",
      "Matrices & Determinants",
      "3D Geometry & Vectors",
      "Differential Equations",
      "Statistics & Probability",
      "Sets, Relations & Functions",
    ],
  },
  topics: {
    // Physics
    Mechanics: [
      "Kinematics",
      "Projectile Motion",
      "Circular Motion",
      "Newton's Laws of Motion",
      "Work-Energy-Power",
      "Centre of Mass & Collisions",
      "Rotational Motion",
      "Gravitation",
      "Fluid Mechanics",
      "Elasticity",
      "Surface Tension",
      "Thermal Expansion",
      "Error Analysis",
      "Dimensions",
    ],
    Electrostatics: [
      "Coulomb's Law",
      "Electric Field",
      "Electric Field & Potential",
      "Electric Potential",
      "Electric Flux & Gauss Law",
      "Gauss's Law",
      "Dipole",
      "Capacitance",
      "Capacitors",
      "RC Circuits",
    ],
    "Current Electricity": [
      "Ohm's Law",
      "Ohm's Law & Resistance",
      "Kirchhoff's Laws",
      "Galvanometer",
      "Measuring Instruments",
    ],
    Electromagnetism: [
      "Biot-Savart & Ampere's Law",
      "Magnetic Force & Field",
      "Magnetic Force on Charges",
      "Magnetic Force on Current",
      "Motion in Magnetic Field",
      "Permanent Magnets & Magnetisation",
      "EM Induction",
      "EMI",
      "AC Circuits",
      "Alternating Current",
      "EM Waves",
      "Electromagnetic Waves",
    ],
    "Modern Physics": [
      "Photoelectric Effect",
      "de Broglie",
      "Dual Nature of Matter",
      "Bohr Model",
      "Atomic Models",
      "Atomic Structure",
      "Nuclear Physics",
      "Radioactivity",
      "Semiconductors",
      "Communication Systems",
    ],
    Optics: [
      "Ray Optics",
      "Wave Optics",
      "Interference",
      "Diffraction",
      "Polarization",
      "Interference & Diffraction",
      "Young's Double Slit Experiment",
    ],
    "Thermodynamics Chemistry": [
      "Laws of Thermodynamics",
      "Heat & Calorimetry",
      "Heat Transfer",
      "Kinetic Theory of Gases",
      "Entropy & Carnot Engine",
    ],
    "Waves & Sound": [
      "Wave Motion",
      "Superposition & Standing Waves",
      "Beats",
      "Doppler Effect",
    ],
    "Simple Harmonic Motion": [
      "SHM Basics",
      "SHM Equation",
      "Energy in SHM",
      "Pendulum",
      "Spring-Mass Systems",
    ],
    "Properties of Matter": [
      "Elasticity",
      "Fluid Mechanics",
      "Surface Tension",
      "Thermal Expansion",
      "Viscosity",
    ],
    // Chemistry
    "Physical Chemistry - Basics": [
      "Mole Concept",
      "Stoichiometry",
      "Equivalent Concept",
      "Gas Laws",
      "Ideal/Real Gases",
      "Redox",
      "Environmental Chemistry",
    ],
    "Thermodynamics Chemistry": [
      "Enthalpy",
      "Entropy",
      "Gibbs Energy",
      "Gibbs Free Energy",
      "Hess's Law",
      "Spontaneity",
      "Laws of Thermodynamics",
    ],
    "Equilibrium": [
      "Chemical Equilibrium",
      "Kp & Kc",
      "Le Chatelier's Principle",
      "Ionic Equilibrium",
      "Acids & Bases",
      "pH",
      "pH & Buffer",
      "Buffers",
      "Ksp",
    ],
    "Electrochemistry & Kinetics": [
      "Electrochemical Cells",
      "Galvanic Cells",
      "Electrochemical Series",
      "Nernst Equation",
      "Electrolysis",
      "Electrochemistry",
      "Rate Laws",
      "Integrated Rate Laws",
      "Activation Energy",
      "Activation Energy & Arrhenius",
      "Arrhenius Equation",
      "First & Second Order",
    ],
    "Solutions & States of Matter": [
      "Colligative Properties",
      "Raoult's Law",
      "Osmosis",
      "Liquefaction",
      "Crystal Structures",
      "Colloidal Chemistry",
      "Colloids",
      "Surface Chemistry",
    ],
    "Atomic Structure & Bonding": [
      "Atomic Structure",
      "Atomic Models",
      "Bohr Model",
      "Quantum Numbers",
      "Hybridization",
      "Chemical Bonding",
      "VSEPR",
      "MO Theory",
      "Hydrogen Bonding",
      "Intermolecular Forces",
    ],
    "Inorganic Chemistry": [
      "Periodic Table",
      "s-Block",
      "p-Block",
      "d & f Block",
      "Coordination Compounds",
      "Metallurgy",
      "Qualitative Analysis",
      "Redox Reactions",
    ],
    "Organic Chemistry - Basics": [
      "General Organic Chemistry",
      "IUPAC",
      "Isomerism",
      "GOC (Inductive, Resonance, Hyperconjugation)",
      "Reaction Mechanism",
      "Reaction Intermediates",
      "Purification Techniques",
      "Acidic & Basic Character",
    ],
    "Organic Chemistry - Reactions": [
      "Alkanes",
      "Alkenes & Alkynes",
      "Aromatic Compounds",
      "Benzene & Aromaticity",
      "Haloalkanes",
      "Alcohols",
      "Alcohols & Ethers",
      "Aldehydes & Ketones",
      "Carboxylic Acids & Derivatives",
      "Amines",
      "Phenols",
      "Named Reactions",
      "Nucleophilic Substitution",
    ],
    "Biomolecules & Polymers": [
      "Carbohydrates",
      "Amino Acids & Proteins",
      "Proteins",
      "Nucleic Acids",
      "Polymers",
      "Biomolecules",
      "Vitamins",
      "Chemistry in Everyday Life",
    ],
    // Mathematics
    Algebra: [
      "Quadratic Equations",
      "Sequences & Series",
      "Binomial Theorem",
      "Complex Numbers",
      "Permutations & Combinations",
      "Mathematical Induction",
      "Logarithms",
    ],
    Trigonometry: [
      "Ratios & Identities",
      "Compound Angle",
      "Trigonometric Identities",
      "Trigonometric Equations",
      "Inverse Trigonometry",
      "Inverse Trig Functions",
      "Properties of Triangles",
      "Heights & Distances",
    ],
    "Coordinate Geometry - 2D": [
      "Straight Lines",
      "Circles",
      "Parabola",
      "Ellipse",
      "Hyperbola",
      "Hyperbola & Ellipse",
    ],
    "Calculus - Differential": [
      "Limits",
      "Limits & Continuity",
      "Continuity & Differentiability",
      "Differentiation",
      "Applications of Derivatives",
      "Functions",
      "Types of Functions",
    ],
    "Calculus - Integral": [
      "Indefinite Integration",
      "Definite Integration",
      "Integration by Parts",
      "Area Under Curves",
      "Beta/Gamma Functions",
    ],
    "Matrices & Determinants": [
      "Matrix Operations",
      "Determinants",
      "Properties of Determinants",
      "System of Linear Equations",
      "Systems of Equations",
      "Inverse",
      "Types of Matrices",
    ],
    "3D Geometry & Vectors": [
      "Vectors",
      "Direction Cosines",
      "Lines in 3D",
      "Planes",
      "Planes in 3D",
      "Coplanarity",
    ],
    "Differential Equations": [
      "Variable Separable",
      "Homogeneous ODE",
      "Linear ODE",
      "Homogeneous",
    ],
    "Statistics & Probability": [
      "Probability Basics",
      "Conditional Probability",
      "Bayes' Theorem",
      "Bayes Theorem",
      "Binomial Distribution",
      "Distributions",
      "Mean/Median/Mode",
      "Variance",
      "Statistics",
    ],
    "Sets, Relations & Functions": [
      "Sets",
      "Relations",
      "Functions",
      "Inverse Trig Functions",
      "Mathematical Reasoning",
      "Reasoning & Mathematical Logic",
    ],
  },
};

const TAXONOMY_STRING = JSON.stringify(TAXONOMY, null, 2);

const SYSTEM_PROMPT = `You are an AI search assistant for a JEE Main exam analytics dashboard. Your job is to parse a student's natural language query and extract filter parameters that should be applied to the dashboard.

The dashboard has these exact filter fields:
- domains: array of subjects → valid values: "Physics", "Chemistry", "Mathematics" (use "Maths" for display but "Mathematics" internally)  
- chapters: array of chapter names (must exactly match the taxonomy)
- topics: array of topic names (must exactly match the taxonomy)
- categories: array of question types → valid values: "Fact", "Formula", "Conceptual"
- difficulties: array → valid values: "Easy", "Medium", "Hard"
- yearRange: [startYear, endYear] → valid years: 2021 to 2025

Here is the COMPLETE taxonomy of subjects → chapters → topics available in the dataset:
${TAXONOMY_STRING}

MATCHING RULES:
1. Fuzzy match user terms to the taxonomy. "buffers" → topic "Buffers" in chapter "Equilibrium" in subject "Chemistry"
2. "organic" → chapters "Organic Chemistry - Basics" and "Organic Chemistry - Reactions"
3. Subject aliases: "maths"/"math" → "Mathematics", "phy"/"phys" → "Physics", "chem" → "Chemistry"
4. If user says "last 2 years" → yearRange: [2024, 2025]. "recent" → [2023, 2025]. "all years" → [2021, 2025]
5. Difficulty aliases: "tough"/"hard questions" → "Hard", "easy"/"simple" → "Easy"
6. Category aliases: "formula based"/"numerical" → "Formula", "theory"/"concept" → "Conceptual", "fact based"/"memory" → "Fact"
7. If a topic matches multiple chapters (e.g. "thermodynamics" exists in both Physics and Chemistry), include BOTH chapters
8. Be generous with matching — if user says "kinematics" include the topic even if they don't mention Physics/Mechanics
9. Only set filters you're confident about. Don't guess wildly.
10. If the query is completely unrelated to JEE (e.g. "what's the weather"), set all filters to empty and explain

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation outside JSON):
{
  "filters": {
    "domains": [],
    "chapters": [],
    "topics": [],
    "categories": [],
    "difficulties": [],
    "yearRange": [2021, 2025]
  },
  "explanation": "One sentence explaining what filters were applied and why",
  "confidence": "high" | "medium" | "low",
  "noMatch": false,
  "noMatchMessage": ""
}

If noMatch is true (query is irrelevant or impossible to map), set all filter arrays to empty, noMatch to true, and noMatchMessage to a friendly explanation.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 503 },
    );
  }

  const { query } = await req.json();
  if (!query?.trim()) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query.trim() }] }],
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Gemini AI service error", raw: errorText }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const parsed = JSON.parse(raw);
    // Ensure yearRange always has valid values
    if (!parsed.filters.yearRange || parsed.filters.yearRange.length !== 2) {
      parsed.filters.yearRange = [2021, 2025];
    }
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to parse AI response", message: error.message },
      { status: 500 },
    );
  }
}
