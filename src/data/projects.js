export const projects = [
  {
    id: 0,
    num: '01',
    title: 'MedicFood',
    short: 'OCR-powered AI pipeline that scans food packaging to detect ingredients harmful for specific medical conditions — diabetes, hypertension, and allergies.',
    description:
      'An AI-powered OCR pipeline that scans food packaging labels to detect ingredients harmful for users with specific medical conditions — diabetes, hypertension, allergies, and more. Built with TensorFlow and deployed via Flask API.',
    tags: ['OCR', 'TensorFlow', 'Python', 'Flask'],
    techFull: ['OCR', 'TensorFlow', 'Python', 'Flask', 'NLP', 'OpenCV'],
  },
  {
    id: 1,
    num: '02',
    title: 'Vehicle Cut-in Detection',
    short: 'Real-time ADAS system detecting aggressive lane cut-ins using computer vision and deep learning. Processes live feeds to predict dangerous maneuvers.',
    description:
      'Real-time ADAS system detecting aggressive vehicle lane cut-ins using computer vision and deep learning. Processes live camera feeds to predict dangerous maneuvers and reduce highway collision risk.',
    tags: ['OpenCV', 'PyTorch', 'YOLO', 'Python'],
    techFull: ['OpenCV', 'PyTorch', 'YOLO', 'Python', 'CUDA', 'NumPy'],
  },
  {
    id: 2,
    num: '03',
    title: 'Crop Health Monitoring',
    short: 'Satellite imagery + ML pipeline for large-scale crop health analysis with actionable insights for farmers.',
    description:
      'Satellite imagery analysis pipeline using ML for large-scale agricultural monitoring — detecting crop disease, stress zones, and yield indicators from multispectral data with actionable dashboards for farmers.',
    tags: ['Satellite ML', 'NumPy', 'Streamlit', 'GIS'],
    techFull: ['Satellite ML', 'NumPy', 'Streamlit', 'GIS', 'scikit-learn', 'Pandas'],
  },
]
