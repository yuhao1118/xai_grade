import os

import pandas as pd

from ml.dataset import Dataset

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'sample_data')

def load_student_grade_dataset():
    description = pd.read_csv(os.path.join(DATA_DIR, 'student-grade/description.csv'), index_col='name').to_dict('index')

    for _, info in description.items():
        if type(info['category']) is str:
            info['category'] = info['category'].split(':')

    data_df = pd.read_csv(os.path.join(DATA_DIR, 'student-grade/student_grade.csv'), usecols=description.keys())

    return Dataset('student-grade', data_df, description, 'G3')