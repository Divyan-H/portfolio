export const skills = [
  'Python','TensorFlow','PyTorch','OpenCV','NumPy','Pandas',
  'Flask','Streamlit','Git','MySQL','MongoDB','Java',
  'C++','SQL','Tableau','YOLO','Keras','scikit-learn',
  'Deep Learning','Computer Vision','NLP','GIS',
]

export const skillBars = [
  { label: 'Python',     val: 95 },
  { label: 'TensorFlow', val: 90 },
  { label: 'PyTorch',    val: 88 },
  { label: 'OpenCV',     val: 92 },
  { label: 'Pandas',     val: 93 },
  { label: 'SQL',        val: 85 },
]

export const metrics = [
  { num: 5,    suffix: '+', label: 'Internships',  sub: 'Industry Experience' },
  { num: 3,    suffix: '+', label: 'AI Projects',  sub: 'Deployed & Live' },
  { num: 8.31, suffix: '',  label: 'CGPA',         sub: 'SRM IST', decimal: true },
  { num: 22,   suffix: '+', label: 'Skills',       sub: 'Tech Stack' },
]

/* ── Capability clusters for the bento HUD grid ── */
export const skillClusters = {
  aiml: {
    id: '01', title: 'AI / ML Core', layer: 'Foundation Layer',
    tags: ['Python', 'Deep Learning', 'Machine Learning', 'NLP'],
  },
  frameworks: {
    id: '02', title: 'Frameworks & Libraries', layer: 'Core Toolchain',
    tags: ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-learn'],
  },
  genai: {
    id: '03', title: 'GenAI & LLMs', layer: 'Intelligence',
    tags: ['LLMs', 'RAG', 'Prompt Eng.', 'LangChain', 'AI Agents', 'Gemini API', 'GPT', 'Fine-tuning'],
  },
  vision: {
    id: '04', title: 'Computer Vision', layer: 'Perception Layer',
    tags: ['YOLOv8', 'OCR', 'Object Detection', 'Segmentation', 'Pose Estimation', 'Video Analytics', 'Multimodal AI', 'Time Series'],
  },
  data: {
    id: '05', title: 'Data & Deployment', layer: 'Production Layer',
    tags: ['FastAPI', 'SQL', 'REST APIs', 'Firebase', 'Git / GitHub', 'Pandas', 'NumPy'],
  },
}
